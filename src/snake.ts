import { GameObjects, Scene, Math as PhaserMath } from "phaser";
import { coinflip, Point } from "./utils";
import * as tf from "@tensorflow/tfjs";

export interface DecisionInput {
  closestSnake?: Point;
  closestFood?: Point;
}
const VIEW_DISTANCE = 300;
export class Snake extends GameObjects.Container {

  private speed = 1;
  private rotationSpeed = 0.02;
  private brain = tf.sequential();
  private sprite;
  constructor(scene: Scene, x: number, y: number, rotation: number) {
    super(scene, x, y);
    this.rotation = rotation;
    scene.children.add(this);

    this.sprite = new GameObjects.Sprite(scene, 0, 0, 'snake');
    this.add(this.sprite);
    this.sprite.displayHeight = 20;
    this.sprite.displayWidth = 70;

    // const arc = scene.add.arc(0, 0, 200, 0, 360, false);
    // arc.setStrokeStyle(5, 0x00ff00, 0.1);
    // // console.log(arc);
    // this.add(arc);
    this.brain.add(tf.layers.dense({ units: 3, inputShape: [7] }));
  }

  // returns 3 binary values [turnLeft, moveforward, turnRight]. turnLeft && turnRight -> dont turn.
  makeDecision(input: DecisionInput): boolean[] {
    const otherSnakeCoords = this.getRelativeCoords(input.closestSnake);
    const foodCoords = this.getRelativeCoords(input.closestFood);
    const prediction = (this.brain.predict(tf.tensor([
      otherSnakeCoords[0],
      otherSnakeCoords[1],
      otherSnakeCoords[2],
      foodCoords[0],
      foodCoords[1],
      foodCoords[2],
      this.rotation
    ], [1,7])) as tf.Tensor).dataSync();
    return [prediction[0] > 0.5, prediction[1] > 0.5, prediction[2] > 0.5];
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

  private getRelativeCoords(point: Point): number[] {
    if (!point) {
      return [0, 0, 0];
    }
    const dist = PhaserMath.Distance.Between(point.x, point.y, this.x, this.y);
    if (dist > VIEW_DISTANCE) {
      return [0, 0, 0];
    }
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return [Math.atan(dy / dx), dist, 1];
  }

}           