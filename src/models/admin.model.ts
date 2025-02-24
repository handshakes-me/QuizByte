import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    verified: { type: Boolean, default: false },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization"},
    role: { type: String, default: "ADMIN" },
    resetPasswordToken: { type: String, expires: 900 },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
