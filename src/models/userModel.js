const firebase = require('../config/firebase')
const usersCollection = firebase.firestore().collection('users')
const TeachersCollection = firebase.firestore().collection('Teachers') // Teachers

exports.createUser = async (userData) => {
try {
  await usersCollection.doc(userData.id).set(userData)
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
exports.findUserById = async (userId) => {
  try {
    const userFound = await usersCollection.doc(userId).get()
    if (userFound.exists) {
      return {
        success: true,
        user: userDoc.data()
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
exports.findUserByEmail = async (email) => {
  try {
    const userEmail = await usersCollection.where('email', '==', email).get()
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
exports.getAllUsers = async () => {
  try {
    const allUsers = await usersCollection.get()
    const users = []
    allUsers.forEach((doc) => {
      users.push(doc.data())
    })
    return users
  } catch (error) {
    throw new Error('Error getting users: ' + error.message)
  }
}
exports.deleteUser = async (userId) => {
  try {
    await usersCollection.doc(userId).delete()
  } catch (error) {
    throw new Error('Error deleting user' + error.message)
  }
}
exports.updateUser = async (userId, userData) => {
  try {
    await usersCollection.doc(userId).update(userData)
  } catch (error) {
    throw new Error('Error Updating user' + error.message)
  }
}
exports.findUserByNombreSchool = async (nombreSchool) => {
  try {

    const userSchool = await usersCollection.where('nombreSchool', '==', nombreSchool).get();
    if (!userSchool.empty) {
      const userFound = userSchool.docs[0];
      return {
        success: true,
        user: userFound.data()
      };
    } else {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

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