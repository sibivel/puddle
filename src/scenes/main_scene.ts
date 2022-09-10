import { Scene, Cameras, Input, GameObjects, Math as PhaserMath } from "phaser";
import SnakeSprite from 'Images/bacteria.png';
import { Snake } from "../snake";
import { Food } from "../food";
import { CHILD_SPAWN_DISTANCE, FOOD_HEALTH_VALUE, MIN_ACTIVE_FOOD, MIN_ACTIVE_SNAKES, TICK_LENGTH_MS } from "../constants";

export class MainScene extends Scene {

  private snakes: GameObjects.Group = new GameObjects.Group(this);
  private foods: GameObjects.Group = new GameObjects.Group(this);
  private snakeFood: Map<Snake, Set<Food>> = new Map();
  private draggingOrigin?: number[];
  private lastTick = 0;
  constructor() {
    super({});
    Scene.call(this, { key: 'MainScene' });
  }

  preload() {
    this.load.image('snake', SnakeSprite);
  }

  create() {
    this.cameras.main.setBounds(-5000, -5000, 10000, 10000);
    this.cameras.main.setZoom(0.35);
    this.cameras.main.centerOn(1500, 1500);
    // for (let i = 0; i < 100; i++) {
    //   this.spawnRandomSnake();
    // }

    // for (let i = 0; i < 100; i++) {
    //   const food = new Food(this, Math.random() * 3000, Math.random() * 3000);
    //   this.foods.add(food);
    // }

    this.physics.add.overlap(this.snakes, this.foods, (object1: Phaser.Types.Physics.Arcade.GameObjectWithBody, object2: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
      if (object1 instanceof Snake && object2 instanceof Food) {
        this.snakeFood.get(object1).add(object2);
      }
    });

    this.input.on('wheel', (pointer: Input.Pointer, currentlyOver: Array<GameObjects.GameObject>, deltaX: number, deltaY: number, deltaZ: number) => {
      const scrollDelta = -deltaY / 100;
      const zoomSpeed = 0.2;
      const newZoom = this.cameras.main.zoom * (1 + scrollDelta * zoomSpeed);
      this.cameras.main.zoom = newZoom;
    });

    this.input.on('pointerdown', (pointer: Input.Pointer, currentlyOver: Array<GameObjects.GameObject>) => {
      this.draggingOrigin = [pointer.worldX, pointer.worldY];
    });

    this.input.on('pointermove', (pointer: Input.Pointer, currentlyOver: Array<GameObjects.GameObject>) => {
      if (this.draggingOrigin) {
        const sx = pointer.worldX - this.draggingOrigin[0];
        const sy = pointer.worldY - this.draggingOrigin[1];
        this.cameras.main.scrollX -= sx
        this.cameras.main.scrollY -= sy
      }
    });

    this.input.on('pointerup', (pointer: Input.Pointer, currentlyOver: Array<GameObjects.GameObject>) => {
      this.draggingOrigin = undefined;
    });
  }



  update(time: number) {
    const debug = [];
    const tick = time - this.lastTick > TICK_LENGTH_MS;
    if (tick) {
      if (this.snakes.countActive() < MIN_ACTIVE_SNAKES) {
        this.spawnRandomSnake();
      }
      if (this.foods.countActive() < MIN_ACTIVE_FOOD) {
        this.growFood();
      }
    }
    for (const snake of this.snakes.getChildren() as Snake[]) {
      const closestFood = this.getClosestFood(snake);
      if (tick) {
        snake.health -= 1;
      }
      snake.setClosestFood(closestFood);
      snake.makeDecision({ closestFood: ((closestFood) ? { x: closestFood?.x, y: closestFood?.y } : undefined) });
      if (closestFood && PhaserMath.Distance.Between(closestFood.x, closestFood.y, snake.x, snake.y) < 30) {
        snake.health += FOOD_HEALTH_VALUE;
        closestFood.removeFromDisplayList();
        closestFood.destroy();
        this.foods.remove(closestFood);
      }

      const decision = snake.getDecision();
      if (decision[1]) {
        snake.moveForward();
      }
      if (decision[0] && !decision[2]) {
        snake.turnLeft();
      }
      if (!decision[0] && decision[2]) {
        snake.turnRight();
      }
      if (snake.maybeKill()) {
        this.snakeFood.delete(snake);
        this.snakes.remove(snake);
      }
      if (snake.maybeClone()) {
        const childSnake = new Snake(this, snake.x + Math.random() * CHILD_SPAWN_DISTANCE * 2 - CHILD_SPAWN_DISTANCE, snake.y + Math.random() * CHILD_SPAWN_DISTANCE * 2 - CHILD_SPAWN_DISTANCE, Math.random() * 2 * Math.PI, snake);
        snake.health -= childSnake.health;
        this.spawnSnake(childSnake);
      }
    }
    if (tick) {
      debug.push(`Snake count: ${this.snakes.countActive()}`);
      debug.push(`Food count: ${this.foods.countActive()}`);
      this.events.emit('updateDebugText', debug)
      this.lastTick = time;
    }
  }

  private getClosestFood(snake: Snake): Food | undefined {
    let min = -1;
    let minFood = undefined;
    for (const food of this.snakeFood.get(snake)) {
      if (!food.active) {
        this.snakeFood.get(snake).delete(food);
        continue;
      }
      const dist = PhaserMath.Distance.Between(food.x, food.y, snake.x, snake.y);
      if (dist > 2 * Snake.VIEW_DISTANCE) {
        this.snakeFood.get(snake).delete(food);
      } else if (min == -1 || min > dist) {
        min = dist;
        minFood = food;
      }
    }
    return minFood ?? undefined
  }

  private spawnRandomSnake() {
    const snake = new Snake(this, Math.random() * 3000, Math.random() * 3000, Math.random() * 2 * Math.PI);
    this.spawnSnake(snake);
  }

  private spawnSnake(snake: Snake) {
    this.snakes.add(snake);
    this.snakeFood.set(snake, new Set());
  }

  private growFood() {
    const food = new Food(this, Math.random() * 3000, Math.random() * 3000);
    this.foods.add(food);
  }

}