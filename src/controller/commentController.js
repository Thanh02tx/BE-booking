import commentService from '../services/commentService';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY

let getCommentsByDoctorId = async (req, res) => {
    try {
        let infor = await commentService.getCommentsByDoctorId(req.query);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
};
let postCreateComment = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ errCode: -2, message: 'Token is required' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ errCode: -3, message: 'Invalid or expired token' });
            }
            const id = decoded.id;
            let data ={
                ...req.body,
                userId:id
            }
            let infor = await commentService.postCreateComment(data);
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
module.exports = {
    getCommentsByDoctorId: getCommentsByDoctorId,
    postCreateComment: postCreateComment
}