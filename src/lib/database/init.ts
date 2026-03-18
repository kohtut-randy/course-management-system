import { initializeDatabase } from "./orm-config";

export async function initDatabase() {
  try {
    const dataSource = await initializeDatabase();

    // Optional: Create default admin user or initial data
    // await seedDatabase(dataSource);

    return dataSource;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Optional: Seed function for initial data
async function seedDatabase(dataSource: any) {
  // Add any initial data you might need
  console.log("🌱 Seeding database...");
}
