import handbookService from '../services/handbookService';

let createNewHandbook=async(req,res)=>{
    try{
        let infor = await handbookService.createNewHandbook(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getAllHandbook=async(req,res)=>{
    try{
        let infor = await handbookService.getAllHandbook();
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let putEditHandbook=async(req,res)=>{
    try{
        let infor = await handbookService.putEditHandbook(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let deleteHandbook=async(req,res)=>{
    try{
        let infor = await handbookService.deleteHandbook(req.body);
   
        return res.status(200).json(infor)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
           message: 'Error from server...'
       })
    }
}
let getDetailHandbookById=async(req,res)=>{
    try{
        let infor = await handbookService.getDetailHandbookById(req.query);
   
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
    createNewHandbook:createNewHandbook,
    getAllHandbook:getAllHandbook,
    putEditHandbook:putEditHandbook,
    deleteHandbook:deleteHandbook,
    getDetailHandbookById:getDetailHandbookById
}