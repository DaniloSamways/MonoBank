import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { authMiddleware } from "@monobank/shared";
import { AuthService } from "./auth.service";

const router = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/", authController.create);
router.get("/login", authController.login);
router.get("/health", authController.healthCheck);
router.get("/:id", authMiddleware.authenticate, authController.findById);
router.patch("/:id", authMiddleware.authenticate, authController.update);
router.delete("/:id", authMiddleware.authenticate, authController.delete);

export default router;
