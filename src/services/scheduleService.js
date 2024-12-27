import db from '../models/index';
import { v4 as uuid4 } from 'uuid';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getScheduleByToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Schedule.findOne({
                    where: {
                        token: token,
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let allScheduleDoctorByDate= (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id&&!data.date){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else{
                let listSchedule = await db.Schedule.findAll({
                    where:{
                        doctorId:data.id,
                        date:data.date
                    },
                    attributes:['timeType']
                })
                if(!listSchedule) listSchedule=[]
                resolve({
                    errCode:0,
                    data:listSchedule
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let saveDoctorScheduleByDate= (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            await db.Schedule.destroy({
                where:{
                    doctorId:data.doctorId,
                    date:data.date
                },
                raw:false
            })
            data.arrSchedule = data.arrSchedule.map(item => ({
                ...item, 
                doctorId: data.doctorId, 
                token: uuid4(),
                maxNumber: MAX_NUMBER_SCHEDULE, 
            }));
            await db.Schedule.bulkCreate(data.arrSchedule);
            resolve({
                errCode:0,
                errMessage:'ok'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let allScheduleByDateAndDoctorId= (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId&&!data.date){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else{
                let listSchedule = await db.Schedule.findAll({
                    where:{
                        doctorId:data.doctorId,
                        date:data.date
                    },
                    attributes:['timeType']
                })
                if(!listSchedule) listSchedule=[]
                resolve({
                    errCode:0,
                    data:listSchedule
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports={
    allScheduleDoctorByDate:allScheduleDoctorByDate,
    saveDoctorScheduleByDate:saveDoctorScheduleByDate,
    allScheduleByDateAndDoctorId:allScheduleByDateAndDoctorId,
    getScheduleByToken:getScheduleByToken,
    getScheduleByDate:getScheduleByDate
}