import { Scene } from "phaser";
import SnakeSprite from 'Images/bacteria.png';
import { Snake } from "../snake";

export class MainScene extends Scene {
  
  private snakes: Snake[] = [];

  constructor() {
    super({});
  }

  preload() {
    this.cameras.main.setBackgroundColor("#333333");
    this.load.image('snake', SnakeSprite);
  }

  create() {
    for (let i = 0; i < 100; i++) {
      this.snakes.push(new Snake(this, Math.random() * this.sys.game.canvas.width, Math.random() * this.sys.game.canvas.height));
    }
    this.snakes.forEach(snake => this.children.add(snake));

  }

  update(time: number, delta: number) {
    // console.log("update");
    for (const snake of this.snakes) {
      const decision = snake.makeDecision();
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
  
}