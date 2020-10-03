import Electron, { BasicElectron } from "./electron";


export default class ElectronShell extends Phaser.GameObjects.Container {

    radius: number;
    velocity: number;
    electrons: Electron[];
    ring: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, radius: number, velocity: number, numElectrons: number) {
        super(scene);
        this.radius = radius;
        this.velocity = velocity;

        this.ring = new Phaser.GameObjects.Sprite(scene, 0, 0, 'ring')
        this.ring.displayWidth = this.ring.displayHeight = radius * 2;
        this.add(this.ring);

        this.electrons = [];
        for (let i = 0; i < numElectrons; i++) {
            this.electrons.push(new BasicElectron(scene, this));
        }

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
