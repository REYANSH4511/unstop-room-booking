import { messages } from "./messages.js";

/**
 * Get a message by its code ID.
 * Falls back to the code itself if the message is not found.
 */
export const messageData = (msgId: string): string => {
  return messages[msgId] || msgId;
};
