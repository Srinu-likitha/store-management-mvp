import { loginController, me } from "@/controllers/auth.controller";
import { verifyUser } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/login", loginController)
router.get("/me", verifyUser("ALL") ,me);

export default router