import { first, includes, reject } from 'lodash';
import db from '../models/index';
import emailService from '../services/emailService';
require('dotenv').config();
import { v4 as uuid4 } from 'uuid';
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('asf',data)
        try {
            if (!data.schedule||!data.patientId||!data.reason)
            {
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
                console.log('sưs',patient)
                if(!patient){
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
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Missing'
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
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false // update cần raw:false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
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
                || !data.schedule || !data.language||!data.dateOfBirth
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let patient = await db.Patient_Record.findOne({
                    where: {
                        email: data.email
                    },
                    include: [
                        {
                            model: db.Booking,
                            attributes: [],
                            include: [
                                {
                                    model: db.Schedule,
                                    where: {
                                        doctorId: data.schedule.doctorId,
                                        date: data.schedule.date
                                    }
                                }
                            ]
                        },
                    ],
                    raw: true,
                    nest: true

                })
                if (!patient) {
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
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'trung lich'
                    })
                }


            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllPatientRecord = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!dataInput.id){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter"
                })
            }else{
                let data = await db.Patient_Record.findAll({
                    where:{
                        idAccount:dataInput.id
                    },
                    include: [
                        { model: db.Allcode, as: 'relationshipTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw:true,
                    nest:true
                }) 
                if(!data) data=[]
                resolve({
                    errCode:0,
                    data:data
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
            if(!data.idAccount||!data.firstName||!data.lastName||!data.email||!data.provinceId||
                !data.districtId||!data.gender||!data.relationship||!data.dateOfBirth
            ){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter"
                })
            }else{
                await db.Patient_Record.create({
                    idAccount:data.idAccount,
                    firstName:data.firstName,
                    lastName:data.lastName,
                    email:data.email,
                    phoneNumber:data.phoneNumber,
                    dateOfBirth:data.dateOfBirth,
                    bhyt:data.bhyt,
                    provinceId:data.provinceId,
                    districtId:data.districtId,
                    wardId:data.wardId,
                    address:data.address,
                    gender:data.gender,
                    relationship:data.relationship
                }) 
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
let updatePatientRecord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id||!data.firstName||!data.lastName||!data.email||!data.provinceId||
                !data.districtId||!data.gender||!data.relationship||!data.dateOfBirth
            ){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter"
                })
            }else{
                let patient =await db.Patient_Record.findOne({
                    where:{
                        id:data.id
                    },
                    raw:false
                })
                if(patient){
                    patient.firstName=data.firstName,
                    patient.lastName=data.lastName,
                    patient.email=patient.email,
                    patient.phoneNumber=data.phoneNumber,
                    patient.dateOfBirth=data.dateOfBirth,
                    patient.bhyt=data.bhyt,
                    patient.provinceId=data.provinceId,
                    patient.districtId=data.districtId,
                    patient.wardId=data.wardId,
                    patient.address=data.address,
                    patient.gender=data.gender,
                    patient.relationship=data.relationship
                    await patient.save()
                    resolve({
                        errCode:0,
                        errMessage:'update succed'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'no patient'
                    })
                }
                
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
    getAllPatientRecord:getAllPatientRecord,
    createNewPatientRecord:createNewPatientRecord,
    updatePatientRecord:updatePatientRecord,
}