// models/Job.js
import mongoose,{Schema} from 'mongoose'

const jobSchema = new Schema({
  title: String,
  company: String,
  location: String,
  skills: [String],
});

export const Job = mongoose.model("Job",jobSchema);
