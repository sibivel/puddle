# Darwin's Puddle

This is a browser based experiment trying to simulate natural selection. Snakes spawn with random neural networks. As snakes survive and reproduce, the neural networks are randomly adjusted. Snakes with effective neural networks should survive while others die.

---

## Game Mechanics

The game starts with some Snakes and randomly spawned food. The snakes can move forward and turn. Each snake uses a simple neural network (using TensorFlowJS) to make decisions.

Neural networks get the angle to the closest food as input, and output a decision of which way to turn and whether to move forward.

Any food that can be seen by a snake turns red.

Snakes lose health as time goes on. Eating food regains health. If a snake reaches enough health, it spawns an offspring.

New snakes are spawned with random weights in their neural networks. When snakes have offspring, the offspring's weights copied from the parent with random mutations.

If the number of live snakes drops too low, new snakes are spawned randomly.

---

Develop locally using `yarn start` and going to `localhost:3000`

To push to github pages, run `yarn run publish`. (Configure the page to read from the gh-pages branch on github.)

https://sibivel.github.io/puddle/
