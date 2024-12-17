import { first, includes, reject } from 'lodash';
import db from '../models/index';
import emailService from '../services/emailService';
require('dotenv').config();
import { v4 as uuid4 } from 'uuid';
let buildUrlEmail = (scheduleId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&scheduleId=${scheduleId}`;
    return result;
}
let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.schedule || !data.patientId || !data.reason) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })

            }
            else {
                let patient = await db.Patient_Record.findOne({
                    where: {
                        id: data.patientId
                    },
                    include: [
                        {
                            model: db.Booking,
                            attributes: [],
                            required: true,
                            include: [
                                {
                                    model: db.Schedule,
                                    where: {
                                        doctorId: data.schedule.doctorId,
                                        date: data.schedule.date
                                    },
                                    required: true
                                }
                            ]
                        },
                    ],
                    raw: true,
                    nest: true

                })
                if (!patient) {
                    let token = uuid4();
                    let book = await db.Booking.create({ // đặt lịch
                        statusId: 'S2',
                        patientId: data.patientId,
                        scheduleId: data.schedule.id,
                        token: token,
                        reason: data.reason
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Succeed"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Missing'
                    })
                }


            }

        }
        catch (e) {
            reject(e);
        }
    })
}
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.scheduleId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        scheduleId: data.scheduleId,
                        token: data.token,
                    },
                    raw: false // update cần raw:false
                })

                if (appointment) {
                    if (appointment.statusId === 'S1') {
                        appointment.statusId = 'S2';
                        await appointment.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Update the appointment succeed!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Appointment has been activated'
                        })
                    }

                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Appointment does not exist!'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}
let postBookAppointmentNoSignIn = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.email || !data.phoneNumber ||
                !data.province || !data.district || !data.gender || !data.address || !data.reason
                || !data.schedule || !data.language || !data.dateOfBirth
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                // let patient = await db.Patient_Record.findOne({
                //     where: {
                //         email:data.email
                //     },
                //     include: [
                //         {
                //             model: db.Booking,
                //             attributes: [],
                //             required: true,
                //             include: [
                //                 {
                //                     model: db.Schedule,
                //                     where: {
                //                         doctorId: data.schedule.doctorId,
                //                         date: data.schedule.date
                //                     },
                //                     required: true 
                //                 }
                //             ]
                //         },
                //     ],
                //     raw: true,
                //     nest: true

                // })


                let token = uuid4();
                let patient_record = await db.Patient_Record.create({ // thêm người bệnh 
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    dateOfBirth: data.dateOfBirth,
                    bhyt: data.bhyt,
                    provinceId: data.province,
                    districtId: data.district,
                    wardId: data.ward,
                    address: data.address,
                    gender: data.gender,

                })

                if (patient_record) {
                    let book = await db.Booking.create({ // đặt lịch
                        statusId: 'S1',
                        patientId: patient_record.id,
                        scheduleId: data.schedule.id,
                        token: token,
                        reason: data.reason
                    })
                    console.log('ssd', data)
                    await emailService.sendSimpleEmail({
                        reciverEmail: data.email,
                        patientName: `${data.firstName} ${data.lastName}`,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        redirectLink: buildUrlEmail(data.schedule.id, token),
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllPatientRecord = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = await db.Patient_Record.findAll({
                    where: {
                        idAccount: idInput
                    },
                    attributes: {
                        exclude: ['idAccount']
                    },
                    include: [
                        { model: db.Allcode, as: 'relationshipTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let createNewPatientRecord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idAccount || !data.firstName || !data.lastName || !data.email || !data.provinceId ||
                !data.districtId || !data.gender || !data.relationship || !data.dateOfBirth
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Patient_Record.create({
                    idAccount: data.idAccount,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    dateOfBirth: data.dateOfBirth,
                    bhyt: data.bhyt,
                    provinceId: data.provinceId,
                    districtId: data.districtId,
                    wardId: data.wardId,
                    address: data.address,
                    gender: data.gender,
                    relationship: data.relationship
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
let updatePatientRecord = (data) => {
    console.log('ssd', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.firstName || !data.lastName || !data.email || !data.provinceId ||
                !data.districtId || !data.gender || !data.relationship || !data.dateOfBirth
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let patient = await db.Patient_Record.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })
                if (patient) {
                    patient.firstName = data.firstName,
                        patient.lastName = data.lastName,
                        patient.email = patient.email,
                        patient.phoneNumber = data.phoneNumber,
                        patient.dateOfBirth = data.dateOfBirth,
                        patient.bhyt = data.bhyt,
                        patient.provinceId = data.provinceId,
                        patient.districtId = data.districtId,
                        patient.wardId = data.wardId,
                        patient.address = data.address,
                        patient.gender = data.gender,
                        patient.relationship = data.relationship
                    await patient.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'update succed'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'no patient'
                    })
                }

            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllBookingAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Booking.findAll({
                where: {
                    statusId: 'S2'
                },
                attributes: ['id', 'reason'],
                include: [
                    {
                        model: db.Schedule,
                        attributes: ['date'],
                        include: [
                            {
                                model: db.User,
                                as: 'doctorData',
                                attributes: ['firstName', 'lastName'],
                                include: [
                                    {
                                        model: db.Doctor_Infor,
                                        attributes: [],
                                        include: [
                                            {
                                                model: db.Specialty,
                                                attributes: ['nameVi', 'nameEn'],
                                            },
                                            {
                                                model: db.Clinic,
                                                attributes: ['name', 'address'],
                                            },
                                            {
                                                model: db.Allcode,
                                                as: 'positionData',
                                                attributes: ['valueVi', 'valueEn'],
                                            }

                                        ]
                                    }
                                ]
                            },
                            {
                                model: db.Allcode,
                                as: 'timeTypeData',
                                attributes: ['valueVi', 'valueEn'],
                            }
                        ]
                    },
                    {
                        model: db.Patient_Record,
                        attributes: ['lastName', 'firstName', 'dateOfBirth', 'email', 'provinceId', 'districtId'],
                    }
                ],
                raw: true,
                nest: true
            })
            if (!data) data = []
            resolve({
                errCode: 0,
                data: data
            })


        } catch (e) {
            reject(e)
        }
    })
}

let confirmAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false // update cần raw:false
                })

                if (appointment) {
                    if (appointment.statusId === 'S2') {
                        appointment.statusId = 'S3';
                        await appointment.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Update the appointment succeed!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Appointment has been activated'
                        })
                    }

                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Appointment does not exist!'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}

let getBookingById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            else {
                let data = await db.Booking.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['id', 'reason'],
                    include: [
                        {
                            model: db.Schedule,
                            attributes: ['date'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'doctorData',
                                    attributes: ['firstName', 'lastName'],
                                    include: [
                                        {
                                            model: db.Doctor_Infor,
                                            attributes: [],
                                            include: [
                                                {
                                                    model: db.Specialty,
                                                    attributes: ['nameVi', 'nameEn'],
                                                },
                                                {
                                                    model: db.Clinic,
                                                    attributes: ['name', 'address'],
                                                    include: [
                                                        {
                                                            model: db.Allcode,
                                                            as: 'provinceData',
                                                            attributes: ['valueVi', 'valueEn'],
                                                        }
                                                    ]
                                                },
                                                {
                                                    model: db.Allcode,
                                                    as: 'positionData',
                                                    attributes: ['valueVi', 'valueEn'],
                                                }

                                            ]
                                        }
                                    ]
                                },
                                {
                                    model: db.Allcode,
                                    as: 'timeTypeData',
                                    attributes: ['valueVi', 'valueEn'],
                                }
                            ]
                        },
                        {
                            model: db.Patient_Record,
                            attributes: ['id', 'lastName', 'firstName', 'dateOfBirth', 'email', 'provinceId', 'districtId', 'wardId', 'address'],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'genderPatient',
                                    attributes: ['valueVi', 'valueEn'],
                                }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getBookingPatient = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                });
            } else {
                let bookings = await db.Patient_Record.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: {
                        exclude: ['idAccount']
                    },
                    include: [
                        {
                            model: db.Booking,
                            attributes: ['id', 'statusId'],
                            include: [
                                {
                                    model: db.Schedule,
                                    attributes: ['date'],
                                    include: [
                                        {
                                            model: db.User,
                                            as: 'doctorData',
                                            attributes: ['id'],
                                            include: [
                                                {
                                                    model: db.Doctor_Infor,
                                                    attributes: ['id'],
                                                    include: [
                                                        {
                                                            model: db.Specialty,
                                                            attributes: ['nameVi', 'nameEn'],
                                                        },
                                                        {
                                                            model: db.Clinic,
                                                            attributes: ['name'],
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    model: db.Allcode,
                                    as: 'statusData',
                                    attributes: ['valueVi', 'valueEn'],
                                },
                                {
                                    model: db.History,
                                    attributes: ['id', 'status', 'imageResult']
                                }
                            ]
                        }
                    ],
                    order: [
                        [db.Booking, db.Schedule, 'date', 'DESC'] // Sắp xếp theo ngày giảm dần
                    ],
                    raw: false,
                    nest: true
                });

                if (!bookings) bookings = {};
                resolve({
                    errCode: 0,
                    data: bookings
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let putPatientFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.staffRating&&!data.waitingTimeRating&&!data.doctorRating&&!data.facilityRating&&!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let history = await db.History.findOne({
                    where: {
                        id: data.id
                    },
                    raw:false 
                })

                if (history) {
                    history.doctorRating=data.doctorRating,
                    history.waitingTimeRating= data.waitingTimeRating,
                    history.staffRating= data.staffRating,
                    history.facilityRating=data.facilityRating,
                    history.comments=data.detailFeedback,
                    history.status=2
                    await history.save()
                }else{
                    resolve({
                        errCode:2,
                    })
                }
                resolve({
                    errCode:0,
                    errMessage:'ok'
                }) 
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getFeedbackAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.History.findAll({
                where:{
                    status:2
                },
                attributes:{
                    exclude:['imageResult']
                }
            })
            if(!data) data =[];
            resolve({
                errCode:0,
                data:data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let putApproveFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log('ss',data)
        try {
            if(!data.id){
                resolve({
                    errCode:1,
                    errMessage:'Mising parameter'
                })
            }else{
                let htr = await db.History.findOne({
                    where:{
                        id:data.id,
                        status:2
                    },
                    raw:false
                })
                if(htr) {
                    htr.status=3
                    await htr.save()
                    resolve({
                        errCode:0,
                        errMessage:"ok"
                    })
                }
                resolve({
                    errCode:2,
                    errMessage:'No hisroty'
                })
            }
            
        } catch (e) {
            reject(e)
        }
    })
}

let getHistoryById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            else {
                let data = await db.History.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['id'],
                    include: [
                        {model: db.Booking,
                            attributes: ['reason'],
                            include:[
                                {
                                    model: db.Schedule,
                                    attributes: ['date'],
                                    include: [
                                        {
                                            model: db.User,
                                            as: 'doctorData',
                                            attributes: ['firstName', 'lastName'],
                                            include: [
                                                {
                                                    model: db.Doctor_Infor,
                                                    attributes: [],
                                                    include: [
                                                        {
                                                            model: db.Specialty,
                                                            attributes: ['nameVi', 'nameEn'],
                                                        },
                                                        {
                                                            model: db.Clinic,
                                                            attributes: ['name', 'address'],
                                                            include: [
                                                                {
                                                                    model: db.Allcode,
                                                                    as: 'provinceData',
                                                                    attributes: ['valueVi', 'valueEn'],
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            model: db.Allcode,
                                                            as: 'positionData',
                                                            attributes: ['valueVi', 'valueEn'],
                                                        }
        
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            model: db.Allcode,
                                            as: 'timeTypeData',
                                            attributes: ['valueVi', 'valueEn'],
                                        }
                                    ]
                                },
                                {
                                    model: db.Patient_Record,
                                    attributes: ['id', 'lastName', 'firstName', 'dateOfBirth', 'email', 'provinceId', 'districtId', 'wardId', 'address'],
                                    include: [
                                        {
                                            model: db.Allcode,
                                            as: 'genderPatient',
                                            attributes: ['valueVi', 'valueEn'],
                                        }
                                    ]
                                }
                            ]
                        }
                        
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    postBookAppointmentNoSignIn: postBookAppointmentNoSignIn,
    getAllPatientRecord: getAllPatientRecord,
    createNewPatientRecord: createNewPatientRecord,
    updatePatientRecord: updatePatientRecord,
    getAllBookingAdmin: getAllBookingAdmin,
    confirmAppointment: confirmAppointment,
    getBookingById: getBookingById,
    getBookingPatient: getBookingPatient,
    putPatientFeedback:putPatientFeedback,
    getFeedbackAdmin:getFeedbackAdmin,
    putApproveFeedback:putApproveFeedback,
    getHistoryById:getHistoryById
}