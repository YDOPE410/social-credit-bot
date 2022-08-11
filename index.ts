import { Telegraf } from "telegraf";
import "dotenv/config";

const plusCreditStickerId = "AQADAgADf3BGHHI";
const minusCreditStickerId = "AQADAwADf3BGHHI";

const db: Record<string, Map<string, number>> = {};

const getStickerCredit = (id: string) => {
  switch (id) {
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

const token = process.env.BOT_TOKEN;

if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);

bot.on("sticker", (ctx) => {
  const {
    reply_to_message,
    sticker: { thumb: { file_unique_id = "" } = {} },
    from: { username },
    chat: { id },
  } = ctx.update.message;
  if (reply_to_message) {
    const { from: { username: usernameFrom } = {} } = reply_to_message;
    if (usernameFrom !== username) {
      const point = getStickerCredit(file_unique_id);

      if (usernameFrom) {
        if (db[id]) {
          db[id].set(usernameFrom, (db[id].get(usernameFrom) || 0) + point);
        } else {
          db[id] = new Map([[usernameFrom, point]]);
        }
      }
    }
  }
});

bot.hears("/rating", (ctx) => {
  const {
    update: {
      message: {
        chat: { id },
      },
    },
  } = ctx;

  const map = db[id] || new Map();

  const result = Array.from(map.entries())
    .filter(([key, value]) => key !== "SocialTrustCreditBot" && value !== 0)
    .map(([key, value]) => `${key} ${value * 20}`)
    .join("\n");

  return ctx.reply(result.length ? result : "Perfect Equality");
});

bot.launch().then(() => console.log('Bot started'));


