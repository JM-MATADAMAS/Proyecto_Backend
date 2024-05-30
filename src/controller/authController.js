const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail, findUserByNombreSchool, getAllUsers, deleteUser, updateUser } = require('../services/userService')
const { createTeacher, findUserByEmailTeacher, getAllTeachers } = require('../services/teacherService')
const { createStudent, findUserByEmailStudent, getAllStudents } = require('../services/studentsService')

const { use } = require('../routes/authRoutes')

exports.signup = async (req, res) => { //modificado
  try {
    //Codigo para registrarse (Se agregaron los datos del singup y login)
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
    //console.log('@@@ AuthController =>', newUser.email, ' ', newUser.password)
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
    // Token para 1 hora
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

exports.signupTeacher = async (req, res) => { //modificado
  try {
    //Codigo para registrar maestros en modo sexo
    const { email, password, id, fullName, clase, genero, phoneNumber, subject } = req.body
    const existingUser1 = await findUserByEmailTeacher(email)
    if(existingUser1.success) {
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
      fullName: fullName,
      clase: clase,
      genero: genero,
      phoneNumber: phoneNumber,
      subject: subject
      // Se agregaron campos para maestro 
    }
    //console.log('@@@ AuthController =>', newUser.email, ' ', newUser.password)
    const userResult = await createTeacher(newUser)
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

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachers(); // Llamada al servicio
    res.status(200).json({
      message: 'Success',
      teachers
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error Getting all teachers',
      error: error.message
    });
  }
};

exports.signupStudents = async (req, res) => { //modificado
  try {
    //Codigo para registrar maestros en modo sexo
    const { email, password, id, fullName, clase, genero, phoneNumber } = req.body
    const existingUser2 = await findUserByEmailStudent(email)
    if(existingUser2.success) {
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
      fullName: fullName,
      clase: clase,
      genero: genero,
      phoneNumber: phoneNumber
      // Se agregaron campos para maestro 
    }
    //console.log('@@@ AuthController =>', newUser.email, ' ', newUser.password)
    const userResult = await createStudent(newUser)
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

exports.getAllStudents = async (req, res) => {
  try {
    const teachers = await getAllStudents(); // Llamada al servicio
    res.status(200).json({
      message: 'Success',
      teachers
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error Getting all teachers',
      error: error.message
    });
  }
};