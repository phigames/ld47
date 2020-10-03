import Electron from "./electron";


export default class ElectronShell extends Phaser.GameObjects.Container {

    radius: number;
    velocity: number;
    rotation: number;
    electrons: Electron[];

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    update(time: number, delta: number) {
        for (let electron of this.electrons) {
            electron.update(time, delta);
        }
    }

}
