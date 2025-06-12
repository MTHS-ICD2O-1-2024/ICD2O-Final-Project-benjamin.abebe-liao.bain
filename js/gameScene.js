/* global Phaser */

// Created by: Benjamin Abebe and Bain Liao
// Created on: June 2025
// This is the Game Scene

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {
  // create enemy
  createEnemy () {
    const enemyXLocation = Math.floor(Math.random() * 1920) + 1
    let enemyXVelocity = Math.floor(Math.random() * 50) + 1
    enemyXVelocity *= Math.round(Math.random()) ? 1 : -1
    const anEnemy = this.physics.add.sprite(enemyXLocation, -1, 'enemy')
    anEnemy.body.velocity.y = 5
    anEnemy.body.velocity.x = enemyXVelocity

    // Assign enemy hp
    const randomType = Math.floor(Math.random() * 3) + 1
    if (randomType === 1) {
      anEnemy.hp = 1
      anEnemy.speed = 750
    } else if (randomType === 2) {
      anEnemy.hp = 2
      anEnemy.speed = 300
    } else {
      anEnemy.hp = 3
      anEnemy.speed = 150
    }
    this.enemyGroup.add(anEnemy)
  }

  // spawn a wave of multiple enemies
  spawnWave (numEnemies) {
    for (let loopCounter = 0; loopCounter < numEnemies; loopCounter++) {
      this.createEnemy()
    }
  }

  /**
   * This method is the constructor.
   */
  constructor () {
    super({ key: 'gameScene' })

    this.ship = null
    this.fireMissile = false
    this.waves = 1
    this.wavesText = null
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
    this.load.image('starBackground', './assets/background.png')
    this.load.image('ship', './assets/antivirus.png')
    this.load.image('missile', './assets/lightningbolt.png')
    this.load.image('enemy', './assets/mal.png')
    // this.load.image('missile', './assets/missile.png')
    // this.load.image('enemy', './assets/enemy.png')
    // sound
    // this.load.audio('laser', './assets/laser1.wav')
    // this.load.audio('explosion', './assets/barrelExploding.wav')
    // this.load.audio('bomb', './assets/bomb.wav')
  }

  create (data) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.wavesText = this.add.text(1650, 10, 'Wave: ' + this.waves.toString(), this.scoreTextStyle)

    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)

    this.livesText = this.add.text(10, 80, 'Lives: ' + this.lives.toString(), this.scoreTextStyle)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the enemies
    this.enemyGroup = this.physics.add.group()

    // Waves system
    this.spawnWave(this.waves)

    // Collisions between missiles and enemies
    this.physics.add.overlap(this.missileGroup, this.enemyGroup, function (missileCollide, enemyCollide) {
      missileCollide.destroy()
      // this.sound.play('explosion')
      // Reduce HP
      if (enemyCollide.hp > 1) {
        enemyCollide.hp -= 1
      } else {
        // Destroy if HP is 0 or less
        enemyCollide.destroy()
        this.score += 1
        this.scoreText.setText('Score: ' + this.score.toString())
      }
    }.bind(this))

    // Collisions between ship and enemies
    this.physics.add.overlap(this.ship, this.enemyGroup, function (shipCollide, enemyCollide) {
      // this.sound.play('bomb')
      enemyCollide.destroy()
      this.lives--
      this.livesText.setText('Lives: ' + this.lives.toString())

      // Reset everything when game ends
      if (this.lives <= 0) {
        this.physics.pause()
        enemyCollide.destroy()
        shipCollide.destroy()
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => {
          this.score = 0
          this.lives = 3
          this.waves = 1
          this.scene.start('gameScene')
        })
      }
    }.bind(this))
  }

  update (time, delta) {
    // Get mouse pointer coordinates
    const pointer = this.input.activePointer
    const dx = pointer.x - this.ship.x
    const dy = pointer.y - this.ship.y

    // Calculate angle from ship to mouse pointer
    const angle = Math.atan2(dy, dx)

    // Rotate ship sprite to face mouse pointer
    this.ship.rotation = angle

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

    // if the user pressed the arrow up button
    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }

    // if the user pressed the arrow down button
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
        // Create missile at ship's position
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)

        // Set missile velocity based on ship's rotation (angle)
        const missileSpeed = 1500
        aNewMissile.body.velocity.x = Math.cos(angle) * missileSpeed
        aNewMissile.body.velocity.y = Math.sin(angle) * missileSpeed

        // Optional: rotate missile to face moving direction
        aNewMissile.rotation = angle
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireMissile = false
    }

    // Update missile positions and destroy if out of bounds
    this.missileGroup.children.each(function (missile) {
      if (
        missile.x < 0 || missile.x > 1920 ||
        missile.y < 0 || missile.y > 1080
      ) {
        missile.destroy()
      }
    })

    // Make enemies move toward the player at a constant speed
    this.enemyGroup.children.each(function (enemy) {
      const dx = this.ship.x - enemy.x
      const dy = this.ship.y - enemy.y
      const angle = Math.atan2(dy, dx)
      const speed = enemy.speed

      enemy.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    }, this)

    // Check for enemies and progress waves if none are left
    if (this.enemyGroup.countActive(true) === 0) {
      this.waves++
      this.wavesText.setText('Wave: ' + this.waves)
      this.spawnWave(this.waves)
    }
  }
}

export default GameScene
