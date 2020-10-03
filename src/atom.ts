import 'phaser';
import ElectronShell from './shell';
import * as C from './constants';
import Player from './player';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];
    player: Player;
    playerShellIndex: number;

    constructor(scene: Phaser.Scene) {
        super(scene, C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2);
        this.shells = [
            new ElectronShell(scene, 100, 0.01),
        ];
        for (let shell of this.shells) {
            this.add(shell);
        }

        this.player = new Player(scene);
        this.add(this.player);
        scene.input.keyboard.on('keydown-UP', () => {
            this.playerShellIndex += 1;
            if (this.playerShellIndex >= this.shells.length) {
                this.playerShellIndex = this.shells.length - 1;
            }
            this.player.jumpToShell(this.shells[this.playerShellIndex]);
        });
        scene.input.keyboard.on('keydown-DOWN', () => {
            this.playerShellIndex -= 1;
            if (this.playerShellIndex < 0) {
                this.playerShellIndex = 0;
            }
            this.player.jumpToShell(this.shells[this.playerShellIndex]);
        });
    }

    update(time: number, delta: number) {
        for (let shell of this.shells) {
            shell.update(time, delta);
        }
    }

}