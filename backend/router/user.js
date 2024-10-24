import express from "express";
import { userSchema, userSignin } from "../middleware.js/zodmiddleware.js"; // Ensure the correct path and extension
import {PrismaClient, UserType} from "@prisma/client"
import { v4 as uuid }  from "uuid"
import { ZodError } from "zod";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const prisma=new PrismaClient();

const userRouter = express.Router();
export default userRouter;

//create user
userRouter.post("/create", async (req, res) => {
    let value = req.body;
    try {
        value = await userSchema.parseAsync(value); 
       let user = await prisma.user.findFirst({
        where: {
            email: value.email,
        },
    });
        if(user){
            res.status(404).json({
                message:"user already exists"
            })
            return;
        }
        const id =uuid();
        user=await prisma.user.create({
            data:{
                id:id,
                email:value.email,
                name:value.name,
                roll:value.roll ? value.roll : "",
                type:value.type ==="student" ? UserType.STUDENT:UserType.TEACHER,
                password:value.password
            }
        })
        const token=jwt.sign(id,process.env.JWT_SECRET);

        return res.status(201).json({
            message: "User created",
            data: value,
            token:token 
            });
    } catch (err) {
        if(err instanceof ZodError){
            console.log(err);
            return res.status(400).json({
                message: err.issues[0].message // Return the validation errors
            });
        }else{
            return res.status(404).json({
                message:err
            })
        }
        
    }
});


//signin user
userRouter.post("/signin",async(req,res)=>{
    let value=req.body;
    try{
    value=await userSignin.parseAsync(value);
    console.log("user");
    const user=await prisma.user.findFirst({
        where:{
            email:value.email
        }
    })
    console.log(user);
    
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    if(user.password!=value.password){
        return res.status(404).json({
            message:"wrong password"
        })
    }
    const token =jwt.sign(user.id,process.env.JWT_SECRET);
    return res.json({
        message:"user logged in successfully",
        token,
        user
    })
    }catch(err){
        if(err instanceof ZodError){
            return res.status(404).json({
                message:err.issues[0].message
            })

        }else{
            return res.status(404).json({
                message:err
            })
        }
    }
})


