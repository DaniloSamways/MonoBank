import { Router } from "express";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";

const router = Router();
const accountRepository = new AccountRepository();
const accountController = new AccountController(accountRepository);

router.get("/health", accountController.healthCheck);

export default router;
