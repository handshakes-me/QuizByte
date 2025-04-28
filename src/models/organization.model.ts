import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    inviteLink: { type: String, unique: true, sparse: true }, // Auto-generated link for student registration also make a controller to create a new link
    token: { type: String, unique: true, sparse: true }, // token for admin registration, make it null after registration
    students: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true, sparse: true },
            prn: { type: String, required: true, unique: true, sparse: true },
            joined: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    examGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamGroup" }], // Exam groups under this organization
}, { timestamps: true });

export default mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

