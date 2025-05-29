/* global Phaser */

// Created by: Benjamin Abebe
// Created on: Apr 2025
// This is the Phaser3 game configuration file

// Scene import statements
import SplashScene from './splashScene.js';
import TitleScene from './titleScene.js';
import MenuScene from './menuScene.js';
import GameScene from './gameScene.js';

// Create the new scenes
const splashScene = new SplashScene();
const titleScene = new TitleScene();
const menuScene = new MenuScene();
const gameScene = new GameScene();

/**
 * Start Phaser Game.
 */
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  // Set background color
  backgroundColor: 0x5f6e7a,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
console.log(game);

// Load scenes
// Note: remember any "key" is global and CAN NOT be reused!
game.scene.add('splashScene', splashScene);
game.scene.add('titleScene', titleScene);
game.scene.add('menuScene', menuScene);
game.scene.add('gameScene', gameScene);

// Start the first scene
game.scene.start('splashScene');
