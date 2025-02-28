import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  examGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamGroup', required: true },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
}, { timestamps: true })

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema)