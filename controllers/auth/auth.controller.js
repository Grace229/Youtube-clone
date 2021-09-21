const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const verifyEmail = require('../../utils/verifyEmail')
const randomstring = require('randomstring')
module.exports = {
    register: async(req, res) => {
        res.render('auth/register', {pageTitle: "Register"})
    },
    login: async(req, res) => {
        res.render('auth/login', {pageTitle: "Login"})
    },
    postRegister: async(req, res) => {
            try {
                console.log(req.body)
                let {userName, email, password, confirmPassword} = req.body;
                if(password.length < 6) {
                req.flash('error-message', "Passwords is less than 6 characters")
                return res.redirect('back');
                }
                if (password != confirmPassword) {
                req.flash('error-message', "Passwords do not match")
                return res.redirect('back');
            }
            let emailExists = await User.findOne({email});
            let usernameExists = await User.findOne({userName});
        
            if (usernameExists){
                req.flash('error-message', "Username already exist")
                return res.redirect('back');
            }
            if (emailExists){
                req.flash('error-message', "Email already taken")
                return res.redirect('back');
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt)
            const secretToken = randomstring.generate()
        
            let newUser = new User({
                userName,
                email,
                password: hashedPassword,
            })
        await verifyEmail(req, userName, email, secretToken)
            newUser = await newUser.save();
        
            if(!newUser){
                req.flash('error-message', "Something went wrong, please try again")
                return res.redirect('back');
            }
        
            req.flash('success-message', "Registration successful, you can login")
            res.redirect('/auth/login');
            } catch (err) {
                console.log(err)
            }
    
    },
    postLogin: async(req, res) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
            successFlash: true,
            session: true,
            })
    },
    forgotPassword: async(req, res) => {

    }
    }