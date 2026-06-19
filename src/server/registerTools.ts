import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolContextFactoryDependencies } from "./toolContext.js";
import { RecommendationToolInputSchema } from "../tools/schemas.js";
import { todayWhatToDoHandler } from "../tools/todayWhatToDo.js";
import { tomorrowWhatToDoHandler } from "../tools/tomorrowWhatToDo.js";
import { weekendWhatToDoHandler } from "../tools/weekendWhatToDo.js";

export interface PublicToolDefinition {
  readonly name: "today_what_to_do" | "tomorrow_what_to_do" | "weekend_what_to_do";
  readonly title: string;
  readonly description: string;
}

export const PUBLIC_TOOL_DEFINITIONS: readonly PublicToolDefinition[] = [
  {
    name: "today_what_to_do",
    title: "오늘 뭐하지?",
    description:
      "현재 위치와 즉시성을 기준으로 오늘 바로 실행 가능한 서울 활동 추천을 준비합니다."
  },
  {
    name: "tomorrow_what_to_do",
    title: "내일 뭐하지?",
    description:
      "내일 날씨와 이동 부담을 기준으로 하루 계획형 서울 활동 추천을 준비합니다."
  },
  {
    name: "weekend_what_to_do",
    title: "이번 주말 뭐하지?",
    description:
      "주말 예보와 무료 여부를 더 넓은 서울 탐색 범위에 반영한 추천을 준비합니다."
  }
];

export function registerTools(
  server: McpServer,
  dependencies: ToolContextFactoryDependencies
): readonly PublicToolDefinition[] {
  server.registerTool(
    "today_what_to_do",
    {
      title: PUBLIC_TOOL_DEFINITIONS[0]!.title,
      description: PUBLIC_TOOL_DEFINITIONS[0]!.description,
      inputSchema: RecommendationToolInputSchema
    },
    (input) => todayWhatToDoHandler(input, dependencies)
  );

  server.registerTool(
    "tomorrow_what_to_do",
    {
      title: PUBLIC_TOOL_DEFINITIONS[1]!.title,
      description: PUBLIC_TOOL_DEFINITIONS[1]!.description,
      inputSchema: RecommendationToolInputSchema
    },
    (input) => tomorrowWhatToDoHandler(input, dependencies)
  );

  server.registerTool(
    "weekend_what_to_do",
    {
      title: PUBLIC_TOOL_DEFINITIONS[2]!.title,
      description: PUBLIC_TOOL_DEFINITIONS[2]!.description,
      inputSchema: RecommendationToolInputSchema
    },
    (input) => weekendWhatToDoHandler(input, dependencies)
  );

  return PUBLIC_TOOL_DEFINITIONS;
}
