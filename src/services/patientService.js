import { reject } from 'lodash';
import db from '../models/index';
import emailService from '../services/emailService';
require('dotenv').config();
import {v4 as uuid4} from 'uuid';
let buildUrlEmail=(doctorId,token)=>{
    let result=`${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('đfa',data)
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.firstName ||!data.lastName|| !data.phoneNumber || !data.address
                || !data.selectedGender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })

            }
            else {
                let token=uuid4();
                await emailService.sendSimpleEmail({
                    reciverEmail:data.email,
                    patientName:`${data.firstName} ${data.lastName}`,
                    time: data.timeString,
                    doctorName:data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId,token),
                })


                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        firstName:data.firstName,
                        lastname:data.lastName,
                        address:data.address,
                        phonenumber:data.phoneNumber,
                        gender:data.selectedGender,
                        roleId: 'R3',

                    }
                })
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: data.date, 
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            reason:data.reason,
                            token:token
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Succeed"
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}
let postVerifyBookAppointment=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!data.doctorId|| !data.token){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId:data.doctorId,
                        token:data.token,
                        statusId:'S1'
                    },
                    raw:false // update cần raw:false
                })

                if(appointment){
                    appointment.statusId='S2';
                    await appointment.save();
                    resolve({
                        errCode:0,
                        errMessage:'Update the appointment succeed!'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Appointment has been activated or does not exist!'
                    })
                }

            }
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment,
}