import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RecommendationToolInputSchema } from "../tools/schemas.js";
import { todayWhatToDoHandler } from "../tools/todayWhatToDo.js";
import { tomorrowWhatToDoHandler } from "../tools/tomorrowWhatToDo.js";
import { weekendWhatToDoHandler } from "../tools/weekendWhatToDo.js";
import type { ToolContextFactoryDependencies } from "./toolContext.js";

const READ_ONLY_TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: true,
  idempotentHint: true
} as const;

const LOCATION_REQUIREMENT =
  " If the user's location (district/neighborhood or coordinates) is not yet known from the conversation, you MUST ask the user for their specific location before calling this tool.";

export interface PublicToolDefinition {
  readonly name: "today_what_to_do" | "tomorrow_what_to_do" | "weekend_what_to_do";
  readonly title: string;
  readonly description: string;
}

export const PUBLIC_TOOL_DEFINITIONS: readonly PublicToolDefinition[] = [
  {
    name: "today_what_to_do",
    title: "Today: What should I do? (오늘 뭐하지?)",
    description:
      "WhatIDO(뭐하지?) recommends Seoul activities that can be done today, prioritizing current availability, weather, discomfort index, travel distance, cost, and congestion." + LOCATION_REQUIREMENT
  },
  {
    name: "tomorrow_what_to_do",
    title: "Tomorrow: What should I do? (내일 뭐하지?)",
    description:
      "WhatIDO(뭐하지?) recommends Seoul activities for tomorrow using the forecast, requested time of day, operating availability, travel distance, cost, reservation requirements, and congestion." + LOCATION_REQUIREMENT
  },
  {
    name: "weekend_what_to_do",
    title: "Weekend: What should I do? (이번 주말 뭐하지?)",
    description:
      "WhatIDO(뭐하지?) recommends Seoul weekend activities by comparing Saturday and Sunday weather, prioritizing free options, and factoring in congestion, distance, and indoor Plan B suitability." + LOCATION_REQUIREMENT
  }
];

function registerRecommendationTool(
  server: McpServer,
  definition: PublicToolDefinition,
  handler: typeof todayWhatToDoHandler | typeof tomorrowWhatToDoHandler | typeof weekendWhatToDoHandler,
  dependencies: ToolContextFactoryDependencies
): void {
  server.registerTool(
    definition.name,
    {
      title: definition.title,
      description: definition.description,
      inputSchema: RecommendationToolInputSchema,
      annotations: {
        title: definition.title,
        ...READ_ONLY_TOOL_ANNOTATIONS
      }
    },
    (input) => handler(input, dependencies)
  );
}

export function registerTools(
  server: McpServer,
  dependencies: ToolContextFactoryDependencies
): readonly PublicToolDefinition[] {
  registerRecommendationTool(server, PUBLIC_TOOL_DEFINITIONS[0]!, todayWhatToDoHandler, dependencies);
  registerRecommendationTool(server, PUBLIC_TOOL_DEFINITIONS[1]!, tomorrowWhatToDoHandler, dependencies);
  registerRecommendationTool(server, PUBLIC_TOOL_DEFINITIONS[2]!, weekendWhatToDoHandler, dependencies);
  return PUBLIC_TOOL_DEFINITIONS;
}
