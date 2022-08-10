import { Container, Sprite, Texture } from "pixi.js";
import BacteriaImage from 'Images/bacteria.png';
export class Cell extends Container {
  constructor() {
    super();
    const texture = Texture.from(BacteriaImage);
    const bunny = new Sprite(texture);
    this.addChild(bunny);
  }

}