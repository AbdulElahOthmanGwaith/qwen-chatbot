import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createConversation,
  getConversations,
  getConversationById,
  addMessage,
  getMessages,
  updateConversationTitle,
} from "../db";
import { callQwenModel } from "../dashscope-service";

export const chatRouter = router({
  // Create a new conversation
  createConversation: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await createConversation(
          ctx.user.id,
          input.title || "New Conversation"
        );
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create conversation",
        });
      }
    }),

  // Get all conversations for the current user
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      const conversations = await getConversations(ctx.user.id);
      return conversations;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch conversations",
      });
    }
  }),

  // Get a specific conversation with its messages
  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const conversation = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conversation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }

        const messages = await getMessages(input.conversationId);
        return { conversation, messages };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch conversation",
        });
      }
    }),

  // Send a message and get AI response
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        let conversationId = input.conversationId;

        // Create a new conversation if not provided
        if (!conversationId) {
          const result = await createConversation(ctx.user.id, "New Chat");
          conversationId = result?.id || 1;
        }

        // Verify the conversation belongs to the user
        const conversation = await getConversationById(
          conversationId,
          ctx.user.id
        );
        if (!conversation) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this conversation",
          });
        }

        // Add user message to database
        await addMessage(conversationId, "user", input.message);

        // Get conversation history for context
        const messages = await getMessages(conversationId);
        const conversationHistory = messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

        // Call Qwen model
        const aiResponse = await callQwenModel([
          { role: "system", content: "You are a helpful assistant." },
          ...conversationHistory,
        ]);

        // Add AI response to database
        await addMessage(conversationId, "assistant", aiResponse);

        // Update conversation title if it's the first message
        if (messages.length === 0) {
          const title = input.message.substring(0, 50);
          await updateConversationTitle(conversationId, title);
        }

        return {
          conversationId,
          userMessage: input.message,
          aiResponse,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
        });
      }
    }),

  // Get messages for a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const conversation = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conversation) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this conversation",
          });
        }

        const messages = await getMessages(input.conversationId);
        return messages;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch messages",
        });
      }
    }),

  // Delete a conversation
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const conversation = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conversation) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this conversation",
          });
        }

        // TODO: Implement delete functionality in db.ts
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete conversation",
        });
      }
    }),
});
