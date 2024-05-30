const firebase = require('../config/firebase')
const TeachersCollection = firebase.firestore().collection('Teachers') // Teachers

//
exports.createTeacher = async (userData1) => {
    try {
      await TeachersCollection.doc(userData1.id).set(userData1)
      return {
        success: true
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
        const userEmail = await TeachersCollection.where('email', '==', email).get()
        if (!userEmail.empty) {
          const userFound = userEmail.docs[0]
          return {
            success: true,
            user: userFound.data()
          }
        } else {
          return {
            success: false,
            error: 'User not Found'
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
  }
  exports.getAllTeachersFromModel = async () => {
    try {
      const allTeachers = await TeachersCollection.get();
      const teachers = [];
      allTeachers.forEach((doc) => {
        teachers.push(doc.data());
      });
      return teachers;
    } catch (error) {
      throw new Error('Error getting teachers: ' + error.message);
    }
  };