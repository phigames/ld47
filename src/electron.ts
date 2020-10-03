import ElectronShell from "./shell";


export default abstract class Electron extends Phaser.GameObjects.Sprite {
    
}


export class BasicElectron extends Electron {

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, shell.radius, 0, 'placeholder');
    }

    update(time: number, delta: number) {
        
    }
}
