import connectDB from "../lib/db";
import User from "../models/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  await connectDB();

  const hashed = await bcrypt.hash("Admin@123", 10);
  const exists = await User.findOne({ email: "admin@example.com" });
  if (exists) {
    console.log("Admin already exists");
    return;
  }

  await User.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin created: admin@example.com / Admin@123");
  process.exit();
}

createAdmin();
