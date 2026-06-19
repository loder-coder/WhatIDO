export interface ServiceContainer {
  readonly phase: "foundation";
}

export function createServiceContainer(): ServiceContainer {
  return {
    phase: "foundation"
  };
}
