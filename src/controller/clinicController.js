import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic();

        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getDetailClinicById=async(req,res)=>{
    try{
        let infor = await clinicService.getDetailClinicById(req.query.id,req.query.specialtyId);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let putEditClinic=async(req,res)=>{
    try{
        let infor = await clinicService.putEditClinic(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let deleteClinic=async(req,res)=>{
    try{
        let infor = await clinicService.deleteClinic(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById:getDetailClinicById,
    putEditClinic:putEditClinic,
    deleteClinic:deleteClinic
}