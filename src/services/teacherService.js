const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createTeacher, findUserByEmailTeacher, getAllTeachersFromModel } = require('../models/teacherModel')
require('dotenv').config()

exports.createTeacher = async (userData) => {
    try {
      const createdUser = await createTeacher(userData)
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
  exports.findUserByEmailTeacher = async (email) => {
    try {
      const found = await findUserByEmailTeacher(email)
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
  exports.getAllTeachers = async () => {
    try {
      const teachers = await getAllTeachersFromModel();
      return {
        success: true,
        teachers
      };
    } catch (error) {
      throw new Error('Error Getting teachers: ' + error.message);
    }
  };