import { Credit } from "./types";

export const getStickerCreditPoint = (id: Credit) => {
  switch (id) {
    case Credit.PLUS: {
      return 1;
    }
    case Credit.MINUS: {
      return -1;
    }
    default:
      return 0;
  }
};

export const printDB = (chat: Map<string, number>) => {
  return Array.from(chat.entries())
    .filter(([_, value]) => value !== 0)
    .map(([key, value]) => `${key} ${value * 20}`)
    .join("\n");
};
