import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken"

 const auth = (req: Request, res: Response, next: NextFunction) => {
   try {
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret) {
        return res.status(500).json({message: "JWT secret is not configured"})
    }

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "No token provided, authorization denied"})
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({message: "No token provided, authorization denied"})
    }

    const decoded = jwt.verify(token, jwtSecret);
    if(typeof decoded !== "object" || decoded === null || typeof decoded.id !== "string") {
        return res.status(401).json({message: "Token is not valid"})
    }
    
    req.user = {id: decoded.id}
    next();
    
   } catch (error) {
    console.error(error);
    res.status(401).json({message: "Token is not valid"})
   }
   
}


export default auth;