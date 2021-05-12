// limeri/game.js

function distance(x1, x2, y1, y2) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
}

class Board {
    constructor() {
        this.players = {}
        this.projectiles = []
        this.bounds = [0, 0, 100, 100]
        this.actions = []
    }
    display() {
        return {
            'players': this.players,
            'projectiles': this.projectiles,
        };
    }
    playerMove(player, direction) {
        const d = { 'w': [0, 1], 's': [0, -1], 'a': [-1, 0], 'd': [1, 0] }
        this.players[player].move(d[direction][0], d[direction][1], this.bounds)
    }
    stepProjectiles() {
        let i = 0;
        while (i < this.projectiles.length) {
            let projectile = this.projectiles[i]
            projectile.move()
            for (const player in this.players) {
                if (!this.players[player].isDead()) {
                    if (this.players[player].wasHit(projectile.currentPosition[0], projectile.currentPosition[1], projectile.size)) {
                        if (this.players[player] != projectile.player) {
                            this.players[player].takeDamage(projectile.damage)
                        }
                        if (this.players[player].isDead()) {
                            projectile.player.score += 1
                        }
                    }
                }
            }
            if (projectile.hasStopped()) {
                projectile.player.currentProjectiles -= 1
                this.projectiles.splice(i, 1)
            } else {
                i += 1
            }
        }
    }
    playerCreate(name, color, socketId) {
        this.players[socketId] = new Player(name, color, socketId);
    }
    playerShoot(name, vector) {
        this.players[name].createProjectile(vector, this.projectiles)
    }
}

class Player {
    constructor(name, color, socketId) {
        this.name = name
        this.color = color
        this.socketId = socketId
        this.x = 0
        this.y = 0
        this.hp = 50
        this.currentProjectiles = 0
        this.maxProjectiles = 5
        this.score = 0
    }

    takeDamage(d) {
        this.hp -= d
    }

    isDead() {
        return this.hp <= 0
    }

    move(x, y, bounds) {
        if (bounds[0] <= this.x + x <= bounds[2] && bounds[1] <= this.y + y <= bounds[3]) {
            this.x += x
            this.y += y
        }
        return null;
    }

    wasHit(x, y, size) {
        return Math.abs(distance(this.x, x, this.y, y)) <= size
    }

    createProjectile(vector, l) {
        if (this.currentProjectiles >= this.maxProjectiles) {
            return null;
        }
        this.currentProjectiles += 1
        const s = Math.abs(vector[0]) + Math.abs(vector[1])
        vector[0] = vector[0] / s
        vector[1] = vector[1] / s
        l.push(new Projectile(this, this.color, [this.x, this.y], vector, 2, 50, 5, 200))
    }
}

class Projectile {
    constructor(player, color, position, vector, speed, size, damage, range) {
        this.player = player
        this.startingPosition = [Number(position[0]), Number(position[1])]
        this.currentPosition = position
        this.vector = vector
        this.speed = speed
        this.size = size
        this.damage = damage
        this.range = range
        this.color = color
    }

    move() {
        this.currentPosition[0] += this.vector[0] * this.speed;
        this.currentPosition[1] += this.vector[1] * this.speed;
    }
    hasStopped() {
        console.log(distance(this.startingPosition[0], this.currentPosition[0], this.startingPosition[1], this.currentPosition[1]))
        return Math.abs(distance(this.startingPosition[0], this.currentPosition[0], this.startingPosition[1], this.currentPosition[1])) >= this.range
    }
}

module.exports = Board
