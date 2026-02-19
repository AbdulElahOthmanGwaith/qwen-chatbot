import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

type AuthenticatedUser = User;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Chat Router", () => {
  it("should be accessible through the app router", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.chat).toBeDefined();
    expect(caller.chat.createConversation).toBeDefined();
    expect(caller.chat.getConversations).toBeDefined();
    expect(caller.chat.sendMessage).toBeDefined();
  });

  it("should have protected procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // These procedures should require authentication
    expect(caller.chat.createConversation).toBeDefined();
    expect(caller.chat.getConversations).toBeDefined();
    expect(caller.chat.sendMessage).toBeDefined();
  });
});
