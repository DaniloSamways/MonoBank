import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";

const router = Router();
const authRepository = new AuthRepository();
const authController = new AuthController(authRepository);

router.get("/login", authController.login);
router.get("/health", authController.healthCheck);
router.get("/by-email/:email", authController.findUserByEmail);
router.post("/", authController.createUser);
router.get("/:id", authController.findUserById);
router.patch("/:id", authController.updateUser);
router.delete("/:id", authController.deleteUser);

export default router;
