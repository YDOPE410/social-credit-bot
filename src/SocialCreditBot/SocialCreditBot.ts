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
import { DB } from "../RAMDB/index.js";

export class SocialCreditBot {
  private telegramClient;

  constructor(token: string) {
    this.telegramClient = new Telegraf(token);
  }

  private addCreditStickerAction() {
    this.telegramClient.on("sticker", (ctx) => {
      const messageId = getMessageId(ctx);
      const messageFrom = getFromUsername(ctx);
      const messageFor = getReplyFromUsername(ctx);
      const stickerId = getStickerId(ctx);
      const chatId = getChatId(ctx);
      const stickerPoint = getStickerCreditPoint(stickerId);
      if (stickerPoint) {
        if (messageFor === BOT_NAME && stickerPoint === -1) {
          DB.updatePoints(chatId, messageFrom, -1);
          ctx.reply(BOT_REPLICS.you_will_suffer(messageFrom));
          ctx.replyWithSticker(
            {
              source: fs.readFileSync("./dist/static/sticker.webp"),
            },
            { reply_to_message_id: messageId }
          );
          return;
        }
        if (messageFor === messageFrom) {
          return ctx.reply(BOT_REPLICS.you_like_yourself(messageFrom));
        }
        DB.updatePoints(chatId, messageFrom, stickerPoint);
      }
    });
  }

  private addRatingCommand() {
    this.telegramClient.command("rating", (ctx) => {
      const chatId = getChatId(ctx);
      const chat = DB.getChat(chatId) ?? DB.createChat(chatId);
      const newMessage = printDB(chat);
      ctx.reply(newMessage.length ? newMessage : BOT_REPLICS.perfect_equality);
    });
  }

  startBot() {
    this.addCreditStickerAction();
    this.addRatingCommand();
    this.telegramClient.launch().then(() => console.log("Bot started"));
  }
}
