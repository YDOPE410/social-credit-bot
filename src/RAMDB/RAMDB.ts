class RAMDB {
  private DB;

  constructor() {
    this.DB = new Map<string, Map<string, number>>();
  }

  private createUser(userId: string, chat: Map<string, number>) {
    return chat.set(userId, 0).get(userId) || 0;
  }

  private getUserPointsFromChat(userId: string, chat: Map<string, number>) {
    return chat.get(userId) ?? this.createUser(userId, chat);
  }

  getChat(id: string) {
    return this.DB.get(id);
  }

  createChat(id: string) {
    const chat = new Map<string, number>();
    this.DB.set(id, chat);
    return chat;
  }

  updatePoints(chatId: string, userId: string, newPoints: number) {
    const chat = this.getChat(chatId) ?? this.createChat(chatId);
    const userPoints = this.getUserPointsFromChat(userId, chat);
    chat.set(userId, userPoints + newPoints);
  }
}

export const DB = new RAMDB();
