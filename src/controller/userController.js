import userService from "../services/userService";
import jwt from 'jsonwebtoken'
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
let handleLogin = async (req, res) => {
    try {
        let infor = await userService.handleUserLogin(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let checkRole = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return res.status(401).json({
                errCode: -2,
                message: 'Token is required'
            });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    errCode: -3,
                    message: 'Invalid or expired token'
                });
            } else {
                const userRoleId = decoded.roleId;
                let role = 'patient';
                if (userRoleId == 'R1') role = 'admin';
                if (userRoleId == 'R2') role = 'doctor';
                return res.status(200).json({
                    errCode: 0,
                    role: role
                });
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
let checkRoleAdmin = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return res.status(401).json({
                errCode: -2,
                message: 'Token is required'
            });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    errCode: -3,
                    message: 'Invalid or expired token'
                });
            }
            const userRoleId = decoded.roleId;
            let check = false;
            if (userRoleId == 'R2' || userRoleId == 'R3') check = true
            return res.status(200).json({
                errCode: 0,
                check: check
            });
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing required parameter',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}
let handleEditUser = async (req, res) => {
    let message = await userService.updateUserData(req.body);
    return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requires parameters!',
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let checkUserByEmail = async (req, res) => {
    try {
        let data = await userService.checkUserByEmail(req.query.email);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let sendMailOtp = async (req, res) => {

    try {
        let data = await userService.sendMailOtp(req.body);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let resetPassword = async (req, res) => {

    try {
        let data = await userService.resetPassword(req.body);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let changePassword = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }
            let id = decoded.id;
            let data ={
                ...req.body,
                id:id
            }
            let infor = await userService.changePassword(data);
            return res.status(200).json(infor);
        });


    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}
let putEditUserHome = async (req, res) => {
    try {
        let data = await userService.putEditUserHome(req.body);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllProvinceJson = async (req, res) => {
    try {
        let data = await userService.getAllProvinceJson();
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllDistrictJson = async (req, res) => {
    try {
        let data = await userService.getAllDistrictJson(req.query.id);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllWardJson = async (req, res) => {
    try {
        let data = await userService.getAllWardJson(req.query.id);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    getAllProvinceJson: getAllProvinceJson,
    getAllDistrictJson: getAllDistrictJson,
    getAllWardJson: getAllWardJson,
    handleLogin: handleLogin,
    checkRole: checkRole,
    checkRoleAdmin, checkRoleAdmin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    putEditUserHome: putEditUserHome,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    checkUserByEmail: checkUserByEmail,
    resetPassword: resetPassword,
    changePassword: changePassword,
    sendMailOtp: sendMailOtp
}