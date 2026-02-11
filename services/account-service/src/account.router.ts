import { Router } from "express";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";

const router = Router();
const accountRepository = new AccountRepository();
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(
  accountService,
  accountRepository,
);

router.get("/health", accountController.healthCheck);
router.post("/transfer", accountController.transferFunds);
router.get("/balance/:accountId", accountController.getBalance);
router.post("/", accountController.create);

export default router;
