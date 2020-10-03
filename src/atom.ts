import 'phaser';
import ElectronShell, { DummyShell } from './shell';
import * as C from './constants';
import Player from './player';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];
    dummyShell: DummyShell;
    player: Player;
    elementIndex: number;

    constructor(scene: Phaser.Scene) {
        super(scene, C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2);
        this.shells = [
            new ElectronShell(scene, 100, 0.05, 2),
        ];
        this.dummyShell = new DummyShell(scene, this.shells[this.shells.length - 1].radius + 100);
        this.elementIndex = 1;
        for (let shell of this.shells) {
            this.add(shell);
        }

        this.player = new Player(scene, this.dummyShell);
        this.add(this.player);
        scene.input.keyboard.on('keydown-DOWN', () => {
            let shellIndex = this.shells.indexOf(this.player.shell) + 1;
            if (shellIndex >= this.shells.length) {
                shellIndex = this.shells.length - 1;
            }
            this.player.jumpToShell(this.shells[shellIndex]);
        });
        scene.input.keyboard.on('keydown-UP', () => {
            let shellIndex;
            if (this.player.shell === this.dummyShell) {
                shellIndex = this.shells.length - 1;
            } else {
                shellIndex = this.shells.indexOf(this.player.shell) - 1;
            }
            if (shellIndex < 0) {
                this.player.jumpToKernel(this.nextLevel.bind(this));
            } else {
                this.player.jumpToShell(this.shells[shellIndex]);
            }
        });
    }

    update(time: number, delta: number) {
        for (let shell of this.shells) {
            shell.update(time, delta);
        }
    }

    nextLevel() {
        this.elementIndex++;

        let currentOuterShell = this.shells[this.shells.length - 1];
        let newShell = new ElectronShell(this.scene, currentOuterShell.radius + 100, 0.05, 8);
        this.shells.push(newShell);
        this.add(newShell);

        this.remove(this.dummyShell);
        this.dummyShell = new DummyShell(this.scene, this.shells[this.shells.length - 1].radius + 100);
        this.add(this.dummyShell);
        this.player.reset(this.dummyShell);
    }

}