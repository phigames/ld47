import Electron, { BasicElectron } from "./electron";


export default class ElectronShell extends Phaser.GameObjects.Container {

    radius: number;
    velocity: number;
    electrons: Electron[];
    circle: Phaser.GameObjects.Arc;

    constructor(scene: Phaser.Scene, radius: number, velocity: number) {
        super(scene);
        this.radius = radius;
        this.velocity = velocity;

        this.circle = new Phaser.GameObjects.Arc(scene, 0, 0, this.radius, 0, 360, false, 0x000000, 0);
        this.circle.strokeColor = 0x000000;
        this.circle.isStroked = true;
        this.circle.isFilled = false;
        this.add(this.circle);

        this.electrons = [
            new BasicElectron(scene, this),
        ];
        for (let electron of this.electrons) {
            this.add(electron);
        }
    }

    update(time: number, delta: number) {
        this.angle += delta * this.velocity;
        for (let electron of this.electrons) {
            electron.update(time, delta);
        }
    }

}
