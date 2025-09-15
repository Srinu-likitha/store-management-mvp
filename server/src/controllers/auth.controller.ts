import { loginService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { LoginRequest } from "@/types/zod";
import { errorHandler } from "@/utils/error";
import { Request, Response } from "express";

export async function loginController(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = LoginRequest.parse(req.body);
    const token = await loginService(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token }
    });
  } catch (err) {
    return errorHandler(err, "Error in loginController", res);
  }
}

export async function me(req: Request, res: Response): Promise<Response> {
  try {

    const user = await userService.getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user
    });
  } catch (error) {
    return errorHandler(error, "Error in me controller", res);
  }
}