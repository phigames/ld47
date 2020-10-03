import Electron from "./electron";


export default class ElectronShell extends Phaser.GameObjects.Container {

    radius: number;
    velocity: number;
    rotation: number;
    electrons: Electron[];
    circle: Phaser.GameObjects.Arc;

    constructor(scene: Phaser.Scene, radius: number) {
        super(scene);
        this.radius = radius;
        this.circle = new Phaser.GameObjects.Arc(scene, 0, 0, this.radius, 0, 360, false, 0x000000, 0);
        this.circle.strokeColor = 0x000000;
        this.circle.isStroked = true;
        this.circle.isFilled = false;
        this.add(this.circle);
    }

    update(time: number, delta: number) {
        
        for (let electron of this.electrons) {
            electron.update(time, delta);
        }
    }

}
