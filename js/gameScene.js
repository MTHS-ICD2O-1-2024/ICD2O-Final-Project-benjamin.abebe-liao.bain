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
    // Randomly generate the enemy's X location and velocity
    const enemyXLocation = Math.floor(Math.random() * 1920) + 1
    let enemyXVelocity = Math.floor(Math.random() * 50) + 1
    enemyXVelocity *= Math.round(Math.random()) ? 1 : -1

    const randomType = Math.floor(Math.random() * 3) + 1
    let texture
    if (randomType === 1) {
      texture = 'fastEnemy'
    } else if (randomType === 2) {
      texture = 'enemy'
    } else {
      texture = 'slowEnemy'
    }

    const anEnemy = this.physics.add.sprite(enemyXLocation, -1, texture)
    anEnemy.body.velocity.y = 5
    anEnemy.body.velocity.x = enemyXVelocity

    if (randomType === 1) {
      // virus enemy
      anEnemy.hp = 1
      anEnemy.speed = 750
    } else if (randomType === 2) {
      // malware enemy
      anEnemy.hp = 3
      anEnemy.speed = 300
    } else {
      // ransomware enemy
      anEnemy.hp = 5
      anEnemy.speed = 150
    }

    this.enemyGroup.add(anEnemy)
  }

  // Spawn a increasing number of enemies per wave
  spawnWave (numEnemies) {
    for (let loopCounter = 0; loopCounter < numEnemies; loopCounter++) {
      this.createEnemy()
    }
  }

  constructor () {
    super({ key: 'gameScene' })

    this.ship = null
    this.waves = 1
    this.wavesText = null
    this.lives = 3
    this.livesText = null
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
    this.gameOverTextStyle = { font: '30px Arial', fill: '#ffffff', align: 'center' }
  }

  // Initialize the scene
  init (data) {
    this.cameras.main.setBackgroundColor('#0x5f6e7a')
  }

  // Preload assets for the game
  preload () {
    console.log('Game Scene')
    // images
    this.load.image('gameOver', './assets/gameOver.png')
    this.load.image('background', './assets/background.png')
    this.load.image('ship', './assets/antivirus.png')
    this.load.image('missile', './assets/lightningbolt.png')
    this.load.image('enemy', './assets/mal.png')
    this.load.image('fastEnemy', './assets/virus.png')
    this.load.image('slowEnemy', './assets/ransomware.png')

    // audios
    this.load.audio('laser', './assets/laser.wav')
    this.load.audio('explosion', './assets/explosion.wav')
    this.load.audio('gameover', './assets/gameover.wav')
    this.load.audio('backgroundMusic', './assets/backgroundMusic.wav')
  }

  // Create the game scene
  create (data) {
    this.background = this.add.image(0, 0, 'background').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.gameOverImage = this.add.image(1920 / 2, 1080 / 2, 'gameOver')
    this.gameOverImage.setOrigin(0.5, 0.5)
    this.gameOverImage.setVisible(false)

    this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 })
    this.backgroundMusic.play()

    this.wavesText = this.add.text(1650, 10, 'Wave: ' + this.waves.toString(), this.scoreTextStyle)
    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
    this.livesText = this.add.text(10, 80, 'Lives: ' + this.lives.toString(), this.scoreTextStyle)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    this.missileGroup = this.physics.add.group()
    this.enemyGroup = this.physics.add.group()

    this.spawnWave(this.waves)

    this.physics.add.overlap(this.missileGroup, this.enemyGroup, function (missileCollide, enemyCollide) {
      missileCollide.destroy()
      this.sound.play('explosion')

      if (enemyCollide.hp > 1) {
        enemyCollide.hp -= 1
      } else {
        enemyCollide.destroy()
        this.score += 1
        this.scoreText.setText('Score: ' + this.score.toString())
      }
    }.bind(this))

    this.physics.add.overlap(this.ship, this.enemyGroup, function (shipCollide, enemyCollide) {
      this.sound.play('explosion')
      enemyCollide.destroy()
      this.lives--
      this.livesText.setText('Lives: ' + this.lives.toString())

      if (this.lives <= 0) {
        this.physics.pause()
        this.backgroundMusic.stop()
        this.sound.play('gameover')
        this.gameOverImage.setVisible(true)
        shipCollide.destroy()
        this.gameOverText = this.add.text(1920 / 2, (1080 / 2) + 20, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => {
          this.score = 0
          this.lives = 3
          this.waves = 1
          this.scene.start('gameScene')
        })
      }
    }.bind(this))

    // Mouse click to shoot
    this.input.on('pointerdown', (pointer) => {
      if (this.lives <= 0) return

      const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
      this.missileGroup.add(aNewMissile)

      this.sound.play('laser')

      const dx = pointer.x - this.ship.x
      const dy = pointer.y - this.ship.y
      const angle = Math.atan2(dy, dx)

      const missileSpeed = 1500
      aNewMissile.body.velocity.x = Math.cos(angle) * missileSpeed
      aNewMissile.body.velocity.y = Math.sin(angle) * missileSpeed
      aNewMissile.rotation = angle
    })
  }

  // Update the game
  update (time, delta) {
    const pointer = this.input.activePointer
    const dx = pointer.x - this.ship.x
    const dy = pointer.y - this.ship.y
    const angle = Math.atan2(dy, dx)

    this.ship.rotation = angle

    const keyUpObj = this.input.keyboard.addKey('W')
    const keyLeftObj = this.input.keyboard.addKey('A')
    const keyRightObj = this.input.keyboard.addKey('D')
    const keyDownObj = this.input.keyboard.addKey('S')

    if (keyLeftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x < 0) this.ship.x = 0
    }

    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) this.ship.x = 1920
    }

    if (keyUpObj.isDown === true) {
      this.ship.y -= 15
      if (this.ship.y < 0) this.ship.y = 0
    }

    if (keyDownObj.isDown === true) {
      this.ship.y += 15
      if (this.ship.y > 1080) this.ship.y = 1080
    }

    this.missileGroup.children.each(function (missile) {
      if (
        missile.x < 0 || missile.x > 1920 ||
        missile.y < 0 || missile.y > 1080
      ) {
        missile.destroy()
      }
    })

    this.enemyGroup.children.each(function (enemy) {
      const dx = this.ship.x - enemy.x
      const dy = this.ship.y - enemy.y
      const angle = Math.atan2(dy, dx)
      const speed = enemy.speed
      enemy.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    }, this)

    if (this.enemyGroup.countActive(true) === 0) {
      this.waves++
      this.wavesText.setText('Wave: ' + this.waves)
      this.spawnWave(this.waves)
    }
  }
}

export default GameScene
