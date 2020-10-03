import ElectronShell from "./shell";


export default abstract class Electron extends Phaser.GameObjects.Sprite {
    
}


export class BasicElectron extends Electron {

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, 0, 0, 'electron');
        this.originX = 0;
        this.scale = 0.3;
    }

    update(time: number, delta: number) {

    }
}
