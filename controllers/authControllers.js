const userModel = require('./../models/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password")
const nodemailer = require('nodemailer')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Mailgen = require("mailgen");


const loginUser = async (req, res) => {
    try {

        if (
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(404).json({
                flag: 0,
                messsage: "Please provide the email and password"
            })
        }

        let dummyUser = await userModel.findOne({
            email: req.body.email
        })

        if (!dummyUser) {
            return res.status(404).json({
                flag: 0,
                message: "invalid credentials"
            })
        }



        const verify = bcrypt.compareSync(req.body.password, dummyUser.password);

        if (!verify) {
            return res.status(404).json({
                flag: 0,
                message: "invalid credentials"
            })
        }

        const token = jwt.sign({ _id: dummyUser._id }, process.env.USER_JWT_SECRET);

        let tr = dummyUser;

        tr['password'] = undefined




        return res.status(200).json({
            flag: 1,
            message: "Login Succesful",
            data: {
                user: tr,
                token
            }
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            flag: 0,
            message: "Internal Server Error"
        })
    }
}

const registerUser = async (req, res) => {
    try {

        

        if (
            !req.body.email ||
            !req.body.password ||
            !req.body.codeforces_handle
        ) {

            return res.status(404).json({
                flag: 0,
                message: "Please provide complete data"
            })
        }

        let existingAccount = await userModel.findOne({
            email: req.body.email
        });

        if (existingAccount) {
            return res.status(404).json({
                flag: 0,
                message: "Account already exists for this email address"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        let newUser = new userModel({

            email: req.body.email,
            codeforces_handle: req.body.codeforces_handle,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(200).json({
            flag: 1,
            message: "Registration Completed",
            data: {
                codeforces_handle: newUser.codeforces_handle,
                email: req.body.email
            }
        });



    } catch (e) {
        console.log(e);
        return res.status(500).json({ flag: 0, message: "internal server error" })

    }
}

const hotmailtester = (email_id,response) =>{
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
        
      });

    

    let MailGenerator = new Mailgen({
        theme: "neopolitan",
        product: {
          name: "CodePred",
          link:"https://code-pred.netlify.app/",         
          copyright: 'Copyright © 2021 CodePred. All rights reserved.',
        },
      });


    
      let mail = MailGenerator.generate(response);
    
      let message = {
        from: process.env.EMAIL,
        to: email_id,
        subject: "Password reset",
        html: mail,
      };
    

      transporter
        .sendMail(message)
        .catch((error) => console.error(error));

    
}



    

const forgotPassword = async (req, res) => {
    try {

        

        if (!req.body.email) return res.status(200).json({
            flag: 0,
            message: "Invalidd Email Address, no account exists with this email address"
        })

        

        let user = await userModel.findOne({ email: req.body.email })

        if (!user) return res.status(404).json({
            flag: 0,
            message: "Invalid Email Address, no account exists with this email address"
        })

        let password = generator.generate({
            length: 8,
            numbers: true,
            upperCase: true,
            symbols: true
        });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        user.password = hashedPassword;
        user.save();

        

        let response = {
            body: {
              
              intro: "Password Reset Request",
              outro: 'Your new Password is: ' + password
            },
          };

          hotmailtester(req.body.email,response)


        return res.status(200).json({ flag: 1, message: "Password has been sent to your email" })



    } catch (error) {
        console.log(error)
        res.status(404).json({
            flag: 0,
            message: "Internal Server Error"
        })
    }
}

const resetPassword = async (req, res) => {
    try {

        if (!req.body.email || !req.body.password || !req.body.new_password) {
            return res.status(403).json({
                flag: 0,
                message: "Please provide complete data"
            })
        }

        const user = await userModel.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(403).json({
                flag: 0,
                message: "Invalid Credentials"
            })
        }

        const verify = bcrypt.compareSync(req.body.password, user.password);

        if (!verify) {
            return res.status(403).json({
                flag: 0,
                message: "Invalid Credentials"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.new_password, salt);

        user.password = hashedPassword;
        user.save();




        return res.status(200).json({ flag: 1, message: "Password Reset Succesful" })


    } catch (e) {
        return res.status(404).json({
            flag: 0,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
    
   
}