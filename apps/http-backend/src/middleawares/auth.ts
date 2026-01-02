import { Request, Response, NextFunction } from "Express";
import { auth } from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node"


export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const session = await auth.api.getSession({
        header: fromNodeHeaders(req.headers)
    });

    if(!session){
        res.status(401).json({
            msg: "Unauthorized"
        })
    }

    req.user = session.user;
    req.session = session.session;

    next();
};