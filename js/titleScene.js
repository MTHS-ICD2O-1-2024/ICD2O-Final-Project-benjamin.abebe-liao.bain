/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Phaser3 Title Scene

/**
 * This class is the Title Scene.
 */
class TitleScene extends Phaser.Scene {
  /**
   * This method is the constructor.
   */
  constructor () {
    super({ key: 'titleScene' })
    this.titleSceneBackgroundImage = null
    this.titleSceneText = null
    this.titleSceneTextStyle = {
      font: '200px Times',
      fill: '#fde4b9',
      align: 'center'
    }
  }

  /**
   * This method is called by the Scene Manager before preload() and create().
   * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
   */
  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  /**
   * Use it to load assets.
   */
  preload () {
    console.log('Title Scene')
    // this.load.image('titleSceneBackground', 'assets/aliens_screen_image.jpg')
  }

  /**
   * Use it to create your game objects.
   * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
   */
  create (data) {
    this.titleSceneBackgroundImage = this.add
      .sprite(1920 / 2, 1080 / 2, 'titleSceneBackground')
      .setScale(2.75)

    this.titleSceneText = this.add
      .text(1920 / 2, 1080 / 2 + 350, 'Space Aliens', this.titleSceneTextStyle)
      .setOrigin(0.5)

    // Use delayedCall instead of update() to avoid linter issue
    this.time.delayedCall(6000, () => {
      this.scene.start('menuScene')
    })
  }
}

export default TitleScene
