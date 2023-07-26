import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { UserModel } from "../models/user.model";
const router = Router();

router.get("/seed", asyncHandler(
    async (req,res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount>0){
            res.send("seed is already done")
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seed is done");
    }
))
// api for login
// router.post("/login", (req,res) => {
//     const {email, password} = req.body;
//     const user = sample_users.find(user => user.email === email && user.password === password);

//     if(user){
//         res.send(generateTokenResponse(user));
//     }
//     else{
//         res.status(400).send("username or password is inavlid");
//     }
// })


router.post("/login", asyncHandler(
    async (req,res) => {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
    
        if(user){
            // console.log("yes");
            res.send(generateTokenResponse(user));
        }
        else{
            // console.log("No");
            res.status(400).send("username or password is inavlid");
        }
    }
))

// Generating response token
const generateTokenResponse  = (user:any) =>{
    // console.log("user b4 token =============================", {...user});
    const token = jwt.sign({
        // Added jwt_secret code
        email:user.email, isAdmin:user.isAdmin
        }, "test", {
        expiresIn:"30d"
    });
     user._doc.token = token;
    // const u = { ...user._doc, token: token };
    //  console.log("USER after token  = ====================================================", u);
    return user;
}
export default router;