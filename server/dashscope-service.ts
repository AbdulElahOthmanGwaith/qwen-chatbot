import axios from "axios";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DashScopeResponse {
  status_code: number;
  request_id: string;
  code?: string;
  message?: string;
  output?: {
    choices: Array<{
      finish_reason: string;
      message: {
        role: string;
        content: string;
      };
    }>;
  };
}

const DASHSCOPE_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const API_KEY = process.env.DASHSCOPE_API_KEY;

if (!API_KEY) {
  throw new Error("DASHSCOPE_API_KEY environment variable is not set");
}

export async function callQwenModel(messages: Message[]): Promise<string> {
  try {
    const response = await axios.post<DashScopeResponse>(
      DASHSCOPE_API_URL,
      {
        model: "qwen-plus",
        messages: messages,
        result_format: "message",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status_code === 200 && response.data.output?.choices && response.data.output.choices.length > 0) {
      return response.data.output.choices[0].message.content;
    } else {
      throw new Error(
        `DashScope API error: ${response.data.message || "Unknown error"}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `DashScope API call failed: ${error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
}
