import bookingService from '../services/bookingService';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
let cancelAppointment= async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            const role = decoded.roleId; // Giả sử thông tin người dùng lưu trong token
            if (role === 'R1' || role === 'R2') {
                let infor = await bookingService.cancelAppointment(req.body);
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
let postBookingAppointment = async (req, res) => {
    try {

        let infor = await bookingService.postBookingAppointment(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let confirmAppointment = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            const role = decoded.roleId; // Giả sử thông tin người dùng lưu trong token
            if (role === 'R1') {
                let infor = await bookingService.confirmAppointment(req.body);
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
let getBookingById = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            const role = decoded.roleId; // Giả sử thông tin người dùng lưu trong token
            if (role === 'R1' || role === 'R2') {
                let infor = await bookingService.getBookingById(req.query.id);
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
let getAllBookingAdmin = async (req, res) => {
    try {

        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            const role = decoded.roleId; // Giả sử thông tin người dùng lưu trong token
            if (role === 'R1') {
                let infor = await bookingService.getAllBookingAdmin(req.body);
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
let postVerifyBookAppointment = async (req, res) => {
    try {

        let infor = await bookingService.postVerifyBookAppointment(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }

}
module.exports ={
    cancelAppointment:cancelAppointment,
    postBookingAppointment:postBookingAppointment,
    confirmAppointment:confirmAppointment,
    getBookingById:getBookingById,
    getAllBookingAdmin:getAllBookingAdmin,
    postVerifyBookAppointment:postVerifyBookAppointment
}