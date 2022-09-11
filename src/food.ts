import { GameObjects } from 'phaser';

export class Food extends GameObjects.Arc {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 5, 0, 360, false, 0x00ff00);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
