require('dotenv').config();
import { dasherize } from 'i/lib/methods';
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    let subj = dataSend.language === 'vi' ? 'Thông tin đặt lịch khám bệnh' : 'Appointment Information for Medical Check-up'
    let info = await transporter.sendMail({
        from: `"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.reciverEmail,
        subject: subj,
        html: getBodyHTMLEmail(dataSend)
    });
}
let sendAppointmentConfirmation = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    let subj = dataSend.language === 'vi' ? 'Xác nhận lịch hẹn khám bênh' : 'Confirm the medical appointment'
    let info = await transporter.sendMail({
        from: `"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.email,
        subject: subj,
        html: getBodyHTMLEmailConfirm(dataSend)
    });
}
let getBodyHTMLEmailConfirm = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result = `
            <h2>Hello ${dataSend.fullName}!</h2>
            <p>The system has confirmed your medical appointment.</p>
            <p>Appointment details:</p>
            <h3><b>Time: ${dataSend.time}</b></h3>
            <div><b>Doctor: ${dataSend.doctor}</b></div>
            <div><b>Clinic: ${dataSend.clinic}</b></div>
            <p>Please arrive on time for your appointment!</p>
            <div>Thank you!</div>
        `
    }
    else {
        result = `
        <h2>Xin chào ${dataSend.fullName} </h2>
        <p>Hệ thống đã xác nhận lịch hẹn khám bệnh của bạn </p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <h3><b>Thời gian: ${dataSend.time}</b></h3>
        <div><b>Bác sĩ: ${dataSend.doctor}</b></div>
        <div><b>Phòng khám: ${dataSend.clinic}</b></div>
        <p>Bạn vui lòng đến đúng lịch hẹn!</p>
        <div>Xin cảm ơn!</div>
    
    `
    }
    return result;
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result = `
            <h3>Dear ${dataSend.patientName}! </h3>
            <p>You received this email because you scheduled a medical appointment online "</p>
            <p>Appointment booking information:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to confirm and complete the appointment booking process</p>

            <div><a href = ${dataSend.redirectLink} target="_blank">Click here</a></div>
            <div>Thank you!</div>
        
        `
    }
    else {
        result = `
        <h3>Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online  </p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu thông tin trên đúng vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>

        <div><a href = ${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Xin cảm ơn!</div>
    
    `
    }
    return result;
}
let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    let info = await transporter.sendMail({
        from: `"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.email,
        subject: "Kết quả khám bệnh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split('base64')[1],
                encoding: 'base64'
            }
        ],
    });
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result = `
            <h2>${dataSend.nameClinic}</h2>
            <h3>Dear ${dataSend.firstName} ${dataSend.lastName}! </h3>
            <p>You received this email because you scheduled a medical appointment online on Booking."</p>
            <p>Appointment booking information:</p>
            
            <div>Thank you!</div>
        
        `
    }
    else {
        result = `
        <h2>${dataSend.nameClinic}</h2>
        <h3>Xin chào ${dataSend.lastName} ${dataSend.firstName}! </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bẹnh online trên Booking </p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm</p>
        <div>Xin cảm ơn!</div>
    
    `
    }
    return result;
}
let sendOtpToEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let sub = dataSend.language === 'vi' ? 'Xác thực thông tin tài khoản' : 'Verify account information'
    let info = await transporter.sendMail({
        from: `"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.email,
        subject: sub,
        html: getBodyHTMLSendOtpToEmail(dataSend)
    });
}
let getBodyHTMLSendOtpToEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result = `
            <h4>Verify account information  </h4>
            <h1>OTP - ${dataSend.otp} </h1>
            <div>Thank you!</div>
        
        `
    }
    else {
        result = `
        <h4>Xác thực thông tin tài khoản </h4>
        <h1>OTP - ${dataSend.otp} </h1>
        <div>Xin cảm ơn!</div>
    `
    }
    return result;
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendOtpToEmail: sendOtpToEmail,
    sendAppointmentConfirmation: sendAppointmentConfirmation
}