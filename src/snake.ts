import { GameObjects, Scene, Math as PhaserMath, Physics } from 'phaser';
import { Point } from './utils';
import * as tf from '@tensorflow/tfjs';
import { Food } from './food';
import {
  HAVE_CHILD_HEALTH,
  MUTATION_CHANCE,
  ROTATION_SPEED,
  SNAKE_SPEED,
  STARTING_HEALTH,
  VIEW_DISTANCE,
  WEIGHT_ADJUSTMENT,
} from './constants';
tf.setBackend('cpu');
console.log(tf.getBackend());
export interface DecisionInput {
  closestSnake?: Point; // Not used.
  closestFood?: Point;
}
export class Snake extends GameObjects.Container {
  private static readonly ASYNC_DECISIONS = false;
  public health = STARTING_HEALTH;
  private brain = tf.sequential();
  private decision = [false, false, false];
  private thinking = false;
  thinkingTime = 0;

  private sprite;
  private physicsBody: Physics.Arcade.Body;
  // for color changing only.
  closestFood?: Food;
  constructor(scene: Scene, x: number, y: number, rotation: number, parent?: Snake) {
    super(scene, x, y);
    this.rotation = rotation;
    scene.children.add(this);

    this.sprite = new GameObjects.Sprite(scene, 0, 0, 'snake');
    this.add(this.sprite);
    this.sprite.displayHeight = 20;
    this.sprite.displayWidth = 70;

    scene.physics.add.existing(this);
    this.physicsBody = this.body as Physics.Arcade.Body;
    this.physicsBody.setSize(2 * VIEW_DISTANCE, 2 * VIEW_DISTANCE, true);
    this.physicsBody.setCircle(VIEW_DISTANCE);
    this.physicsBody.onOverlap = true;
    this.physicsBody.onCollide = true;

    this.brain.add(
        tf.layers.dense({ units: 2, inputShape: [2], activation: 'sigmoid', useBias: true })
    );

    if (parent) {
      // Copy parent's brain and adjust slightly:
      const parentWeights = parent.brain.getWeights();
      const childWeights: tf.Tensor[] = [];
      for (const layer of parentWeights) {
        const newLayer = tf.tidy(() => {
          // sometimes change the weights a lot.
          const shouldMutate = tf
              .randomUniform(layer.shape, 0, 1)
              .greaterEqual(tf.scalar(1 - MUTATION_CHANCE));
          const coeffecient = tf
              .ones(layer.shape)
              .add(shouldMutate.mul(tf.randomUniform(layer.shape, -1, 1)));
          // always modify a little bit.
          return layer
              .add(tf.randomUniform(layer.shape, -WEIGHT_ADJUSTMENT, WEIGHT_ADJUSTMENT))
              .mul(coeffecient);
        });
        childWeights.push(newLayer);
        // console.log(layer.dataSync());
        // console.log(newLayer.dataSync());
        // console.log('--');
      }
      this.brain.setWeights(childWeights);
    }
  }

  // returns 3 binary values [turnLeft, moveforward, turnRight]. turnLeft && turnRight -> dont turn.
  public makeDecision(input: DecisionInput): void {
    if (this.thinking) {
      return;
    }
    const startTime = Date.now();
    const foodCoords = this.getRelativeCoords(input.closestFood);
    const prediction = this.brain.predict(
        tf.tensor([foodCoords[0], foodCoords[2]], [1, 2])
    ) as tf.Tensor;
    this.thinking = true;
    // prediction.data().then(result => {
    //   this.decision = [result[0] > 0.5, result[1] > 0.5, result[2] > 0.5];
    //   prediction.dispose();
    //   this.thinking = false;
    //   this.thinkingTime = Date.now() - startTime;
    // });
    const result = prediction.dataSync();
    const rotValue = result[0] - 0.5;
    // console.log(rotValue);
    this.decision = [rotValue < -0.1, result[1] > 0.5, rotValue > 0.1];
    prediction.dispose();
    this.thinking = false;
    this.thinkingTime = Date.now() - startTime;
  }

  public getDecision(): boolean[] {
    return this.decision;
  }

  public moveForward() {
    this.x += Math.cos(this.rotation) * SNAKE_SPEED;
    this.y += Math.sin(this.rotation) * SNAKE_SPEED;
  }

  public turnLeft() {
    this.rotation -= ROTATION_SPEED;
  }

  public turnRight() {
    this.rotation += ROTATION_SPEED;
  }

  public maybeKill(): boolean {
    if (this.health > 0) {
      return false;
    }
    this.brain.dispose();
    this.destroy();
    if (this.closestFood) {
      this.closestFood.fillColor = 0x00ff00;
    }
    return true;
  }

  public maybeClone(): boolean {
    return this.health >= HAVE_CHILD_HEALTH;
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

  getCenter() {
    return new Phaser.Math.Vector2(this.x, this.y);
  }

  setClosestFood(food: Food) {
    if (this.closestFood) {
      this.closestFood.fillColor = 0x00ff00;
    }
    if (food) {
      food.fillColor = 0xff0000;
    }
    this.closestFood = food;
  }
}
