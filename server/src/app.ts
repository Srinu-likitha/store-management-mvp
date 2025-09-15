import express from 'express'
import cors from 'cors'

export const app = express();

import authRoutes from '@routes/auth.routes'
import userRoutes from '@routes/user.routes'

app.use(cors())
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
})
