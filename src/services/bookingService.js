import db from '../models/index';
require('dotenv').config();
import { v4 as uuid4 } from 'uuid';
const { Op } = require('sequelize');
const moment = require('moment-timezone');
let cancelAppointment =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!data.reason||!data.id){
                resolve({
                    errCode:1,
                    errMesssage:'Missing parameter'
                })
            }else{
                let booking = await db.Booking.findOne({
                    where:{
                        id:data.id
                    },
                    raw:false
                })
                if(booking){
                    booking.note = data.reason,
                    booking.statusId='S5'
                    await booking.save()
                    resolve({
                        errCode:0,
                        errMesssage:'Delete Booking succed'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMesssage:'Booking not found'
                    })
                }
                
            }
        }catch(e){
            reject(e);
        }
    })
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
let getAllBookingAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.clinic || !data.status || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let bookings = await db.Booking.findAll({
                    where: data.status !=='ALL' ? {statusId:data.status} :undefined,
                    attributes: ['id', 'reason', 'statusId'],
                    include: [
                        {
                            model: db.Schedule,
                            attributes: ['date'],
                            where: {
                                date: data.date
                            },
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
                                                    where: data.clinic !== 'ALL' ? { id: data.clinic } : undefined,
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
                        },
                        {
                            model: db.Allcode,
                            as: 'statusData',
                            attributes: ['valueVi', 'valueEn'],
                        }
                    ],
                    raw: true,
                    nest: true
                })
                if (!bookings) bookings = []
                resolve({
                    errCode: 0,
                    data: bookings
                })
            }
        } catch (e) {
            reject(e)
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
module.exports={
    cancelAppointment:cancelAppointment,
    postBookingAppointment:postBookingAppointment,
    confirmAppointment:confirmAppointment,
    getBookingById:getBookingById,
    getAllBookingAdmin:getAllBookingAdmin,
    postVerifyBookAppointment:postVerifyBookAppointment
    
}