import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from "@prisma/client";
import { config } from "@/config";


export interface UserJwtPayload {
  id: string;
  email: string;
}

const prisma = new PrismaClient();

const validateJWT = (token: string) => {
  if (!token) {
    return { success: false, message: 'Auth Token Not Provided' };
  }
  try {
    const payload = jwt.verify(token, config.auth.jwtSecret) as UserJwtPayload;
    return { success: true, payload };
  } catch (ex) {
    return { success: false, message: 'Invalid or expired token' };
  }
}

export const verifyUser = (role: UserRole): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // let token = req.cookies.token;
    let token = '';
    // if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    // }

    const payloadObj = validateJWT(token);
    if (!payloadObj.success) {
      return res.status(401).json({ success: false, message: payloadObj.message });
    }
    if (!payloadObj.payload) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const userId = payloadObj.payload.id;
    req.user = payloadObj.payload;

    // Role checks 
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    let hasRole = false;
    switch (role) {
      case "ADMIN":
        hasRole = user.role === "ADMIN";
        break;
      case "STORE_INCHARGE":
        hasRole = user.role === "STORE_INCHARGE";
        break;
      case "STORE_INCHARGE":
        hasRole = user.role === "STORE_INCHARGE";
        break;
      case "ACCOUNTS_MANAGER":
        hasRole = user.role === "ACCOUNTS_MANAGER";
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    if (!hasRole) {
      console.log(role, hasRole);
      return res.status(403).json({ success: false, message: 'User Verification Failed' });
    }

    return next();
  }
}