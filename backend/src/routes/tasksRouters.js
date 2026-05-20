import express from 'express';
import { createTask, deleteTask, getAllTasks, updateTask } from '../controllers/tasksController.js';


const router = express.Router();

// ham tao api
router.get("/", getAllTasks)
router.post("/create", createTask)
router.put("/update/:id", updateTask)
router.delete("/delete/:id", deleteTask)

export default router;
