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
      "오늘 바로 실행 가능한 서울 활동을 추천합니다. 현재 또는 기준 위치, 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도를 반영하며 예약 필요 활동은 감점합니다. 예: {\"query\":\"오늘 뭐하지?\",\"location\":{\"district\":\"송파구\"},\"result_limit\":3}"
  },
  {
    name: "tomorrow_what_to_do",
    title: "내일 뭐하지?",
    description:
      "내일 하루 또는 반나절 계획에 맞는 서울 활동을 추천합니다. 내일 예보, 시간대 적합성, 이동 부담, 무료 여부, 예약 리스크를 반영합니다. 예: {\"query\":\"내일 아이랑 뭐하지?\",\"preferred_time_of_day\":\"afternoon\"}"
  },
  {
    name: "weekend_what_to_do",
    title: "이번 주말 뭐하지?",
    description:
      "다가오는 토요일/일요일 주말 활동을 추천합니다. 서울 전역 후보를 허용하고 날씨 비교, 무료 여부, 혼잡도, Plan B 필요성을 반영합니다. 예: {\"query\":\"이번 주말 무료 데이트 뭐하지?\"}"
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
