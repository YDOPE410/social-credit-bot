require("dotenv").config();
const multiplier = 20;

const express = require("express");

const db = {};

const TeleBot = require("telebot");

const bot = new TeleBot(process.env.BOT_TOKEN);

const plusCreditStickerId = "AQADAgADf3BGHHI";
const minusCreditStickerId = "AQADAwADf3BGHHI";

const checkIsMessageReply = ({ reply_to_message }) => !!reply_to_message;

const checkIsReplyAuthorTheSame = ({ reply_to_message, from }) =>
  reply_to_message.from.username === from.username;

const getStickerCredit = ({
  sticker: {
    thumb: { file_unique_id },
  },
}) => {
  switch (file_unique_id) {
    case plusCreditStickerId: {
      return 1;
    }
    case minusCreditStickerId: {
      return -1;
    }
    default:
      return 0;
  }
};

const applyCredit = (chatId, username, credit) => {
  const chatStore = db[chatId] ?? new Map();
  const value = chatStore.get(username) ?? 0;
  chatStore.set(username, value + credit);
  db[chatId] = chatStore;
};

const dbToString = (db = new Map()) => {
  const result = [];

  for (let [key, value] of db) {
    result.push(`${key}:${value * multiplier}`);
  }
  return result.join("\n");
};

bot.on("/rating", (msg) => {
  return bot.sendMessage(
    msg.chat.id,
    dbToString(db[msg.chat.id])
      ? dbToString(db[msg.chat.id])
      : "Пока что все равны (не умею читать сообщения до добавления)"
  );
});

bot.on("sticker", (msg) => {
  if (checkIsMessageReply(msg) && !checkIsReplyAuthorTheSame(msg)) {
    applyCredit(
      msg.chat.id,
      msg.reply_to_message.from.username,
      getStickerCredit(msg)
    );
  }
});

bot.start();

express()
  .get("/", (req, res) => res.json({ page: "index" }))
  .listen(process.env.PORT || 5000);
