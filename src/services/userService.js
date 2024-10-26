import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';
import emailService from '../services/emailService';
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id','email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true

                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's note found!";
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = "Your's email isn't exist in your system. Plz try other email!";
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            if (user) {
                resolve(true);
            } else resolve(false);
        } catch (e) {
            reject(e);
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);

        } catch (e) {
            reject(e);
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your's email is already been userd,Plz try another email!",
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: "The user isn't exist"
            })
        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: 'The user deleted!'
        })
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId ||!data.positionId ||!data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId=data.roleId;
                user.positionId=data.positionId;
                user.gender= data.gender;
                user.phonenumber=data.phonenumber;
                if(data.avatar){
                    user.image=data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User's not found!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }

        } catch (e) {
            reject(e);
        }
    })
}
let checkUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let check = true;
                let user = await db.User.findOne({
                    where: { email: email }
                });
                if(user) check = false
                resolve({
                    errCode:0,
                    check:check
                    
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let generateOTP=()=>{
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10); 
    }
    return otp;
}
let sendMailOtp = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('sdf0',data)
        try {
            if (!data.email||!data.language) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let otp = generateOTP();
                await emailService.sendOtpToEmail({
                    email:data.email,
                    language:data.language,
                    otp:otp
                })
                resolve({
                    errCode:0,
                    data:otp
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}
let resetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required"
                })
            }
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false
            })
            if (user) {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                user.password= hashPasswordFromBcrypt;
               
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'reset password success!'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User's not found!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    checkUserByEmail:checkUserByEmail,
    sendMailOtp:sendMailOtp,
    resetPassword:resetPassword
}