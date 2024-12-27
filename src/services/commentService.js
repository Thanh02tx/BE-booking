import db from '../models/index';
require('dotenv').config();
import { v4 as uuid4 } from 'uuid';
const { Op, Sequelize } = require('sequelize');
const moment = require('moment-timezone');


// let getCommentsByDoctorId = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.doctorId) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: "Missing parameter"
//                 })
//             }
//             else {
//                 let comments = await db.Comment.findAll({
//                     where: { doctorId: data.doctorId, parentId: null }, // Lấy bình luận chính (không phải trả lời)
//                     include: [
//                         {
//                             model: db.Comment,
//                             as: 'replies', // Định nghĩa quan hệ trả lời
//                             where: { doctorId: data.doctorId, parentId: Sequelize.col('Comment.id') }, // Kiểm tra bình luận trả lời có parentId trỏ tới bình luận chính
//                             required: false,  // Bình luận chính có thể không có trả lời
//                             include: [
//                                 {
//                                     model: db.Comment,  // Định nghĩa lại để lấy các bình luận trả lời ở cấp sâu hơn
//                                     as: 'replies',
//                                     where: { doctorId: data.doctorId, parentId: Sequelize.col('replies.id') }, // Trả lời các comment đã trả lời
//                                     required: false,
//                                     include: [
//                                         {
//                                             model: db.User,
//                                             attributes: ['firstName', 'lastName']
//                                         },
//                                     ],
//                                 },
//                                 {
//                                     model: db.User,
//                                     attributes: ['firstName', 'lastName']
//                                     // Thông tin người dùng cho comment trả lời cấp 1
//                                 },
//                             ],
//                         },
//                         {
//                             model: db.User,
//                             attributes: ['firstName', 'lastName']
//                             // Thông tin người dùng cho comment chính
//                         },
//                     ],
//                     raw: false,
//                     nest: true
//                 });
//                 if (!comments) comments = []
//                 resolve({
//                     errCode: 0,
//                     data: comments
//                 })
//             }


//         }
//         catch (e) {
//             reject(e);
//         }
//     })
// }
let getCommentsByDoctorId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                });
            } else {
                // Lấy tất cả các bình luận liên quan đến doctorId
                let comments = await db.Comment.findAll({
                    where: { doctorId: data.doctorId },
                    include: [
                        {
                            model: db.User,
                            attributes: ['firstName', 'lastName'] // Lấy thông tin người dùng
                        }
                    ],
                    nest:true,
                    raw: true, // Trả về dữ liệu thô
                });

                // Hàm đệ quy xây dựng cấu trúc cây
                const buildTree = (comments, parentId = null) => {
                    return comments
                        .filter(comment => comment.parentId === parentId)
                        .map(comment => ({
                            ...comment,
                            replies: buildTree(comments, comment.id) // Gọi đệ quy cho các cấp con
                        }));
                };

                // Tạo cây bình luận từ danh sách
                const commentTree = buildTree(comments);

                resolve({
                    errCode: 0,
                    data: commentTree
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let postCreateComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('sss',data)
            if (!data.doctorId||!data.userId||!data.content) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                await db.Comment.create({
                    userId:data.userId,
                    doctorId:data.doctorId,
                    content:data.content,
                    parentId:data.parentId
                })
                resolve({
                    errCode:0,
                    errMessage:'ok'
                })
            }


        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getCommentsByDoctorId: getCommentsByDoctorId,
    postCreateComment:postCreateComment
}