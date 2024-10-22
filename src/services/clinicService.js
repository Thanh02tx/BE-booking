import db from '../models/index';


let createClinic = (data) => {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name||!data.provinceId || !data.address|| !data.addressMap || !data.imageBase64 || !data.descriptionHTMLVi || !data.descriptionHTMLEn || !data.descriptionMarkdownVi || !data.descriptionMarkdownEn) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    addressMap:data.addressMap,
                    image: data.imageBase64,
                    descriptionHTMLVi: data.descriptionHTMLVi,
                    descriptionMarkdownVi: data.descriptionMarkdownVi,
                    descriptionHTMLEn: data.descriptionHTMLEn,
                    descriptionMarkdownEn: data.descriptionMarkdownEn,
                    provinceId:data.provinceId
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
let getAllClinic = () => {

    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
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
let getDetailClinicById =(inputId, specialty) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId ||!specialty) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = {};

                data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTMLVi','descriptionHTMLEn', 'descriptionMarkdownVi', 'descriptionMarkdownEn','image','addressMap','address']
                })
                if (data) {
                    let doctorClinic = [];
                    if (specialty === 'ALL') {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: { clinicId: inputId },
                            attributes: ['doctorId', 'specialtyId'],
                        })

                    } else {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: { clinicId: inputId, specialtyId:specialty},
                            attributes: ['doctorId', 'specialtyId'],
                        })

                    }
                    data.doctorClinic = doctorClinic;
                }
                if(data.image) data.image= new Buffer(data.image, 'base64').toString('binary');
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
let putEditClinic = (data) => {
    console.log("fssf",data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id||!data.name||!data.provinceId || !data.address
                || !data.addressMap || !data.imageBase64 || !data.descriptionHTMLVi 
                || !data.descriptionHTMLEn || !data.descriptionMarkdownVi || !data.descriptionMarkdownEn) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where:{id:data.id},
                    raw:false
                })
                if(clinic){
                    clinic.name= data.name,
                    clinic.address= data.address,
                    clinic.addressMap=data.addressMap,
                    clinic.image= data.imageBase64,
                    clinic.descriptionHTMLVi= data.descriptionHTMLVi,
                    clinic.descriptionMarkdownVi= data.descriptionMarkdownVi,
                    clinic.descriptionHTMLEn= data.descriptionHTMLEn,
                    clinic.descriptionMarkdownEn= data.descriptionMarkdownEn,
                    clinic.provinceId=data.provinceId
                    await clinic.save()
                }
                
                resolve({
                    errCode: 0,
                    errMessage: 'update succeed!'
                })


            }
        } catch (e) {
            reject(e)
        }
    })
}
let deleteClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                
                await db.Clinic.destroy({
                    where:{id:data.id}
                })
                resolve({
                    errCode: 0,
                    errMessage: 'update succeed!'
                })


            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports={
    createClinic:createClinic,
    getAllClinic:getAllClinic,
    getDetailClinicById:getDetailClinicById,
    putEditClinic:putEditClinic,
    deleteClinic:deleteClinic
}