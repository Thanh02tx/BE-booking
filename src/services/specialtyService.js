const { includes } = require("lodash")
const db = require("../models")
const { where } = require("sequelize")


let createSpecialty = (data) => {
    console.log('sfa',data)

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameVi || !data.nameEn || !data.image || !data.descriptionHTMLVi || !data.descriptionMarkdownVi || !data.descriptionHTMLEn || !data.descriptionMarkdownEn) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Specialty.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    image: data.image,
                    descriptionHTMLVi: data.descriptionHTMLVi,
                    descriptionMarkdownVi: data.descriptionMarkdownVi,
                    descriptionHTMLEn: data.descriptionHTMLEn,
                    descriptionMarkdownEn: data.descriptionMarkdownEn,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'create succeed!'
                })


            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'nameVi', 'nameEn']
            });

            resolve({
                errCode: 0,
                errMessage: 'succeed!',
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'succeed!',
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (inputId, province) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !province) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = {};

                data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTMLVi', 'descriptionHTMLEn']
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (province === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId'],

                        })

                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId'],
                            include: [
                                {
                                    model: db.Clinic, 
                                        where:{provinceId:province},
                                        attributes: []

                                },

                            ],
                            raw: false,
                            nest: true
                        })

                    }
                    data.doctorSpecialty = doctorSpecialty;
                }
                resolve({
                    errCode: 0,
                    data: data,
                    errMessage: 'ok!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let editSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.nameVi||!data.nameEn|| !data.image
                || !data.descriptionHTMLVi || !data.descriptionMarkdownVi 
                || !data.descriptionHTMLEn || !data.descriptionMarkdownEn) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let spec = await db.Specialty.findOne({
                    where: { id: data.id },
                    raw:false
                })
                if (spec) {
                    spec.nameVi=data.nameVi,
                    spec.nameEn=data.nameEn,
                    spec.descriptionHTMLVi=data.descriptionHTMLVi,
                    spec.descriptionHTMLEn=data.descriptionHTMLEn,
                    spec.descriptionMarkdownVi=data.descriptionMarkdownVi,
                    spec.descriptionMarkdownEn=data.descriptionMarkdownEn,
                    spec.image=data.image
                }
                await spec.save()
                resolve({
                    errCode: 0,
                    errMessage: 'ok!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let deleteSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Specialty.destroy({
                    where:{id:data.id}
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    getAllCodeSpecialty: getAllCodeSpecialty,
    editSpecialty:editSpecialty,
    deleteSpecialty:deleteSpecialty
}