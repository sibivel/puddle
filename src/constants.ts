export const MAP_SIZE = 3000;

// Number of snakes that must be alive. If less, new snakes will be randomly spawned.
export const MIN_ACTIVE_SNAKES = 30;

// Number of food that must be active. If less, new food will be randomly spawned.
export const MIN_ACTIVE_FOOD = 200;

// Amount of health that food adds.
export const FOOD_HEALTH_VALUE = 50;

// Time it takes for snake health to drop.
export const TICK_LENGTH_MS = 100;

export const CHILD_SPAWN_DISTANCE = 50;

/** Snake Parameters **/
// Distance snakes can see food.
export const VIEW_DISTANCE = 1000;
export const STARTING_HEALTH = 100;
// Distance moved per frame.
export const SNAKE_SPEED = 1.5;
// Radians snake can turn per frame.
export const ROTATION_SPEED = 0.04;
// Health needed for a snake to have a child.
export const HAVE_CHILD_HEALTH = 300;

/** AI Parameters used for creating offspring neural network **/
// Chance that any weight should be completely randomized.
export const MUTATION_CHANCE = 0.01;
// Max amount any weight is normally adjusted in offspring.
export const WEIGHT_ADJUSTMENT = 0.05;
