
import doctorService from '../services/doctorService';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
let getTopDoctorHome = async(req,res) =>{
    let limit = req.query.limit;
    if(!limit) limit = 6;

    try{
        let response = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(response);
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let getAllDoctors = async (req,res) =>{
    try{
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
             errCode: -1,
            message: 'Error from server...'
        })
    }
}

let postInforDoctor = async(req,res) =>{
    try{
        let response = await doctorService.saveDatailInforDoctor(req.body);
        return res.status(200).json(response)
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
             errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getInforDoctorById = async(req,res) =>{
    try{
        let infor = await doctorService.getInforDoctorById(req.query.id);
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getDetailDoctorById = async(req,res) =>{
    try{
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let bulkCreateSchedule=async(req,res)=>{
    try{

        let infor = await doctorService.bulkCreateSchedule(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getScheduleByDate=async(req,res) =>{
    try{

        let infor = await doctorService.getScheduleByDate(req.query.doctorId,req.query.date);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getExtraInforDoctorById = async(req,res)=>{
    try{

        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getProfileDoctorById=async(req,res)=>{
    try{

        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getListPatientForDoctor=async(req,res)=>{
    // try{
    //     let infor = await doctorService.getListPatientForDoctor(req.query.doctorId,req.query.date);
   
    //     return res.status(200).json(infor)
    // }catch(e){
    //     console.log(e);
    //     return res.status(200).json({
    //         errCode: -1,
    //        message: 'Error from server...'
    //    })
    // }
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
       
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            const role = decoded.roleId;
            let id = decoded.id;
             // Giả sử thông tin người dùng lưu trong token
            if(role==='R2'){
                let infor = await doctorService.getListPatientForDoctor(id,req.query.date);
                return res.status(200).json(infor);
            }
            else{
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }
        });
       

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let sendRemedy=async(req,res)=>{
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token.' });
            }
            const role = decoded.roleId;
            const doctorId=decoded.id;
            let data= {
                ...req.body,
                doctorId:doctorId
            }
            if(role==='R1'||role==='R2'){
                let infor = await doctorService.sendRemedy(data);
                return res.status(200).json(infor);
            }
            else{
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }
        });
       

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}
// let getScheduleByToken=async(req,res)=>{
//     try{
//         let infor = await doctorService.getScheduleByToken(req.query.token);
   
//         return res.status(200).json(infor)
//     }catch(e){
//         console.log(e);
//         return res.status(200).json({
//             errCode: -1,
//            message: 'Error from server...'
//        })
//     }
// }

module.exports ={
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    postInforDoctor:postInforDoctor,
    getInforDoctorById:getInforDoctorById,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleByDate:getScheduleByDate,
    // getScheduleByToken:getScheduleByToken,
    getExtraInforDoctorById:getExtraInforDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    getListPatientForDoctor:getListPatientForDoctor,
    sendRemedy:sendRemedy,
}