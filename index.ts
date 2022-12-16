import { SocialBot } from "./src/bootstrap.js";

const bot = SocialBot.getBot();

export default async function (context: any, req: any) {
  return bot.handleUpdate(req.body, context.res);
}
