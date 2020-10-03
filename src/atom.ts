import 'phaser';
import ElectronShell from './shell';
import * as C from './constants';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];

    constructor(scene: Phaser.Scene) {
        super(scene, C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2);
        let testShell = new ElectronShell(scene, 100);
        this.shells = [testShell];
        this.add(testShell);
    }

    update(time: number, delta: number) {
        for (let shell of this.shells) {
            shell.update(time, delta);
        }
    }

}