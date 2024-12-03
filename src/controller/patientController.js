import patientService from '../services/patientService';
let postBookingAppointment=async(req,res)=>{
    try{

        let infor = await patientService.postBookingAppointment(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let postVerifyBookAppointment=async(req,res)=>{
    try{

        let infor = await patientService.postVerifyBookAppointment(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }

}
let postBookAppointmentNoSignIn=async(req,res)=>{
    try{
        let infor = await patientService.postBookAppointmentNoSignIn(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getAllPatientRecord=async(req,res)=>{
    try{
        let infor = await patientService.getAllPatientRecord(req.query);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let createNewPatientRecord=async(req,res)=>{
    try{
        let infor = await patientService.createNewPatientRecord(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let updatePatientRecord=async(req,res)=>{
    try{
        let infor = await patientService.updatePatientRecord(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}

module.exports={
    postBookingAppointment:postBookingAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment,
    postBookAppointmentNoSignIn:postBookAppointmentNoSignIn,
    getAllPatientRecord:getAllPatientRecord,
    createNewPatientRecord:createNewPatientRecord,
    updatePatientRecord:updatePatientRecord,
}