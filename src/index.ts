import './styles.css';
import { Game, Scale } from 'phaser';
import { MainScene } from './scenes/main_scene';
import { StaticScene } from './scenes/static_scene';
window.addEventListener('load', () => {
  const header = document.createElement('h1');
  // header.innerText = 'Webpack❤️TS Header'

  const body = document.querySelector('body');
  body.prepend(header);
  const config: Phaser.Types.Core.GameConfig = {
    scale: { mode: Scale.ScaleModes.RESIZE },
    type: Phaser.AUTO,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    backgroundColor: '#444444',
    scene: [new MainScene(), new StaticScene()],
    parent: document.querySelector('.gameArea') as HTMLElement,
  };
  new Game(config);
  const pageLink = document.createElement('a');
  const linkText = 'https://github.com/sibivel/puddle';
  pageLink.append(document.createTextNode(linkText));
  pageLink.href = linkText;
  pageLink.style.fontFamily = 'consolas';
  pageLink.style.fontSize = '24px';
  pageLink.style.display = 'block';
  document.querySelector('.textArea').append(pageLink);
});
