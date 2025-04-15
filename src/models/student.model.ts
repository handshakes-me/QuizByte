import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true }, // Hashed password
    prn: { type: String, unique: true, sparse: true }, // Unique student PRN
    organizations: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: "Organization",
        }
    ],
    role: { type: String, default: "STUDENT", required: true  },
    resetPasswordToken: { type: String, expires: 900 },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);