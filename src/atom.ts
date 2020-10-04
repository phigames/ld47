import 'phaser';
import ElectronShell, { DummyShell } from './shell';
import * as C from './constants';
import Player from './player';
import Kernel from './kernel';
import Game from './game';
import Electron, { BasicElectron, JumpingElectron, FastElectron } from './electron';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];
    dummyShell: DummyShell;
    player: Player;
    kernel: Kernel;
    elementNumber: number;
    updateElementDisplay: (elementNumber: number) => void;
    removeLife: () => void;

    constructor(game: Game) {
        super(game, C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2);
        this.shells = [
            new ElectronShell(game, 100, 0.05),
        ];
        let firstElectron = new BasicElectron(this.scene, this.shells[0])
        this.shells[0].addElectron(firstElectron)
        this.add(this.shells);
        this.dummyShell = new DummyShell(game, this.shells[this.shells.length - 1].radius + 100);
        this.add(this.dummyShell);
        this.elementNumber = 1;

        this.player = new Player(game, this, this.dummyShell, this.onCollision.bind(this));
        this.add(this.player);
        game.input.keyboard.on('keydown-DOWN', this.onDownPressed.bind(this));
        game.input.keyboard.on('keydown-UP', this.onUpPressed.bind(this));

        this.kernel = new Kernel(game, 1);
        this.add(this.kernel);

        this.updateElementDisplay = game.updateElementDisplay.bind(game);
        this.updateElementDisplay(this.elementNumber);
        this.removeLife = game.removeLife.bind(game);

        this.updateZoom(this.shells.length);

        // for (let i = 0; i < 20; i++) {
        //     this.nextLevel();
        // }
    }

    update(time: number, delta: number) {
        for (let shell of this.shells) {
            shell.update(time, delta);
        }
        this.player.update(time, delta);
    }

    onUpPressed() {
        let shellIndex: number;
        if (this.player.shell === this.dummyShell) {
            shellIndex = this.shells.length - 1;
        } else {
            shellIndex = this.shells.indexOf(this.player.shell) - 1;
        }

        if (shellIndex < 0) {
            this.player.jumpToKernel(this.nextLevel.bind(this));
        } else {
            if (this.player.jumpToShell(this.shells[shellIndex])) {
                this.updateZoom(shellIndex);
            }
        }
    }

    onDownPressed() {
        let shellIndex = this.shells.indexOf(this.player.shell) + 1;
        if (shellIndex < this.shells.length && this.player.shell !== this.dummyShell) {
            if (this.player.jumpToShell(this.shells[shellIndex])) {
                this.updateZoom(shellIndex);
            }
        }
    }

    onCollision() {
        this.player.reset(this.dummyShell);
        this.removeLife();
        this.updateZoom(this.shells.length);
    }

    updateZoom(shellIndex: number) {
        this.scene.tweens.add({
            targets: this,
            scale: 1 / (Math.sqrt(shellIndex + 1)) + 0.3,
            duration: 300,
            ease: 'Quad.easeOut',
        });
    }

    nextLevel() {
        this.elementNumber++;
        this.kernel.addProton();
        this.updateElementDisplay(this.elementNumber);
        let nextElectronPosition = C.NEW_ELECTRON_SHELL[this.elementNumber] - 1;

        if (nextElectronPosition >= this.shells.length) {
            let currentOuterShell = this.shells[this.shells.length - 1];
            let velocity = Math.random() * 0.02 + 0.02;
            if (this.shells.length % 2 == 1) {
                velocity = -velocity;
            }
            let newShell = new ElectronShell(this.scene, currentOuterShell.radius + C.SHELL_DISTANCE, velocity);
            this.shells.push(newShell);
            this.add(newShell);

            this.remove(this.dummyShell);
            this.dummyShell = new DummyShell(this.scene, this.shells[this.shells.length - 1].radius + 100);
            this.add(this.dummyShell);
        }

        let electron = new BasicElectron(this.scene, this.shells[nextElectronPosition]);
        this.shells[nextElectronPosition].addElectron(electron)

        if (this.shells.length >= C.MIN_SHELLS_FOR_ELECTRON_UPGRADES
                && Math.random() < C.ELECTRON_UPGRADE_PROBABILITY) {
            this.upgradeRandomElectron();
        }

        this.player.reset(this.dummyShell);
        this.updateZoom(this.shells.length);
    }

    upgradeRandomElectron() {
        let shellIndex: number;
        let electron: Electron;
        let tries = 0;
        do {
            shellIndex = Math.floor(Math.random() * this.shells.length);
            if (shellIndex < this.shells.length - 1
                    && this.shells.length >= C.MIN_SHELLS_FOR_JUMPING_ELECTRONS
                    && Math.random() < C.JUMPING_ELECTRON_PROBABILITY) {
                electron = new JumpingElectron(this.scene, this.shells[shellIndex], this.shells[shellIndex + 1]);
            } else {
                electron = new FastElectron(this.scene, this.shells[shellIndex]);
            }
            tries++;
        } while (!this.shells[shellIndex].upgradeElectron(electron) && tries < 5);
    }

}