import 'phaser';
import ElectronShell from './shell';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    update(time: number, delta: number) {
        for (let shell of this.shells) {
            shell.update(time, delta);
        }
    }

}