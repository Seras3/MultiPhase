export default class Player {
    constructor(scene, arg) {
        this.type = 'Player';
        this.id = null;
        this.slot = null;

        const defaultSize = 50;
        const defaultSprite = 'player';

        let render = (x, y, sprite, size) => {
            let player = scene.physics.add.image(x, y, sprite).setDisplaySize(size, size);
            player.body.setCollideWorldBounds(true);
            player.body.setGravityY(1000);
            this.size = size;       // Can't pass size as data in sprite
            if (this.slot === '2') {
                player.setTint("0xff00aa");
            } else if (this.slot === '3') {
                player.setTint("0x55ffff");
            }
            return player;
        }

        if (arg.id != null) {
            this.id = arg.id;
            this.slot = arg.slot;
            console.log(this.slot);

            this.sprite = this.slot === '1' ?
                render(scene.getWidth() / 4, scene.getHeight() - defaultSize / 2,
                    defaultSprite, defaultSize) :
                render(scene.getWidth() / 4 * 3, scene.getHeight() - defaultSize / 2,
                    defaultSprite, defaultSize);
        }
        else if (arg.type === this.type) {
            this.id = arg.id;
            this.slot = arg.slot;
            this.sprite = render(arg.sprite.x, arg.sprite.y, arg.sprite.textureKey, arg.size);
        } else {
            throw new Error('Unexpected argument type in Player class');
        }
    }
}