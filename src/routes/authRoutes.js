const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/signup', authController.signup)
router.post('/signupTeacher', authController.signupTeacher) // 
router.post('/login', authController.login)
router.get('/get-allusers', authMiddleware, authController.getAllUsers)
router.get('/get-allteachers', authMiddleware, authController.getAllTeachers);
router.delete('/delete-user/:id', authMiddleware, authController.deleteUser)
router.put('/update-user/:id', authMiddleware, authController.updateUser)
module.exports = router;
//owo