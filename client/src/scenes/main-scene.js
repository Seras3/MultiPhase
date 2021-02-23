import Player from '../helpers/player';
import io from 'socket.io-client';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('main-scene');
    }

    getWidth() {
        return this.sys.game.config.width;
    }

    getHeight() {
        return this.sys.game.config.height;
    }

    preload() {
        this.load.path = 'src/assets/';
        this.load.image('player', 'player.png');
    }

    create() {
        let self = this;

        this.players = {};

        this.keys = this.input.keyboard.createCursorKeys();

        this.socket = io('http://localhost:3000/');

        this.socket.on('connect', () => {
            console.log('Connected!');
        });

        this.socket.on('roomIsFull', () => {
            this.add.text(this.getWidth() / 2, this.getHeight() / 2, "Ups, too many players!", { fontFamily: 'Courier', fontSize: 30 }).setOrigin(0.5);
        });

        this.socket.on('fetchPlayers', (serverPlayers) => {
            for (let key in serverPlayers) {
                this.players[key] = new Player(this, serverPlayers[key]);
            }
        });

        this.socket.on('assignPlayerId', (id, slot) => {
            this.player = new Player(this, { id, slot });
            this.players[id] = this.player;
            this.socket.emit('playerNew', this.player);
        });

        this.socket.on('playerMove', (id, direction) => {
            switch (direction) {
                case 'left':
                    this.players[id].sprite.setVelocityX(-300);
                    break;
                case 'right':
                    this.players[id].sprite.setVelocityX(300);
                    break;
                case 'up':
                    this.players[id].sprite.setVelocityY(-450);
                    break;
                case 'stand':
                    this.players[id].sprite.setVelocityX(0);
                    break;
            }
        });

        this.socket.on('playerNew', (player) => {
            this.players[player.id] = new Player(this, player);
        });

        this.socket.on('playerRemove', (id) => {
            this.players[id].sprite.destroy();
            this.players[id] = undefined;
        });
    }

    update() {
        if (this.player !== undefined) {
            if (this.keys.left.isDown) {
                this.socket.emit('playerMove', this.player.id, 'left');
            }
            else if (this.keys.right.isDown) {
                this.socket.emit('playerMove', this.player.id, 'right');
            }
            else {
                this.socket.emit('playerMove', this.player.id, 'stand');
            }

            if (this.keys.up.isDown && this.player.sprite.body.onFloor()) {
                this.socket.emit('playerMove', this.player.id, 'up');
            }
        }
    }
}