import "./styles.css";
import { Game } from "./game";
import Bibo from './bacteria.png';
window.addEventListener('load', () => {
  const header = document.createElement('h1');
  // header.innerText = 'Webpack❤️TS Header'

  const body = document.querySelector('body');
  body.prepend(header);

  const app = new Game().getApp();
  document.body.appendChild(app.view)
})