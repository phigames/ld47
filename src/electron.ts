import ElectronShell from "./shell";


export default abstract class Electron extends Phaser.GameObjects.Sprite {

    calculateDisplayOriginX(distance: number) {
        return (-distance + this.displayWidth / 2) / this.scaleX;
    }

}


export class BasicElectron extends Electron {

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, 0, 0, 'electron');
        this.displayWidth = this.displayHeight = 40;
        this.displayOriginX = this.calculateDisplayOriginX(shell.radius);
    }

    update(time: number, delta: number) {

    }

}
