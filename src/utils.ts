export function coinflip(): boolean {
  return Math.random() < 0.5;
}

export type Point = Phaser.Types.Math.Vector2Like;
