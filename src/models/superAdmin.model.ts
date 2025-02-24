import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, default: "SUPERADMIN" },
    resetPasswordToken: { type: String, expires: 900 },
}, { timestamps: true });

export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", SuperAdminSchema);