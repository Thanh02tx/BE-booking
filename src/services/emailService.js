require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail=async(dataSend)=>{
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_APP,
            pass:process.env.EMAIL_APP_PASSWORD
        }
    });
    let info  = await transporter.sendMail({
        from:`"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.reciverEmail,
        subject:"Thông tin đặt lịch khám bệnh",
        html:getBodyHTMLEmail(dataSend)
    });
}

let getBodyHTMLEmail=(dataSend)=>{
    let result='';
    if(dataSend.language ==='en'){
        result =`
            <h3>Dear ${dataSend.patientName}! </h3>
            <p>You received this email because you scheduled a medical appointment online on Booking."</p>
            <p>Appointment booking information:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to confirm and complete the appointment booking process</p>

            <div><a href = ${dataSend.redirectLink} target="_blank">Click here</a></div>
            <div>Thank you!</div>
        
        `
    }
    else  {
        result =`
        <h3>Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bẹnh online trên Booking </p>
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
let sendAttachment=async(dataSend)=>{
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_APP,
            pass:process.env.EMAIL_APP_PASSWORD
        }
    });
    let info  = await transporter.sendMail({
        from:`"Thanh Do" <dotienthanh28062002@gmail.com>`,
        to: dataSend.email,
        subject:"Kết quả khám bệnh",
        html:getBodyHTMLEmailRemedy(dataSend),
        attachments:[
            {
                filename:`remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content:dataSend.imgBase64.split('base64')[1],
                encoding:'base64'
            }
        ],
    });
}
let getBodyHTMLEmailRemedy=(dataSend)=>{
    let result='';
    if(dataSend.language ==='en'){
        result =`
            <h3>Dear ${dataSend.firstName} ${dataSend.lastName}! </h3>
            <p>You received this email because you scheduled a medical appointment online on Booking."</p>
            <p>Appointment booking information:</p>
            
            <div>Thank you!</div>
        
        `
    }
    else  {
        result =`
        <h3>Xin chào ${dataSend.lastName} ${dataSend.firstName}! </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bẹnh online trên Booking </p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm</p>
        <div>Xin cảm ơn!</div>
    
    `
    }
    return result;
}
module.exports={
    sendSimpleEmail:sendSimpleEmail,
    sendAttachment:sendAttachment
}