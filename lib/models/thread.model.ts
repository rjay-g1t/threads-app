import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  community: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
  likes: [{ type: String, required: false }],
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;
