const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../services/userService')
const { use } = require('../routes/authRoutes')

exports.signup = async (req, res) => { //modificado
  try {
    //Codigo para registrarse
    const { email, password, id, nombre, apaterno, amaterno, direccion, telefono, estado } = req.body
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
      nombre: nombre,
      apaterno: apaterno,
      amaterno: amaterno,
      direccion: direccion,
      telefono: telefono,
      estado: estado
      // agregar otros campos 
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
    //Codigo para loggearmos
    const { email, password } = req.body
    const findEmail = await findUserByEmail(email)
    if (!findEmail.success) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      })
    }
    const user = findEmail.user
    const findPassword = await bcrypt.compare(password, user.password)
    if (!findPassword) {
      return res.status(401).json({
        message: 'Password incorrecta'
      })
    }
    const token = jsonwebtoken.sign({
      email: user.email,
      userId: user.id
    }, process.env.TOP_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({
      token: token
    })
  } catch (error) {
      res.status(500).json({
        message: error.message
    })
  }
}

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