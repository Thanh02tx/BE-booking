import { where } from 'sequelize';
import db from '../models/index';
require('dotenv').config();
import _, { includes } from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }

            });
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let checkRequiredField = (data) => {
    let arrFields = ['doctorId', 'contentHTMLVi', 'contentMarkdownVi', 'contentHTMLEn', 'contentMarkdownEn', 'action',
        'selectedPrice', 'selectedPayment', 'selectedSpecialty', 'selectedClinic', 'descriptionVi', 'descriptionEn'
    ]
    let isValid = true;
    let element = '';

    for (let i = 0; i < arrFields.length; i++) {
        if (!data[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}
let saveDatailInforDoctor = (inputData) => {

    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredField(inputData);

            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            }
            else {
                if (inputData.action === 'CREATE') {
                    await db.Doctor_Infor.create({
                        contentHTMLVi: inputData.contentHTMLVi,
                        contentMarkdownVi: inputData.contentMarkdownVi,
                        descriptionVi: inputData.descriptionVi,
                        contentHTMLEn: inputData.contentHTMLEn,
                        contentMarkdownEn: inputData.contentMarkdownEn,
                        descriptionEn: inputData.descriptionEn,
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic,
                        noteVi: inputData.noteVi,
                        noteEn: inputData.noteEn,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorInfor = await db.Doctor_Infor.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false  // sửa raw:true
                    })
                    if (doctorInfor) {

                        doctorInfor.contentHTMLVi = inputData.contentHTMLVi;
                        doctorInfor.contentMarkdownVi = inputData.contentMarkdownVi;
                        doctorInfor.descriptionVi = inputData.descriptionVi;
                        doctorInfor.contentHTMLEn = inputData.contentHTMLEn;
                        doctorInfor.contentMarkdownEn = inputData.contentMarkdownEn;
                        doctorInfor.descriptionEn = inputData.descriptionEn;
                        doctorInfor.priceId = inputData.selectedPrice,
                        doctorInfor.paymentId = inputData.selectedPayment,
                        doctorInfor.specialtyId = inputData.selectedSpecialty,
                        doctorInfor.clinicId = inputData.selectedClinic,
                        doctorInfor.noteVi = inputData.noteVi,
                        doctorInfor.noteEn = inputData.noteEn,
                        await doctorInfor.save();
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getInforDoctorById = (inputId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
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
let getDetailDoctorById = (inputId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true

                })
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
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
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                console.log("max", MAX_NUMBER_SCHEDULE);
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                )

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Clinic, attributes: ['name', 'address'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Doctor_Infor, 
                            attributes: ['descriptionVi', 'contentHTMLVi','descriptionEn', 'contentHTMLEn' ] ,
                            include:[
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Clinic, attributes: ['provinceId'] ,
                                    include:[
                                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                    ]
                                },
                            // ] include: [
                            //     { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            //     { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                           
                        },
                        

                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'firstName', 'lastName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                        , {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi', 'valueEn'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let sendRemedy = (data) => {
  
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        id: data.id,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }
                await emailService.sendAttachment(data)

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
module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctors: getAllDoctors,
    saveDatailInforDoctor: saveDatailInforDoctor,
    getInforDoctorById: getInforDoctorById,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}