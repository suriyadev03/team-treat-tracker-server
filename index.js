const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config();
const signupSchema = require("./models/signupModel");
const { sendEmail } = require('./emailService');
mongoose.set('strictQuery', false);

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Register API

app.get('/', (req, res) => {
      res.send("server run successful");
  });

app.post("/register", async (req, res) => {
    try {
        const { Name, EmpId, Email, Password, DateOfBirth } = req.body;
        const hashPassword = await bcrypt.hash(Password, 10);
        const newUser = new signupSchema({
            Name,
            EmpId,
            Email,
            Password: hashPassword,
            DateOfBirth,
            ProfileImg : ""
        });
        await newUser.save();
        res.status(200).json({ status: "ok", msg: "Account creation successful." });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { EmpId, Password } = req.body;
        const User = await signupSchema.findOne({ $or: [{ EmpId }, { Email: EmpId }] });
        if (!User) {
            return res.status(400).json({ msg: "Unable to find the Employee Details" });
        }
        const isMatch = await bcrypt.compare(Password, User.Password);

        if (!isMatch) {
            console.log("Incorrect Password");
            return res.status(400).json({ status: "warning", msg: "Incorrect Password" });
        }
        try {
            // const allUser = await signupSchema.find({});
            return res.status(200).json({loggedUser:User, status: "ok", msg: "Login successful! Welcome back!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: err.message, msg: "Internal Server Error" });
    }
});

app.post("/forgetpassword", async (req, res) => {
    try {
        const { Email } = req.body;
        const User = await signupSchema.findOne({ Email });
        if (!User) {
            return res.status(400).json({ status: "error", msg: "Enter Your Valid Email" });
        }
        const createOtp = Math.floor(1000 + Math.random() * 9000);
        sendEmail(Email, createOtp, User.Name);
        return res.status(200).json({ status: "ok", otp: createOtp, msg: "OTP send successful!" });
    } catch (err) {
        return res.status(500).json({ error: err.message, msg: "Internal Server Error" });
    }
});

app.post("/getUser", async (req,res) => {
    try {
        const allUser = await signupSchema.find({});
        return res.status(200).json({users:allUser, status: "ok" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



app.post("/updateUser",async (req, res) => {
    try {
        const { Name, EmpId, Email,ProfileImg } = req.body;
        const User = await signupSchema.findOne({EmpId});
        if (!User) {
            return res.status(400).json({ status: "error", msg: "User Not Found" });
        }
        User.Name = Name
        User.Email = Email
        // User.ProfileImg = ProfileImg
        await User.save();
        return res.status(200).json({status: "ok",msg:'Update successful',loggedUser : User });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post("/updatepassword", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const User = await signupSchema.findOne({ Email });
        if (!User) {
            return res.status(400).json({ status: "error", msg: "Enter Your Valid Email" });
        }
        const hashPassword = await bcrypt.hash(Password, 10);
        User.Password = hashPassword
        await User.save();
        return res.json({ status: 'ok', success: true, msg: "Password updated successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message, msg: "Internal Server Error" });
    }
});

// async function updateUsers() {
//     try {
//         await signupSchema.updateMany(
//             { ProfileImg: { $exists: false } }, // Update only where ProfileImg does not exist
//             { $set: { ProfileImg: ""} }     // Set ProfileImg to null for existing users
//         );
//         console.log('Users updated successfully');
//     } catch (err) {
//         console.error('Error updating users:', err);
//     } finally {
//         mongoose.disconnect();
//     }
// }

// updateUsers();
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("MongoDB Connected");
    }).catch((err) => {
        console.log(err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
