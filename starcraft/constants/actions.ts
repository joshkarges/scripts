export type Action = {
  // eventKey points to
  // - a condition that needs to be satisfied in order to take the action
  // - a start mutation for what happens to the game state when the action is started
  // - an end mutation for what happens to the game state when the action is ended
  // - a timeDelta for how long the action takes
  eventKey: string;
  startTime: number;
  isStarted?: boolean;
};

export type ActionQueue = {
  size: number;
  actions: Action[];
};