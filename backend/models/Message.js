import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reply: {
    type: String,
    default: "",
  },
  repliedAt: Date,
  status: {
    type: String,
    enum: ["Pending", "Replied"],
    default: "Pending", 
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
