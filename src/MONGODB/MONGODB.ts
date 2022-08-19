import mongoose from "mongoose";

const chatScheme = new mongoose.Schema({
  chatId: String,
  chat: [{ username: String, points: Number }],
});

const Chat = mongoose.model("Chat", chatScheme);

class MONGODB {
  private db;

  constructor(url: string) {
    this.db = mongoose.connect(url);
  }

  async getChat(id: string) {
    return await Chat.findOneAndUpdate(
      { chatId: id },
      {},
      { upsert: true, new: true }
    );
  }

  async updatePoints(chatId: string, userId: string, newPoint: number) {
    const chatDocument = await this.getChat(chatId);
    let userData = chatDocument?.chat.find(
      ({ username }) => username === userId
    );
    if (userData) {
      userData.points = (userData.points || 0) + newPoint;
    } else {
      userData = { username: userId, points: 0 };
      chatDocument?.chat.push(userData);
    }
    chatDocument?.save();
  }
}

const url = process.env.MONGODB_URI;

export const DB = new MONGODB(url!);
