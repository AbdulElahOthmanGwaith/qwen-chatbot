import { afterEach, describe, expect, it, vi } from "vitest";
import { callQwenModel } from "./dashscope-service";

const messages = [
  { role: "system" as const, content: "You are a helpful assistant." },
  { role: "user" as const, content: "Hello, who are you?" },
];

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DashScope API configuration", () => {
  it("reports a missing API key when the service is called without credentials", async () => {
    vi.stubEnv("DASHSCOPE_API_KEY", "");

    await expect(callQwenModel(messages)).rejects.toThrow(
      "DASHSCOPE_API_KEY environment variable is not set"
    );
  });
});

describe.skipIf(!process.env.DASHSCOPE_API_KEY)("DashScope API integration", () => {
  it("successfully calls the Qwen model when an API key is explicitly provided", async () => {
    const response = await callQwenModel(messages);

    expect(response).toBeDefined();
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });
});
