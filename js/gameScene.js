/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Game Scene

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {
  // create enemy of specific type
  createEnemy(type = 'type1') {
    const x = Math.floor(Math.random() * 1920) + 1
    let speed = 100
    let health = 1
    let velocityY = 5
    let velocityX = 0
    let texture = 'alien'
  
    if (type === 'type1') {
      health = 3
      speed = 200
      velocityX = Math.floor(Math.random() * 50) + 1
      velocityX *= Math.round(Math.random()) ? 1 : -1
    } else if (type === 'type2') {
      health = 5
      speed = 100
      velocityX = Math.floor(Math.random() * 20) + 1
      velocityX *= Math.round(Math.random()) ? 1 : -1
    }
  
    const enemy = this.physics.add.sprite(x, -1, texture)
    enemy.body.velocity.y = velocityY
    enemy.body.velocity.x = velocityX
  
    enemy.speed = speed
    enemy.setData('health', health)
  
    this.enemyGroup.add(enemy)
  }

  /**
   * This method is the constructor.
   */
  constructor () {
    super({ key: 'gameScene' })

    this.ship = null
    this.fireMissile = false
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

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the enemy
    this.enemyGroup = this.add.group()

    // create some enemies of different types
    this.createEnemy('type1')
    this.createEnemy('type2')

    // Collisions between missiles and enemies
    this.physics.add.collider(this.missileGroup, this.enemyGroup, function (missileCollide, enemyCollide) {
      let currentHealth = enemyCollide.getData('health')
      enemyCollide.setData('health', currentHealth - 1)
      
      console.log('Enemy health:', currentHealth - 1)
      missileCollide.destroy()
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
      if (enemyCollide.health <= 0) {
        enemyCollide.destroy()
        // this.sound.play('explosion')
        const randomType = Math.random() < 0.5 ? 'type1' : 'type2'
        this.createEnemy(randomType)
        this.createEnemy(randomType)
      }
    }.bind(this))

    // Collisions between ship and enemies
    this.physics.add.collider(this.ship, this.enemyGroup, function (shipCollide, enemyCollide) {
      // this.sound.play('bomb')
      this.physics.pause()
      enemyCollide.destroy()
      shipCollide.destroy()
      this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
      this.gameOverText.setInteractive({ useHandCursor: true })
      this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
      this.score = 0
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

    // Make enemies move toward the player at a constant speed
    this.enemyGroup.children.each(function (enemy) {
      const dx = this.ship.x - enemy.x
      const dy = this.ship.y - enemy.y
      const angle = Math.atan2(dy, dx)
    
      const speed = enemy.speed || 100
    
      enemy.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    }, this)
  }
}

export default GameScene
