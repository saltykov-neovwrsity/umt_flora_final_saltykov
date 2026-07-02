import sequelize from "../models/index.js";
import Feedback from "../models/feedback.js";
import fs from "fs/promises";
import path from "path";

async function forceSeed() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");

    // Очищаємо таблицю перед заселенням
    await Feedback.destroy({ where: {}, truncate: true, cascade: true });
    console.log("Feedbacks table cleared successfully");

    const dbJsonPath = path.resolve("..", "db.json");
    const rawData = await fs.readFile(dbJsonPath, "utf8");
    const data = JSON.parse(rawData);

    if (data && Array.isArray(data.feedbacks)) {
      const seededFeedbacks = data.feedbacks.map(f => ({
        author: f.author,
        text: f.text
      }));
      await Feedback.bulkCreate(seededFeedbacks);
      console.log(`Successfully seeded ${seededFeedbacks.length} feedbacks into database.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

forceSeed();
