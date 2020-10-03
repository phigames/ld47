import ElectronShell from "./shell";

export default class Player extends Phaser.GameObjects.Sprite {

    shellIndex: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 200, 0, 'proton');
        this.scale = 0.1;
    }

    jumpToShell(shell: ElectronShell) {
        this.x = shell.radius;
    }

}
