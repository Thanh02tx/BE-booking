import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';
import emailService from '../services/emailService';
import provinces from '../json/provinces.json'
import districts from '../json/districts.json'
import wards from '../json/wards.json'
import { fill } from "lodash";
import { response } from "express";
// const pro = require('../json/provinces.json');
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
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
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
            if (!data.email || !data.firstName || !data.lastName || !data.roleId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter'
                })
            } else {
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 2,
                        errMessage: "Your's email is already been userd,Plz try another email!",
                    })
                }else {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        roleId: data.roleId,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok',
                    });
                }

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
            if (!data.id || !data.roleId || !data.firstName || !data.lastName) {
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
                user.roleId = data.roleId;
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

let putEditUserHome = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.firstName || !data.lastName || !data.phoneNumber) {
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
                user.gender = data.gender;
                user.phonenumber = data.phoneNumber;
                await user.save();
                resolve({
                    errCode: 0,
                    data: user
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
                if (user) check = false
                resolve({
                    errCode: 0,
                    check: check

                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let generateOTP = () => {
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
let sendMailOtp = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('sdf0', data)
        try {
            if (!data.email || !data.language) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let otp = generateOTP();
                await emailService.sendOtpToEmail({
                    email: data.email,
                    language: data.language,
                    otp: otp
                })
                resolve({
                    errCode: 0,
                    data: otp
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
            if (!data.email || !data.password) {
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
                user.password = hashPasswordFromBcrypt;

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

let changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.password || !data.newPassword) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required"
                })
            } else {


                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    let check = await bcrypt.compareSync(data.password, user.password);
                    if (check) {
                        user.password = await hashUserPassword(data.newPassword);
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'change password success!'
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Wrong password '
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: "User's not found!"
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllProvinceJson = () => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve({
                errCode: 0,
                data: provinces
            });
        } catch (e) {
            reject(e);
        }
    })
}
let getAllDistrictJson = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let dis = districts.find(item => item.id === id);
                resolve({
                    errCode: 0,
                    data: dis.data
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllWardJson = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let war = wards.find(item => item.id === id);

                resolve({
                    errCode: 0,
                    data: war.data ? war.data : []
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getAllProvinceJson: getAllProvinceJson,
    getAllDistrictJson: getAllDistrictJson,
    getAllWardJson: getAllWardJson,
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    checkUserByEmail: checkUserByEmail,
    sendMailOtp: sendMailOtp,
    resetPassword: resetPassword,
    changePassword: changePassword,
    putEditUserHome: putEditUserHome
}