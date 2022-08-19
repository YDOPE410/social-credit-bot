import "dotenv/config";
import { SocialCreditBot } from "./SocialCreditBot";

const token = process.env.BOT_TOKEN;

if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

export const SocialBot = new SocialCreditBot(token);
