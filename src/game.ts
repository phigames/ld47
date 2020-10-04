import 'phaser';
import {Atom} from "./atom";
import * as C from './constants';


export default class Game extends Phaser.Scene {

    atom: Atom;
    elementDisplay: Phaser.GameObjects.Image;

    constructor() {
        super('game');
    }

    preload() {
        this.loadImage('background');
        this.loadImage('electron');
        this.loadImage('proton');
        this.loadImage('ring');
        for (let i = 1; i <= 6; i++) {
            this.loadImage('element' + i.toString());
        }
    }

    loadImage(name: string) {
        this.load.image(name, `assets/${name}.png`);
    }

    loadAudio(name: string) {
        this.load.audio(name, `assets/${name}.ogg`);
    }

    create() {
        let background = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'background');
        background.displayWidth = C.GAME_WIDTH;
        background.displayHeight = C.GAME_HEIGHT;

        this.atom = new Atom(this);
        this.add.existing(this.atom);

        this.elementDisplay = new Phaser.GameObjects.Image(this, C.GAME_WIDTH - 70, 70, null);
        this.elementDisplay.scale = 0.3;
        this.add.existing(this.elementDisplay);
        this.updateElementDisplay(1);
    }

    update(time: number, delta: number) {
        this.atom.update(time, delta);
    }

    updateElementDisplay(elementIndex:  number) {
        this.elementDisplay.setTexture('element' + elementIndex.toString());
    }

}

const config = {
    type: Phaser.AUTO,
    width: C.GAME_WIDTH,
    height: C.GAME_HEIGHT,
    scene: Game,
    scale: {
        mode: Phaser.Scale.FIT,
    },
};

const game = new Phaser.Game(config);
