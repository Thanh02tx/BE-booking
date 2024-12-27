import { includes, reject } from "lodash";
import db from "../models";
import { where } from "sequelize";
let createNewHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameVi || !data.nameEn || !data.image
                || !data.listHeading
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let handbook = await db.Handbook.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    image: data.image
                })

                if (handbook) {
                    if (data.listHeading.length > 0) {
                        const headingPromises = data.listHeading.map(async (item, index) => {
                            return await db.Handbook_Content.create({
                                handbookId: handbook.id,
                                headingVi: item.headingVi,
                                headingEn: item.headingEn,
                                contentHTMLVi: item.contentHTMLVi,
                                contentHTMLEn: item.contentHTMLEn,
                                contentMarkdownVi: item.contentMarkdownVi,
                                contentMarkdownEn: item.contentMarkdownEn
                            });
                        });

                        // Wait for all heading creations to complete
                        await Promise.all(headingPromises);
                    }
                    return resolve({
                        errCode: 0,
                        errMessage: 'Create handbook successfully'
                    });
                }
            }
        }

        catch (e) {
            reject(e)
        }
    })
}
let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll({
                attributes:['id','image','nameVi','nameEn'],
                include: [
                    {
                        model: db.Handbook_Content,
                        attributes: {
                            exclude: ['handbookId','createdAt','updatedAt'] 
                        }
                    }
                ],
                raw: false, // Điều này sẽ trả về instance Sequelize thay vì dữ liệu thô
                nest: true  // Dùng để lồng các kết quả liên kết đúng cách
            });
            
            if (!data) data = [];
            resolve({
                data: data,
                errCode: 0
            })
        }

        catch (e) {
            reject(e)
        }
    })
}
let putEditHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id||!data.nameVi || !data.nameEn || !data.image
                || !data.listHeading
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let handbook = await db.Handbook.findOne({
                    where:{id:data.id},
                    raw:false
                })

                if (handbook) {
                    handbook.nameVi=data.nameVi
                    handbook.nameEn=data.nameEn
                    handbook.image=data.image
                    await handbook.save();
                    await db.Handbook_Content.destroy({
                        where:{handbookId:data.id}
                    })
                    if (data.listHeading.length > 0) {
                        const headingPromises = data.listHeading.map(async (item, index) => {
                            return await db.Handbook_Content.create({
                                handbookId: data.id,
                                headingVi: item.headingVi,
                                headingEn: item.headingEn,
                                contentHTMLVi: item.contentHTMLVi,
                                contentHTMLEn: item.contentHTMLEn,
                                contentMarkdownVi: item.contentMarkdownVi,
                                contentMarkdownEn: item.contentMarkdownEn
                            });
                        });

                        // Wait for all heading creations to complete
                        await Promise.all(headingPromises);
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Update handbook successfully'
                    });
                }
            }
        }

        catch (e) {
            reject(e)
        }
    })
}
let deleteHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                await db.Handbook.destroy({
                    where:{id:data.id},      
                })
                await db.Handbook_Content.destroy({
                    where:{handbookId:data.id}
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Delete handbook successfully'
                });
            }
        }

        catch (e) {
            reject(e)
        }
    })
}
let getDetailHandbookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let handbook = await db.Handbook.findOne({
                    where:{id:data.id},
                    attributes:['nameVi','nameEn','image'],
                    include: [
                        {
                            model: db.Handbook_Content,
                            attributes: {
                                exclude: ['handbookId','createdAt','updatedAt'] 
                            }
                        }
                    ],
                    raw: false, // Điều này sẽ trả về instance Sequelize thay vì dữ liệu thô
                    nest: true  // Dùng để lồng các kết quả liên kết đúng cách

                })
                if(handbook.image) handbook.image= new Buffer(handbook.image, 'base64').toString('binary');
                if(!handbook) handbook={}

                resolve({
                    errCode: 0,
                    data:handbook
                });
            }
        }

        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewHandbook: createNewHandbook,
    getAllHandbook: getAllHandbook,
    putEditHandbook:putEditHandbook,
    deleteHandbook:deleteHandbook,
    getDetailHandbookById:getDetailHandbookById
}