import { GameObjects, Scene } from "phaser";

export class StaticScene extends Scene {
  debugText: GameObjects.Text;
  constructor() {
    super({});
    Scene.call(this, { key: 'StaticScene', active: true });

  }
  create() {
    this.debugText = this.add.text(10, 30, '', { font: '24px Courier', color: '#ffffff' });
    this.scene.get('MainScene').events.on('updateDebugText', function (debug: []) {
      this.debugText.setText(debug);
    }, this);
  }
}