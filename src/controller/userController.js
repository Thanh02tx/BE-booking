import userService from "../services/userService";
let handleLogin =async(req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode:1,
            message:'missing',
        })
    }
    let userData = await userService.handleUserLogin(email,password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUsers = async(req,res) =>{
    let id = req.query.id;
    if(!id) {
        return res.status(200).json({
            errCode:1,
            errMessage:'missing required parameter',
            users:[]
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode:0,
        errMessage:'Ok',
        users
    })
}
let handleCreateNewUser = async(req,res) =>{
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}
let handleEditUser = async(req,res)=>{
    let message = await userService.updateUserData(req.body);
    return res.status(200).json(message);
}
let handleDeleteUser = async(req,res)=>{
    if(!req.body.id) {
        return res.status(200).json({
            errCode:1,
            errMessage:'Missing requires parameters!',
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode = async(req,res) =>{
    try{
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let checkUserByEmail = async(req,res) =>{
    try{
        let data = await userService.checkUserByEmail(req.query.email);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let sendMailOtp = async(req,res) =>{
    
    try{
        let data = await userService.sendMailOtp(req.body);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let resetPassword = async(req,res) =>{

    try{
        let data = await userService.resetPassword(req.body);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let changePassword = async(req,res) =>{

    try{
        let data = await userService.changePassword(req.body);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let putEditUserHome = async(req,res) =>{
    try{
        let data = await userService.putEditUserHome(req.body);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let getAllProvinceJson = async(req,res) =>{
    try{
        let data = await userService.getAllProvinceJson();
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let getAllDistrictJson = async(req,res) =>{
    try{
        let data = await userService.getAllDistrictJson(req.query.id);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
let getAllWardJson = async(req,res) =>{
    try{
        let data = await userService.getAllWardJson(req.query.id);
        return res.status(200).json(data);
        
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
module.exports ={
    getAllProvinceJson:getAllProvinceJson,
    getAllDistrictJson:getAllDistrictJson,
    getAllWardJson:getAllWardJson,
    handleLogin:handleLogin,
    handleGetAllUsers :handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    putEditUserHome:putEditUserHome,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    checkUserByEmail:checkUserByEmail,
    resetPassword:resetPassword,
    changePassword:changePassword,
    sendMailOtp:sendMailOtp
}