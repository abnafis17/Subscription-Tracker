import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

// app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello World! Welcome to the Subscription Tracker API.</h1>");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectToDatabase();
});

export default app;
