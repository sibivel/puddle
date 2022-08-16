import { Scene, Cameras, Input, GameObjects, Math as PhaserMath} from "phaser";
import SnakeSprite from 'Images/bacteria.png';
import { Snake } from "../snake";
import { Point } from "../utils";

export class MainScene extends Scene {

  private snakes: Snake[] = [];
  private draggingOrigin?: number[];
  constructor() {
    super({});
  }

  preload() {
    this.cameras.main.setBackgroundColor("#333333");
    this.load.image('snake', SnakeSprite);
  }

  create() {
    this.cameras.main.setBounds(-16000, -12000, 32000, 24000);
    this.cameras.main.setZoom(1);
    // this.cameras.main.centerOn(0, 0);
    for (let i = 0; i < 100; i++) {
      this.snakes.push(new Snake(this, Math.random() * this.sys.game.canvas.width, Math.random() * this.sys.game.canvas.height, Math.random() * 2 * Math.PI));
    }

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

  update(time: number, delta: number) {
    // console.log("update");
    for (const snake of this.snakes) {

      const decision = snake.makeDecision({closestSnake: this.getClosestSnake(snake)});
      if (decision[1]) {
        snake.moveForward();
      }
      if (decision[0] && !decision[2]) {
        snake.turnLeft();
      }
      if (!decision[0] && decision[2]) {
        snake.turnRight();
      }
    }
  }

  private getClosestSnake(snake: Snake): Point | undefined {
    let min = -1;
    let minSnake = undefined;
    for (const oSnake of this.snakes) {
      if (oSnake !== snake) {
        const dist = PhaserMath.Distance.Between(oSnake.x, oSnake.y, snake.x, snake.y);
        if (min == -1 || min < dist) {
          min = dist;
          minSnake = oSnake;
        }
      }
    }
    return {x: minSnake.x, y: minSnake.y};

  }

}