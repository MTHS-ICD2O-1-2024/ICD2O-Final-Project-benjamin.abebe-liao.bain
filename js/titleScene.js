/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Phaser3 game configuration file

// clase for the title scene
class TitleScene extends Phaser.Scene {
  constructor() {
    super({key: 'titleScene' })

    this.titleSceneBackgroundImage = null
    this.titleSceneText = null
    this.titleSceneTextStyle = {
      font: '200px Times',
      fill: '#fde4b9',
      align: 'center'
    }
  }

  /**
   * Can be defined on your own Scenes.
   * This method is called by the Scene Manager when the scene starts,
   *  before preload () and create ().
   * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
   */
  init(data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to load assets.
   */
  preload() {
    console.log('Title Scene')
    this.load.image('titleSceneBackground', 'assets/aliens_screen_image.jpg')
  }

  
  create(data) {
    this.titleSceneBackgroundImage = this.add.sprite(0, 0, 'titleSceneBackground').setScale(2.75)
    this.titleSceneBackgroundImage.x = 1920 / 2
    this.titleSceneBackgroundImage.y = 1080 / 2

    this.titleSceneText = this.add.text(1920 / 2, 1080 / 2 + 350, 'Space Aliens', this.titleSceneTextStyle).setOrigin(0.5)
  }

  update(time, delta) {
    if (time > 6000) {
      this.scene.switch('menuScene')
    }
  }
}

export default TitleScene