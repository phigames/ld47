import Electron, { BasicElectron, DrunkElectron } from "./electron";


export default class ElectronShell extends Phaser.GameObjects.Container {

    radius: number;
    velocity: number;
    electrons: Electron[];
    ring: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, radius: number, velocity: number) {
        super(scene);
        this.radius = radius;
        this.velocity = velocity;

        this.ring = new Phaser.GameObjects.Sprite(scene, 0, 0, 'ring')
        this.ring.displayWidth = this.ring.displayHeight = radius * 2;
        this.add(this.ring);

        this.electrons = [];
    }

    addElectron(electron: Electron) {
        this.electrons.push(electron);
        this.add(electron)
        for (let i = 0; i < this.electrons.length; i++) {
            this.electrons[i].angle = 360 / this.electrons.length * (i + 1);
        }
    }

    upgradeElectron(newElectron: Electron): boolean {
        let indices = [];
        for (let i = 0; i < this.electrons.length; i++) {
            indices.push(i);
        }
        indices = Phaser.Math.RND.shuffle(indices);
        for (let i of indices) {
            if (this.electrons[i] instanceof BasicElectron) {
                newElectron.angle = this.electrons[i].angle;
                this.electrons[i].destroy();
                this.electrons[i] = newElectron;
                this.add(newElectron);
                return true;
            }
        }
        return false;
    }

    update(time: number, delta: number) {
        this.angle += delta * this.velocity;
        for (let electron of this.electrons) {
            electron.update(time, delta);
        }
    }

    getCircumference() {
        return this.radius * 2 * Math.PI;
    }

}


export class DummyShell extends ElectronShell {

    constructor(scene: Phaser.Scene, radius: number) {
        super(scene, radius, 0);
        this.remove(this.ring, true);
    }

    update() { }

}
