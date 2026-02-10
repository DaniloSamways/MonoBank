import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { authMiddleware } from "@monobank/shared";

const router = Router();
const authRepository = new AuthRepository();
const authController = new AuthController(authRepository);

router.post("/", authController.createUser);
router.get("/login", authController.login);
router.get("/health", authController.healthCheck);
router.get(
  "/by-email/:email",
  authMiddleware.authenticate,
  authController.findUserByEmail,
);
router.get("/:id", authMiddleware.authenticate, authController.findUserById);
router.patch("/:id", authMiddleware.authenticate, authController.updateUser);
router.delete("/:id", authMiddleware.authenticate, authController.deleteUser);

export default router;
