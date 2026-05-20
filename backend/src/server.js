import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import tasksRoutes from './routes/tasksRouters.js';



dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();


app.use(express.json()); // đây là rào cản middleware, tự động parse json gửi lên server
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/tasks", tasksRoutes) // Dinh tuyen route

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server dang chay tren cong " + PORT);
    })
});


