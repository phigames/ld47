import 'phaser';
import {Atom} from "./atom";
import * as C from './constants';


export class Game extends Phaser.Scene {

    atom: Atom;

    constructor() {
        super('game');
    }

    preload() {
    }

    create() {
        this.atom = new Atom(this);
        this.add.existing(this.atom);
    }

    update() {

    }

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#CCCCCC',
    width: C.GAME_WIDTH,
    height: C.GAME_HEIGHT,
    scene: Game
};

const game = new Phaser.Game(config);
