const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail, findUserByNombreSchool, getAllUsers, deleteUser, updateUser } = require('../services/userService')
const { use } = require('../routes/authRoutes')

exports.signup = async (req, res) => { //modificado
  try {
    //Codigo para registrarse
    const { email, password, id, nombreAdmin, nombreSchool, numeroStaff, directionSchool } = req.body
    const existingUser = await findUserByEmail(email)
    if(existingUser.success) {
      return res.status(400).json({
        message: 'El usuario ya esta registrado'
      })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const newUser = {
      email: email,
      password: hashedPassword,
      id: id,
      nombreAdmin: nombreAdmin,
      nombreSchool: nombreSchool,
      numeroStaff: numeroStaff,
      directionSchool: directionSchool
      // Se agregaron campos para estudiante 
    }
    console.log('@@@ AuthController =>', newUser.email, ' ', newUser.password)
    const userResult = await createUser(newUser)
    if(userResult.success) {
      res.status(201).json({
        message: 'Usuario Registrado Satisfactoriamente'
      })
    } else {
      res.status(500).json({
        message: 'Error al registrar usuarios'
      })
    }
  } catch (error) {
    res.status(500).json({
        message: error.message
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { nombreSchool, password } = req.body;

    const findSchool = await findUserByNombreSchool(nombreSchool);
    if (!findSchool.success) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      });
    }

    const user = findSchool.user;

    const findPassword = await bcrypt.compare(password, user.password);
    if (!findPassword) {
      return res.status(401).json({
        message: 'Password incorrecta'
      });
    }

    const token = jsonwebtoken.sign({
      nombreSchool: user.nombreSchool,
      userId: user.id
    }, process.env.TOP_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({
      token: token,
      message: 'Logged In'
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers()
    res.status(200).json({
      message: 'Success',
      users
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error Getting all Users',
      error: error.message
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const userData = req.body
    console.log(userId, userData)
    await updateUser(userId, userData)
    res.status(200).json({
      message: 'User Updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    const userData = req.body
    await deleteUser(userId, userData)
    res.status(200).json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    })
  }
}