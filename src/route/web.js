import express from "express"
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';
import handbookController from '../controller/handbookController';
import bookingController from '../controller/bookingController';
import scheduleController from '../controller/scheduleController';
import commentController from '../controller/commentController';
let router = express.Router();
let initWebRoutes = (app) =>{
    router.get('/api/get-all-province-json',userController.getAllProvinceJson);
    router.get('/api/get-all-district-json',userController.getAllDistrictJson);
    router.get('/api/get-all-ward-json',userController.getAllWardJson);
    router.get('/',homeController.getHomePage);
    router.get('/crud',homeController.getCRUD);
    router.post('/post-crud',homeController.postCRUD);
    router.get('/get-crud',homeController.displayGetCRUD);
    router.get('/edit-crud',homeController.getEditCRUD);
    router.post('/put-crud',homeController.putCRUD);
    router.get('/delete-crud',homeController.deleteCRUD);//
    router.post('/api/login',userController.handleLogin);//
    router.post('/api/check-role',userController.checkRole);//
    router.post('/api/check-role-admin',userController.checkRoleAdmin);//
    router.get('/api/get-all-users',userController.handleGetAllUsers);//
    router.get('/api/check-user-by-email',userController.checkUserByEmail);//
    router.post('/api/send-mail-otp',userController.sendMailOtp);//
    router.post('/api/create-new-user',userController.handleCreateNewUser);//
    router.put('/api/edit-user',userController.handleEditUser);//
    router.put('/api/edit-user-home',userController.putEditUserHome);//
    router.delete('/api/delete-user',userController.handleDeleteUser);//
    router.put('/api/reset-password',userController.resetPassword);//
    router.put('/api/change-password',userController.changePassword)//
    router.get('/api/allcode',userController.getAllCode);//
    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome);//
    router.get('/api/get-all-doctors',doctorController.getAllDoctors);//
    router.post('/api/save-infor-doctor',doctorController.postInforDoctor);//
    router.post('/api/post-create-infor-doctor',doctorController.postCreateDoctorInfor);//
    router.post('/api/post-update-infor-doctor',doctorController.postUpdateDoctorInfor);//
    router.post('/api/post-change-active-doctor',doctorController.postChangeActiveDoctor);//
    router.get('/api/get-infor-doctor-by-id',doctorController.getInforDoctorById);//
    router.get('/api/get-detail-doctor-by-id',doctorController.getDetailDoctorById);//
    router.get('/api/get-list-patient-for-doctor',doctorController.getListPatientForDoctor);//
    // router.get('/api/get-schedule-doctor-by-date',doctorController.getScheduleByDate);
    router.get('/api/get-schedule-doctor-by-date',scheduleController.getScheduleByDate);//
    // router.get('/api/get-schedule-by-token',doctorController.getScheduleByToken);
    router.get('/api/get-schedule-by-token',scheduleController.getScheduleByToken);//
    router.get('/api/get-extra-infor-doctor-by-id',doctorController.getExtraInforDoctorById);//
    router.get('/api/get-profile-doctor-by-id',doctorController.getProfileDoctorById);//
    router.post('/api/send-remedy',doctorController.sendRemedy);//
    router.post('/api/patient-book-appointment',bookingController.postBookingAppointment);//
    // router.post('/api/patient-book-appointment',patientController.postBookingAppointment);
    router.post('/api/book-appointment-no-sign-in',patientController.postBookAppointmentNoSignIn);
    // router.post('/api/verify-book-appointment',patientController.postVerifyBookAppointment);
    router.post('/api/verify-book-appointment',bookingController.postVerifyBookAppointment);//
    router.post('/api/create-new-specialty',specialtyController.createSpecialty);//
    router.get('/api/get-all-specialty',specialtyController.getAllSpecialty);//
    router.put('/api/edit-specialty',specialtyController.editSpecialty);//
    router.delete('/api/delete-specialty',specialtyController.deleteSpecialty);//
    router.get('/api/get-detail-specialty-by-id',specialtyController.getDetailSpecialtyById);//
    router.post('/api/create-new-clinic',clinicController.createClinic);//
    router.get('/api/get-all-clinic',clinicController.getAllClinic);//
    router.put('/api/put-edit-clinic',clinicController.putEditClinic);//
    router.delete('/api/delete-clinic',clinicController.deleteClinic);//
    router.get('/api/get-detail-clinic-by-id',clinicController.getDetailClinicById);//
    router.get('/api/get-allcode-specialty',specialtyController.getAllCodeSpecialty);//
    router.post('/api/create-new-handbook',handbookController.createNewHandbook);//
    router.get('/api/get-all-handbook',handbookController.getAllHandbook);//
    router.put('/api/put-edit-handbook',handbookController.putEditHandbook);//
    router.delete('/api/delete-handbook',handbookController.deleteHandbook);//
    router.get('/api/get-detail-handbook-by-id',handbookController.getDetailHandbookById);//
    router.get('/api/get-all-patient-record',patientController.getAllPatientRecord);//
    // router.post('/api/get-all-booking-admin',patientController.getAllBookingAdmin);
    router.post('/api/get-all-booking-admin',bookingController.getAllBookingAdmin);//
    // router.get('/api/get-booking-by-id',patientController.getBookingById);
    router.get('/api/get-booking-by-id',bookingController.getBookingById);//
    router.post('/api/create-new-patient-record',patientController.createNewPatientRecord);//
    router.put('/api/update-patient-record',patientController.updatePatientRecord);//
    // router.put('/api/confirm-appointment',patientController.confirmAppointment);
    router.put('/api/confirm-appointment',bookingController.confirmAppointment);//
    router.get('/api/get-booking-patient',patientController.getBookingPatient);
    router.put('/api/put-patient-feedback',patientController.putPatientFeedback);
    router.get('/api/get-feedback-admin',patientController.getFeedbackAdmin);
    router.put('/api/put-approve-feedback',patientController.putApproveFeedback);
    router.get('/api/get-history-by-id',patientController.getHistoryById);
    router.get('/api/get-all-upcoming-appointment',patientController.getAllUpcomingAppointment);//getAllnewAppointment
    router.put('/api/cancel-appointment',bookingController.cancelAppointment);//
    router.get('/api/all-schedule-doctor-by-date',scheduleController.allScheduleDoctorByDate);//
    router.post('/api/save-doctor-schedule-by-date',scheduleController.saveDoctorScheduleByDate);//
    router.get('/api/all-schedule-by-date-and-doctorid',scheduleController.allScheduleByDateAndDoctorId);//
    router.post('/api/save-schedule-by-date-and-doctorid',scheduleController.saveScheduleByDateAndDoctorId);//


    router.get('/api/get-comments-by-doctor-id',commentController.getCommentsByDoctorId);//
    router.post('/api/post-create-comment',commentController.postCreateComment);//
    return app.use("/",router);
}
module.exports = initWebRoutes;
