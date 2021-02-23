import Phaser from 'phaser';
import MainScene from './scenes/main-scene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade'
    },
    width: 800,
    height: 600,
    scene: [MainScene]
};

const game = new Phaser.Game(config);