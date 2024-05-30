const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createStudent, findUserByEmailStudent, getAllStudentsFromModel } = require('../models/studentsModel')
require('dotenv').config()

exports.createStudent = async (userData) => {
    try {
      const createdUser = await createStudent(userData)
      if (createdUser.success) {
        return {
          success: true
        }
      }
      return {
        success: false,
        message: 'Error al registrar'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  exports.findUserByEmailStudent = async (email) => {
    try {
      const found = await findUserByEmailStudent(email)
      if (found.success) {
        return {
          success: true,
          user: found.user
        }
      }
      return {
        success: false,
        message: 'Usuario No Encontrado'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  exports.getAllStudents = async () => {
    try {
      const teachers = await getAllStudentsFromModel();
      return {
        success: true,
        teachers
      };
    } catch (error) {
      throw new Error('Error Getting teachers: ' + error.message);
    }
  };