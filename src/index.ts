import "./styles.css";
import { Game } from "phaser";
import { MainScene } from "./scenes/main_scene";
import { StaticScene } from "./scenes/static_scene";
window.addEventListener('load', () => {
  const header = document.createElement('h1');
  // header.innerText = 'Webpack❤️TS Header'

  const body = document.querySelector('body');
  body.prepend(header);
  var config = {
    type: Phaser.AUTO,
    width:  window.visualViewport.width * 0.75,
    height: window.visualViewport.height * 0.9,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      }
    },
    backgroundColor: '#444444',
    scene: [new MainScene(), new StaticScene()],
  };

  var game = new Game(config);
});