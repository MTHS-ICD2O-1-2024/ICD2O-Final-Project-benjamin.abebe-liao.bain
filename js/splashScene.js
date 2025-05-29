/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Phaser3 game configuration file

// creating a Splash Scene. 
class SplashScene extends Phaser.Scene{
  constructor() {
    super({ key: 'splashScene' })

    this.splashSceneBackgroundImage = null
  }

  init(data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  // loading image
  preload() {
    // console.log('Splash Scene')

  }

  create(data) {
    this.splashSceneBackgroundImage = this.add.sprite(0, 0, 'splashSceneBackground')
    this.splashSceneBackgroundImage.x = 1920 / 2
    this.splashSceneBackgroundImage.y = 1080 / 2
  }

  update(time, delta) {
    if (time > 2000) {
      this.scene.switch('titleScene')
    }
  }
}

export default SplashScene