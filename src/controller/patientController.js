import patientService from '../services/patientService';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
let postBookingAppointment = async (req, res) => {
    try {

        let infor = await patientService.postBookingAppointment(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let postVerifyBookAppointment = async (req, res) => {
    try {

        let infor = await patientService.postVerifyBookAppointment(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }

}
let postBookAppointmentNoSignIn = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointmentNoSignIn(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let getAllPatientRecord = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token sau từ "Bearer token"
        if (!token) {
            return res.status(401).json({
                errCode: -2,
                message: 'Token is required'
            });
        }
        // Kiểm tra tính hợp lệ của token
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    errCode: -3,
                    message: 'Invalid or expired token'
                });
            }

            // Nếu token hợp lệ, lấy thông tin từ decoded token
            const userId = decoded.id;

            // Truyền thông tin vào service
            let infor = await patientService.getAllPatientRecord(userId);

            return res.status(200).json(infor);
        });
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
};

let createNewPatientRecord = async (req, res) => {
    try {
        // 1. Lấy token từ header Authorization
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }

        // 2. Giải mã token để lấy thông tin người dùng (ví dụ user id, role)
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }

            // Sau khi xác thực token, bạn có thể truy cập thông tin người dùng từ decoded
            const userId = decoded.id; // Giả sử thông tin người dùng lưu trong token

            // 3. Tiến hành xử lý yêu cầu, ví dụ tạo bệnh nhân mới
            const patientData = {
                ...req.body,
                idAccount: userId // Lưu thông tin người tạo bệnh nhân (có thể là id của người dùng)
            };

            let infor = await patientService.createNewPatientRecord(patientData);

            // 4. Trả về thông tin thành công
            return res.status(200).json(infor);
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
};

let updatePatientRecord = async (req, res) => {
    try {
        let infor = await patientService.updatePatientRecord(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

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
            if(role==='R1'){
                let infor = await patientService.getAllBookingAdmin();
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
};

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
            if(role==='R1'){
                let infor = await patientService.confirmAppointment(req.body);
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
            if(role==='R1'||role==='R2'){
                let infor = await patientService.getBookingById(req.query.id);
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
};
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    postBookAppointmentNoSignIn: postBookAppointmentNoSignIn,
    getAllPatientRecord: getAllPatientRecord,
    createNewPatientRecord: createNewPatientRecord,
    updatePatientRecord: updatePatientRecord,
    getAllBookingAdmin: getAllBookingAdmin,
    confirmAppointment:confirmAppointment,
    getBookingById:getBookingById
    
}