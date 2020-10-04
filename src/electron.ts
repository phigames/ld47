import * as C from "./constants";
import ElectronShell from "./shell";


export default abstract class Electron extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, distance: number) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, distance, 0, 'electron');
        this.sprite.displayWidth = this.sprite.displayHeight = C.ELECTRON_SIZE;
        this.add(this.sprite);
    }

}


export class BasicElectron extends Electron {

    constructor(scene: Phaser.Scene, shell: ElectronShell, angle: number) {
        super(scene, shell.radius);
        this.angle = angle;
    }

    update(time: number, delta: number) {

    }

}
