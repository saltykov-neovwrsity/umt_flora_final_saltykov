import app from "./app.js";
import sequelize from "./models/index.js";
import Bouquet from "./models/bouquet.js";
import Feedback from "./models/feedback.js";
import fs from "fs/promises";
import path from "path";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");

    await sequelize.sync();

    // Seeding bouquets
    const bouquetsCount = await Bouquet.count();
    if (bouquetsCount === 0) {
      console.log("Database is empty. Seeding bouquets from db.json...");
      try {
        const dbJsonPath = path.resolve("..", "db.json");
        const rawData = await fs.readFile(dbJsonPath, "utf8");
        const data = JSON.parse(rawData);
        if (data && Array.isArray(data.bouquets)) {
          const seededBouquets = data.bouquets.map(b => ({
            title: b.title,
            description: b.description,
            price: Number(b.price),
            photoURL: b.imageBase || "bouquet-1",
            favorite: false
          }));
          await Bouquet.bulkCreate(seededBouquets);
          console.log(`Seeded ${seededBouquets.length} bouquets into database.`);
        }
      } catch (seedError) {
        console.error(`Seeding bouquets failed: ${seedError.message}`);
      }
    }

    // Seeding feedbacks
    const feedbacksCount = await Feedback.count();
    if (feedbacksCount === 0) {
      console.log("Seeding feedbacks from db.json...");
      try {
        const dbJsonPath = path.resolve("..", "db.json");
        const rawData = await fs.readFile(dbJsonPath, "utf8");
        const data = JSON.parse(rawData);
        if (data && Array.isArray(data.feedbacks)) {
          const seededFeedbacks = data.feedbacks.map(f => ({
            author: f.author,
            text: f.text
          }));
          await Feedback.bulkCreate(seededFeedbacks);
          console.log(`Seeded ${seededFeedbacks.length} feedbacks into database.`);
        }
      } catch (seedError) {
        console.error(`Seeding feedbacks failed: ${seedError.message}`);
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
