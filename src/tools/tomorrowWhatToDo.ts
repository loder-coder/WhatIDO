import type { ToolContextFactoryDependencies } from "../server/toolContext.js";
import type { RecommendationToolInput } from "./schemas.js";
import { runRecommendationTool } from "./recommendationToolRunner.js";

export async function tomorrowWhatToDoHandler(
  input: RecommendationToolInput,
  dependencies: ToolContextFactoryDependencies
) {
  return runRecommendationTool("tomorrow", input, dependencies);
}
