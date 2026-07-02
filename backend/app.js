import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import bouquetsRouter from "./routes/api/bouquets.js";

const app = express();

// Зчитування swagger.json в ES Modules
const swaggerPath = path.resolve("swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Підключення Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Підключення маршрутів
app.use("/api/bouquets", bouquetsRouter);
app.use("/bouquets", bouquetsRouter); // для локальної розробки та проксі

// Додаткові маршрути для сумісності з фронтендом (bestsellers, feedbacks, db.json)
const getDbData = async () => {
  const dbJsonPath = path.resolve("..", "db.json");
  const raw = await fs.promises.readFile(dbJsonPath, "utf8");
  return JSON.parse(raw);
};

app.get(["/api/bestsellers", "/bestsellers"], async (req, res, next) => {
  try {
    const data = await getDbData();
    res.json(data.bestsellers || []);
  } catch (error) {
    next(error);
  }
});

app.get(["/api/feedbacks", "/feedbacks"], async (req, res, next) => {
  try {
    const data = await getDbData();
    res.json(data.feedbacks || []);
  } catch (error) {
    next(error);
  }
});

app.get(["/api/db.json", "/db.json"], async (req, res, next) => {
  try {
    const dbJsonPath = path.resolve("..", "db.json");
    const raw = await fs.promises.readFile(dbJsonPath, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(raw);
  } catch (error) {
    next(error);
  }
});

// 404 обробник
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Централізований обробник помилок
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
