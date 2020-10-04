import 'phaser';
import ElectronShell, { DummyShell } from './shell';
import * as C from './constants';
import Player from './player';
import Kernel from './kernel';
import Game from './game';
import Electron, { BasicElectron } from './electron';


export class Atom extends Phaser.GameObjects.Container {

    shells: ElectronShell[];
    dummyShell: DummyShell;
    player: Player;
    kernel: Kernel;
    elementIndex: number;
    updateElementDisplay: (elementIndex: number) => void;

    constructor(scene: Game) {
        super(scene, C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2);
        this.shells = [
            new ElectronShell(scene, 100, 0.05, 2)
        ];
        let firstElectron = new BasicElectron(this.scene, this.shells[0])
        this.shells[0].addElectron(firstElectron)
        this.add(this.shells);
        this.dummyShell = new DummyShell(scene, this.shells[this.shells.length - 1].radius + 100);
        this.add(this.dummyShell);
        this.elementIndex = 1;

        this.player = new Player(scene, this.dummyShell, this.onCollision.bind(this));
        this.add(this.player);
        scene.input.keyboard.on('keydown-DOWN', this.onDownPressed.bind(this));
        scene.input.keyboard.on('keydown-UP', this.onUpPressed.bind(this));

        this.kernel = new Kernel(scene, 1);
        this.add(this.kernel);

        this.updateElementDisplay = scene.updateElementDisplay.bind(scene);
        this.updateZoom(this.shells.length);
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
        if (shellIndex >= this.shells.length) {
            shellIndex = this.shells.length - 1;
        }

        if (this.player.jumpToShell(this.shells[shellIndex])) {
            this.updateZoom(shellIndex);
        }
    }

    onCollision() {
        this.player.reset(this.dummyShell);
        this.updateZoom(this.shells.length);
    }

    updateZoom(shellIndex: number) {
        this.scene.tweens.add({
            targets: this,
            scale: 1 / (Math.sqrt(shellIndex + 1)) + 0.3,
            duration: C.PLAYER_JUMP_DURATION,
            ease: 'Quad.easeOut',
        });
    }

    nextLevel() {
        this.elementIndex++;
        this.kernel.addProton();
        this.updateElementDisplay(this.elementIndex);
        let nextElectronPosition = C.NEW_ELECTRON_SHELL[this.elementIndex] - 1

        if (nextElectronPosition >= this.shells.length) {
            let currentOuterShell = this.shells[this.shells.length - 1];
            let velocity = Math.random() * 0.03 + 0.02;
            if (Math.random() < 0.5) {
                velocity = -velocity;
            }
            let newShell = new ElectronShell(this.scene, currentOuterShell.radius + C.SHELL_DISTANCE, velocity, 8);
            this.shells.push(newShell);
            this.add(newShell);

            this.remove(this.dummyShell);
            this.dummyShell = new DummyShell(this.scene, this.shells[this.shells.length - 1].radius + 100);
            this.add(this.dummyShell);
        }

        let electron = new BasicElectron(this.scene, this.shells[nextElectronPosition])
        this.shells[nextElectronPosition].addElectron(electron)
        this.player.reset(this.dummyShell);
        this.updateZoom(this.shells.length);
    }

}