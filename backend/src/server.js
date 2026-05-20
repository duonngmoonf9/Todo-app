import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { connectDB } from './config/db.js';
import tasksRoutes from './routes/tasksRouters.js';


dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();


app.use(express.json()); // đây là rào cản middleware, tự động parse json gửi lên server

if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", tasksRoutes) // Dinh tuyen route


//cau hinh duong dan back ben frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server dang chay tren cong " + PORT);
    })
});


