import scheduleService from '../services/scheduleService';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
let allScheduleDoctorByDate= async (req, res) => {
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
            if (role === 'R1' || role === 'R2') {
                let data={
                    id:id,
                    date:req.query.date
                }
                let infor = await scheduleService.allScheduleDoctorByDate(data);
                return res.status(200).json(infor);
            }
            else {
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
};
let saveDoctorScheduleByDate= async (req, res) => {
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
            if (role === 'R1' || role === 'R2') {
                let data={
                    doctorId:id,
                    ...req.body
                }
                let infor = await scheduleService.saveDoctorScheduleByDate(data);
                return res.status(200).json(infor);
            }
            else {
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
};
let allScheduleByDateAndDoctorId= async (req, res) => {
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
            if (role === 'R1') {
                let infor = await scheduleService.allScheduleByDateAndDoctorId(req.query);
                return res.status(200).json(infor);
            }
            else {
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
};
let saveScheduleByDateAndDoctorId= async (req, res) => {
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
            if (role === 'R1' || role === 'R2') {
                let infor = await scheduleService.saveDoctorScheduleByDate(req.body);
                return res.status(200).json(infor);
            }
            else {
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
};
let getScheduleByToken=async(req,res)=>{
    try{
        let infor = await scheduleService.getScheduleByToken(req.query.token);
   
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

        let infor = await scheduleService.getScheduleByDate(req.query.doctorId,req.query.date);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
module.exports ={
    allScheduleDoctorByDate:allScheduleDoctorByDate,
    saveDoctorScheduleByDate:saveDoctorScheduleByDate,
    allScheduleByDateAndDoctorId:allScheduleByDateAndDoctorId,
    saveScheduleByDateAndDoctorId:saveScheduleByDateAndDoctorId,
    getScheduleByToken:getScheduleByToken,
    getScheduleByDate:getScheduleByDate
}