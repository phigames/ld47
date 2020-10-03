import 'phaser';
import {Atom} from "./atom";
import * as C from './constants';


export class Game extends Phaser.Scene {

    atom: Atom;

    constructor() {
        super('game');
    }

    preload() {
        this.loadImage('background');
        this.loadImage('electron');
        this.loadImage('proton');
        this.loadImage('ring');
    }

    loadImage(name: string) {
        this.load.image(name, `assets/${name}.png`);
    }

    loadAudio(name: string) {
        this.load.audio(name, `assets/${name}.ogg`);
    }

    create() {
        this.atom = new Atom(this);
        this.add.existing(this.atom);
    }

    update(time: number, delta: number) {
        this.atom.update(time, delta);
    }

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#CCCCCC',
    width: C.GAME_WIDTH,
    height: C.GAME_HEIGHT,
    scene: Game,
    scale: {
        mode: Phaser.Scale.FIT,
    }
};

const game = new Phaser.Game(config);
