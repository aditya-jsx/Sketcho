import express from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { SignUpSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db/client";
import jwt from "jsonwebtoken"
import { Auth } from "./middlewares/middleware";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {

    const requiredBody = SignUpSchema.safeParse(req.body);
    if(!requiredBody.success){
      res.status(401).json({
          message: "Incorrect data in input fields"
      })
      return;
    }
    const { name, username, password } = requiredBody.data;
    // console.log("DB URL:", process.env.DATABASE_URL);

    
    try{
        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        // checking user in the db
        const existingUser = await prisma.user.findFirst({ where: { username: username } });

        if(existingUser){
            res.status(401).json({
                message: "User with this username already exists."
            });
            return;
        }

        await prisma.user.create({
            data: {
                name: name,
                username: username,
                password: hashedPassword
            }
        })

        res.status(200).json({
            message: "Signup Completed"
        })
        return
    }catch(e){
        console.error("Database error during SignUp: ", e);
        res.status(500).json({
            msg: "An unexpected error occured during signUp"
        })
    }

  
})

app.post("/signin", async (req, res) => {

    const requiredBody = SignInSchema.safeParse(req.body);
    if(!requiredBody.success){
      res.status(401).json({
          message: "Incorrect data in input fields"
      })
      return;
    }
    const { username, password } = requiredBody.data;
    // console.log(JWT_SECRET);

    try{
        // checking if the user exists
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if(!user){
            res.status(401).json({
                message: "User not found."
            });
            return;
        }
        
        // matching password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){

            if (!JWT_SECRET) {
                console.error("JWT secret is not configured.");
                return res.status(500).json({
                    msg: "Server configuration error."
                });
            }

            const token = jwt.sign({
                id: user.id.toString()
            }, JWT_SECRET as string);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60,
                sameSite: 'lax',
            })

            res.status(200).json({
                message: "Signin successfull",
                token: token
            })

        }else{
            res.status(500).json({
                message: "Incorrect Credentials"
            })
        }
    }catch(e){
        console.error("Error during signin:", e);
        if (e instanceof Error) {
            return res.status(500).json({
                msg: "An unexpected error occurred during signin",
                error: e.message
            });
        } else {
            return res.status(500).json({
                msg: "An unexpected and unknown error occurred",
                error: String(e)
            });
        }
    }
})

app.post("/create-room", Auth, (req, res) => {
    res.json({
        roomsId: 123123
    })
})

app.listen(3001);