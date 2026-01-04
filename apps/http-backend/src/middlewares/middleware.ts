import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import  jwt  from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export function Auth(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({
            message: "No token provided or malformed header"
        })
        return;
    }
    // extracting the token from the bearer
    const token = authHeader?.split(' ')[1];

    if(!token){
        res.status(401).json({
            message: "No token provided"
        })
    }

    try{
        if(!JWT_SECRET){
            console.error("JWT secret is not configured");
            res.status(500).json({
                message: "Server configuration error"
            })
            return;
        }

        const response = jwt.verify(token as string, JWT_SECRET);

        if(typeof response === 'string'){
            res.status(401).json({
                message: "Invalid token format"
            })
            return;
        }

        req.id = response.id;
        next();
    }catch(e){
        res.status(404).json({
            message: "Incorrect token"
        })
        console.error(e);
    }
}