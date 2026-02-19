import { describe, expect, it } from "vitest";
import { callQwenModel } from "./dashscope-service";

describe("DashScope API Integration", () => {
  it("should successfully call Qwen model with valid API key", async () => {
    const messages = [
      { role: "system" as const, content: "You are a helpful assistant." },
      { role: "user" as const, content: "Hello, who are you?" },
    ];

    const response = await callQwenModel(messages);

    expect(response).toBeDefined();
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });
});
