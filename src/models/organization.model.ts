import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    inviteLink: { type: String, unique: true }, // Auto-generated link for student registration also make a controller to create a new link
    token: { type: String, unique: true }, // token for admin registration, make it null after registration
    students: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            prn: { type: String, required: true, unique: true },
            seatNumber: { type: String, required: true, unique: true },
        }
    ],
    examGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamGroup" }], // Exam groups under this organization
}, { timestamps: true });

export default mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

    