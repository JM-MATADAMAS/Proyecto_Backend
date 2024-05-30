const firebase = require('../config/firebase')
const studentsCollection = firebase.firestore().collection('students') // Students

//
exports.createStudent = async (userData2) => {
    try {
      await studentsCollection.doc(userData2.id).set(userData2)
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
  exports.findUserByEmailStudent = async (email) => {
      try {
        const userEmail = await studentsCollection.where('email', '==', email).get()
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
  exports.getAllStudentsFromModel = async () => {
    try {
      const allStudents = await studentsCollection.get();
      const students = [];
      allStudents.forEach((doc) => {
        students.push(doc.data());
      });
      return students;
    } catch (error) {
      throw new Error('Error getting students: ' + error.message);
    }
  };