import express from "express";
import UserController from "../controllers/UserController";
import adminAuth from "../middlewares/AdminAuth";

const app = express();
const router = express.Router();

router.get("/users", adminAuth, UserController.index);
router.post("/users", UserController.create);
router.get("/users/:id", adminAuth, UserController.show);
router.put("/users/:id", adminAuth, UserController.edit);
router.delete("/users/:id", adminAuth, UserController.delete);

router.post("/recover-password", UserController.recoverPassword);
router.post("/change-password", UserController.changePassword);
router.post("/login", UserController.login);

export default router;
