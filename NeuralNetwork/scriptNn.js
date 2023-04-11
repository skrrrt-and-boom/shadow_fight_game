const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 568

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: '../Assets/background_pixeled.png',
  scale: 0.8, // 0.24
})

const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: '../Assets/samuraiMack/pleyer_idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: '../Assets/samuraiMack/player_idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: '../Assets/samuraiMack/player_run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: '../Assets/samuraiMack/player_jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: '../Assets/samuraiMack/player_fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: '../Assets/samuraiMack/player_attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: '../Assets/samuraiMack/player_attack2.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: '../Assets/samuraiMack/player_take_hit_white.png',
      framesMax: 4,
    },
    death: {
      imageSrc: '../Assets/samuraiMack/player_death.png',
      framesMax: 6,
    }

  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 150,
    height: 50,
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: '../Assets/kenji/enemy_idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: '../Assets/kenji/enemy_idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: '../Assets/kenji/enemy_run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: '../Assets/kenji/enemy_jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: '../Assets/kenji/enemy_fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: '../Assets/kenji/enemy_attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: '../Assets/kenji/enemy_attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: '../Assets/kenji/enemy_take_hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: '../Assets/kenji/enemy_death.png',
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 140,
    height: 50,
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

decreaseTimer()

let endGame = false
let endTime = 200

function goToStart() {
  window.location = '../start.html'
}

function animate() {
  if (endGame && endTime === 0) {
    goToStart()
  }
  else if (endGame && endTime !== 0) {
    endTime -= 1
    window.requestAnimationFrame(animate)
  }
  else {
    window.requestAnimationFrame(animate)
  }
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //    Player movement
  if (keys.a.pressed && player.lastKey === 'a'  && player.position.x !== 0) {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x !== 975) {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
  player.switchSprite('idle')
  }

  //  jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //    Enemy movement
  if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft' && enemy.position.x !== 0) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight' && enemy.position.x !== 975) {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //    detect for collisions && get hits
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
      player.isAttacking && player.frameCurrent === 4 &&
      player.health > 0
  ) {
    enemy.takeHit()
    player.isAttacking = false
    if (enemy.health >= 0) {
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    } else {document.querySelector('#enemyHealth').style.width = '0%'}
    }

  //  if attack miss
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
      enemy.isAttacking && enemy.frameCurrent === 2 &&
      enemy.health > 0
  ) {
    player.takeHit()
    enemy.isAttacking = false
    if (player.health >= 0) {
      document.querySelector('#playerHealth').style.width = player.health + '%'
    } else {document.querySelector('#playerHealth').style.width = '0%'}
  }

  //  if attack miss
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false
  }


  //  end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerID})
  }
}

window.onload = animate()

window.addEventListener('keydown', (event) => {
  if (!enemy.dead) {

    switch  (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.position.y === 418) {
          enemy.velocity.y -= 20
          playSound("../Assets/sounds/jump.mp3")
        }
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break

  }
})

// AI play, make AI to train with itself and write weights and biases to other file
if (!player.dead) {

  switch (key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      if (player.position.y === 418) {
        player.velocity.y -= 20
        playSound("../Assets/sounds/jump.mp3")
      }
      break
    case 's':
      player.attack()
      break
  }
}

//  Music fun
function playSound(soundfile){
  let audio = new Audio(soundfile)
  audio.play()
}
