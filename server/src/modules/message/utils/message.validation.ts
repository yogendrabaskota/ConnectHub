import z from "zod";

export const sendMessageSchema = z.object({
  //   sender: z.string().min(1, "Sender ID is required"),
  receiver: z.string().min(1, "Receiver ID is required"),
  content: z.string().min(1, "Message content cannot be empty"),
  // messageType: z.enum(["text", "image", "file"]).optional(), // Optional field for message type
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
