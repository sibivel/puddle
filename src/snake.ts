import { GameObjects, Scene } from "phaser";
import { coinflip } from "./utils";
export class Snake extends GameObjects.Sprite {

  private speed = 1;
  private rotationSpeed = 0.02;
  private decision = [coinflip(), coinflip(), coinflip()]
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'snake');
    this.displayHeight = 20;
    this.displayWidth = 70;
    this.rotation = Math.random() * 2 * Math.PI;
  }

  // returns 3 binary values [turnLeft, moveforward, turnRight]. turnLeft && turnRight -> dont turn.
  makeDecision(): boolean[] {
    return this.decision;
  }

  moveForward() {
    // console.log(this.rotation);
    this.x += Math.cos(this.rotation) * this.speed;
    this.y += Math.sin(this.rotation) * this.speed;
    // console.log(`${ratio}`);
  }

  turnLeft() {
    this.rotation -= this.rotationSpeed;
  }

  turnRight() {
    this.rotation += this.rotationSpeed;
  }

}           