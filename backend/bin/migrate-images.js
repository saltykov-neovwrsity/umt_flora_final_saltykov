import sequelize from "../models/index.js";
import Bouquet from "../models/bouquet.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    
    const bouquets = await Bouquet.findAll();
    console.log(`Found ${bouquets.length} bouquets to check.`);
    
    const imagesDir = path.resolve("..", "images");
    let migratedCount = 0;
    
    for (const bouquet of bouquets) {
      const { id, photoURL } = bouquet;
      
      // Перевіряємо, чи це старий формат (наприклад "bouquet-1")
      const isOldFormat = photoURL && !photoURL.startsWith("http") && !photoURL.startsWith("/photos/");
      
      if (isOldFormat) {
        console.log(`Migrating image for bouquet ID ${id} (${photoURL})...`);
        
        // Шукаємо файл з суфіксом @X2.jpg, якщо немає - @X1.jpg, або просто .jpg
        let fileToUpload = "";
        const possibleNames = [
          `${photoURL}@X2.jpg`,
          `${photoURL}@X1.jpg`,
          `${photoURL}.jpg`,
          `${photoURL}@X2.png`,
          `${photoURL}@X1.png`
        ];
        
        for (const name of possibleNames) {
          const fullPath = path.join(imagesDir, name);
          try {
            await fs.access(fullPath);
            fileToUpload = fullPath;
            break;
          } catch {
            // Файл не існує, пробуємо наступний
          }
        }
        
        if (!fileToUpload) {
          console.warn(`No local image found for bouquet ${photoURL} in ${imagesDir}. Skipping.`);
          continue;
        }
        
        console.log(`Uploading ${fileToUpload} to Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
          folder: "flora",
          public_id: `bouquet_${id}_initial`
        });
        
        await bouquet.update({ photoURL: uploadResult.secure_url });
        console.log(`Updated bouquet ID ${id} with secure_url: ${uploadResult.secure_url}`);
        migratedCount++;
      }
    }
    
    console.log(`Migration complete! Successfully migrated ${migratedCount} images.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
