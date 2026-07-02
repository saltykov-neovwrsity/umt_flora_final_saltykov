import sequelize from "../models/index.js";
import Bouquet from "../models/bouquet.js";
import fs from "fs/promises";
import path from "path";

async function forceSeed() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    await sequelize.sync();
    
    // Очищаємо таблицю перед повторним заповненням
    await Bouquet.destroy({ truncate: true, cascade: true });
    console.log("Cleared bouquets table.");
    
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
      console.log(`Successfully seeded ${seededBouquets.length} bouquets into database.`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Force seed failed:", error);
    process.exit(1);
  }
}

forceSeed();
