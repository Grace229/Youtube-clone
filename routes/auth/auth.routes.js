const express = require('express') 
const router = express.Router();
const {register,
    login,
     postRegister,
      postLogin,
       forgotPassword
    } = require('../../controllers/auth/auth.controller')
    router.route('/register')
    .get(register)
    .post(postRegister);

router.route('/login')
.get(login)
.post(postLogin),
module.exports = router