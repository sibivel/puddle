import { Application } from "pixi.js";
import { Cell } from "./cell";

export class Game {
  private app: Application;

  constructor() {
    this.app = new Application({ width: 900, height: 900, backgroundColor: 0x093310 });
    const cell = new Cell();
    cell.x = this.app.screen.width / 2;
    cell.y = this.app.screen.height / 2;
    this.app.stage.addChild(cell);
    
  }

  getApp(): Application {
    return this.app;
  }

}