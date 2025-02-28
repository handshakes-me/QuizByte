import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true }, // Hashed password
    prn: { type: String, unique: true }, // Unique student PRN
    organizations: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: "Organization",
            required: true,
            unique: true,
        }
    ],
    role: { type: String, default: "STUDENT", required: true  },
    resetPasswordToken: { type: String, expires: 900 },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);

                                                                                                                     // signup -> verify enail -> join org using organization invite link ->                                        register for exam by joining exam group using link -> select subjects from the list -> view details in dashboard -> attempt exam -> view results
                                                            // sign up and join org using link -> verify email -> create invite link for students 👆 -> create exam group -> add subjects -> create registration link for exam group  👆 -> create exams for respective subject along with schedule -> view list of students registered for a exam group -> and status of students attempted the exam along with details -> make results public 
// sign up -> verify mail -> create org and joining link for admin 👆
 