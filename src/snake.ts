import { GameObjects, Scene } from "phaser";
import { coinflip } from "./utils";
export class Snake extends GameObjects.Container {

  private speed = 1;
  private rotationSpeed = 0.02;
  private decision = [coinflip(), coinflip(), coinflip()]
  sprite;
  constructor(scene: Scene, x: number, y: number, rotation: number) {
    super(scene, x, y);
    this.rotation = rotation;
    scene.children.add(this);
    
    this.sprite = new GameObjects.Sprite(scene, 0, 0, 'snake');
    this.add(this.sprite);
    this.sprite.displayHeight = 20;
    this.sprite.displayWidth = 70;

    const arc = scene.add.arc(0, 0, 200, 0, 360, false);
    arc.setStrokeStyle(5, 0x00ff00, 0.1);
    // console.log(arc);
    arc
    this.add(arc);

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