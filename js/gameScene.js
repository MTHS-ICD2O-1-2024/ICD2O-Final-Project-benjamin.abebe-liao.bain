/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Game Scene

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {
  // create alien
  createAlien () {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1
    let alienXVelocity = Math.floor(Math.random() * 50) + 1
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1
    const anAlien = this.physics.add.sprite(alienXLocation, -1, 'alien')
    anAlien.body.velocity.y = 5
    anAlien.body.velocity.x = alienXVelocity
    this.alienGroup.add(anAlien)
  }

  /**
   * This method is the constructor.
   */
  constructor () {
    super({ key: 'gameScene' })

    this.ship = null
    this.fireMissile = false
    this.lives = 3
    this.livesText = null
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#0x5f6e7a')
  }

  preload () {
    console.log('Game Scene')

    // images
    // this.load.image('starBackground', './assets/starBackground.png')
    this.load.image('ship', './assets/antivirus.png')
    this.load.image('missile', './assets/lightningbolt.png')
    this.load.image('alien', './assets/mal.png')
    // this.load.image('missile', './assets/missile.png')
    // this.load.image('alien', './assets/alien.png')
    // sound
    // this.load.audio('laser', './assets/laser1.wav')
    // this.load.audio('explosion', './assets/barrelExploding.wav')
    // this.load.audio('bomb', './assets/bomb.wav')
  }

  create (data) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)

    this.livesText = this.add.text(10, 80, 'Lives: ' + this.lives.toString(), this.scoreTextStyle)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the aliens
    this.alienGroup = this.add.group()
    this.createAlien()

    // Collisions between missiles and aliens
    this.physics.add.overlap(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      // this.sound.play('explosion')
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
      this.createAlien()
      this.createAlien()
    }.bind(this))

    // Collisions between ship and aliens
    this.physics.add.overlap(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
      // this.sound.play('bomb')
      alienCollide.destroy()
      this.lives --
      this.livesText.setText('Lives: ' + this.lives.toString())
      this.createAlien()
      this.createAlien()
      if (this.lives <= 0) {
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
        this.score = 0
        this.lives = 3
      }
    }.bind(this))
  }

  update (time, delta) {
    const keyUpObj = this.input.keyboard.addKey('W')
    const keyLeftObj = this.input.keyboard.addKey('A')
    const keyRightObj = this.input.keyboard.addKey('D')
    const keyDownObj = this.input.keyboard.addKey('S')
    const keySpaceObj = this.input.keyboard.addKey('SPACE')

    if (keyLeftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 0
      }
    }

    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }

    if (keyUpObj.isDown === true) {
      this.ship.y -= 15
      if (this.ship.y < 0) {
        this.ship.y = 0
      }
    }

    if (keyDownObj.isDown === true) {
      this.ship.y += 15
      if (this.ship.y > 1080) {
        this.ship.y = 1080
      }
    }

    if (keySpaceObj.isDown === true) {
      if (this.fireMissile === false) {
        this.fireMissile = true
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireMissile = false
    }

    this.missileGroup.children.each(function (item) {
      item.y = item.y - 15
      if (item.y < 0) {
        item.destroy()
      }
    })

    // Make aliens move toward the player at a constant speed
    this.alienGroup.children.each(function (alien) {
      const dx = this.ship.x - alien.x
      const dy = this.ship.y - alien.y
      const angle = Math.atan2(dy, dx)
      const speed = 200 // change this number for faster/slower enemies

      alien.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    }, this)
  }
}

export default GameScene
