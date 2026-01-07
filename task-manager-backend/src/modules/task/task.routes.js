import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "./task.controller.js";

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
