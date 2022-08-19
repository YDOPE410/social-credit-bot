import fs from "fs";
import { Telegraf } from "telegraf";
import { getStickerCreditPoint, printDB } from "./helpers.js";
import {
  getChatId,
  getFromUsername,
  getReplyFromUsername,
  getStickerId,
  getMessageId,
} from "./value-getters.js";
import { BOT_NAME, BOT_REPLICS } from "./constants.js";
import { DB } from "../MONGODB/index.js";

export class SocialCreditBot {
  private telegramClient;

  constructor(token: string) {
    this.telegramClient = new Telegraf(token);
  }

  private addCreditStickerAction() {
    this.telegramClient.on("sticker", async (ctx) => {
      const messageId = getMessageId(ctx);
      const messageFrom = getFromUsername(ctx);
      const messageFor = getReplyFromUsername(ctx);
      const stickerId = getStickerId(ctx);
      const chatId = getChatId(ctx);
      const stickerPoint = getStickerCreditPoint(stickerId);
      if (stickerPoint) {
        if (messageFor === BOT_NAME) {
          if (stickerPoint === -1) {
            DB.updatePoints(chatId, messageFrom, -1);
            ctx.reply(BOT_REPLICS.you_will_suffer(messageFrom));
            ctx.replyWithSticker(
              {
                source: fs.readFileSync("./dist/static/sticker.webp"),
              },
              { reply_to_message_id: messageId }
            );
          }
          return;
        }
        if (messageFor === messageFrom) {
          return ctx.reply(BOT_REPLICS.you_like_yourself(messageFrom));
        }
        await DB.updatePoints(chatId, messageFor, stickerPoint);
      }
    });
  }

  private addRatingCommand() {
    this.telegramClient.command("rating", async (ctx) => {
      const chatId = getChatId(ctx);
      const chatDoc = await DB.getChat(chatId);
      const chatMap =
        chatDoc?.chat.reduce((acc, { username, points }) => {
          acc.set(username, points);
          return acc;
        }, new Map()) ?? new Map();
      const newMessage = printDB(chatMap);
      ctx.reply(newMessage.length ? newMessage : BOT_REPLICS.perfect_equality);
    });
  }

  startBot() {
    this.addCreditStickerAction();
    this.addRatingCommand();
    this.telegramClient.launch().then(() => console.log("Bot started"));
  }
}
