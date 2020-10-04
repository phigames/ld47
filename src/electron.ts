import * as C from "./constants";
import ElectronShell from "./shell";
import Player from "./player";


export default abstract class Electron extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, distance: number) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, distance, 0, 'electron');
        this.sprite.displayWidth = this.sprite.displayHeight = C.ELECTRON_SIZE;
        this.add(this.sprite);
    }

    abstract checkCollision(player: Player): boolean;

}


export class BasicElectron extends Electron {

    shell: ElectronShell;

    constructor(scene: Phaser.Scene, shell: ElectronShell, angle: number) {
        super(scene, shell.radius);
        this.shell = shell;
        this.angle = angle;
    }

    update(time: number, delta: number) {

    }

    checkCollision(player: Player): boolean {
        if (player.shell !== this.shell) {
            return false;
        }
        let angularWidth = C.ELECTRON_SIZE / this.shell.getCircumference() * 360;
        let playerAngularWidth = C.PLAYER_SIZE / this.shell.getCircumference() * 360
        return Math.abs(this.angle - player.angle) < angularWidth / 2 + playerAngularWidth / 2 - 1;
    }

}
