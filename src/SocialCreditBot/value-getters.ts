export const getStickerId = (ctx: any) =>
  ctx.update?.message?.sticker?.thumb?.file_unique_id;

export const getMessageId = (ctx: any) => ctx.update?.message?.message_id;

export const getChatId = (ctx: any) => ctx.update?.message?.chat?.id;

export const getFromUsername = (ctx: any) =>
  ctx.update?.message?.from?.username;

export const getReplyFromUsername = (ctx: any) =>
  ctx.update?.message?.reply_to_message?.from?.username;
