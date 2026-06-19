import type { ToolContextFactoryDependencies } from "../server/toolContext.js";
import { createToolContext } from "../server/toolContext.js";
import type { RecommendationToolInput } from "./schemas.js";
import {
  createPlaceholderResponse,
  toMcpTextResponse
} from "./placeholderResponse.js";

export async function tomorrowWhatToDoHandler(
  input: RecommendationToolInput,
  dependencies: ToolContextFactoryDependencies
) {
  const context = createToolContext(dependencies);
  context.logger.info({ tool: "tomorrow_what_to_do" }, "MCP tool invoked");

  return toMcpTextResponse(
    createPlaceholderResponse({
      intent: "tomorrow_what_to_do",
      input,
      requestId: context.requestId
    })
  );
}
