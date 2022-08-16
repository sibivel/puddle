import "./styles.css";
import { Game } from "phaser";
import { MainScene } from "./scenes/main_scene";
window.addEventListener('load', () => {
  const header = document.createElement('h1');
  // header.innerText = 'Webpack❤️TS Header'

  const body = document.querySelector('body');
  body.prepend(header);
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: new MainScene(),
  };

  var game = new Game(config);
});

// Create a simple model.
// const model = tf.sequential();
// console.log(model);
// model.add(tf.layers.dense({units: 1, inputShape: [1]}));
// console.log(model.getWeights().toString());
// console.log(model);

// // Prepare the model for training: Specify the loss and the optimizer.
// model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// // Generate some synthetic data for training. (y = 2x - 1)
// const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
// const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

// // Train the model using the data.
// model.fit(xs, ys, {epochs: 250});
// console.log(model.predict(tf.tensor2d([20], [1, 1])).toString());