import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  examGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamGroup', required: true },
  students: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, sparse: true },
      prn: { type: String, required: true, unique: true, sparse: true },
      joined: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true })

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema)