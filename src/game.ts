import 'phaser';
import {Atom} from "./atom";

export class Game extends Phaser.Scene {

    atom: Atom;

    constructor() {
        super('game');
    }

    preload() {
    }

    create() {
        this.atom = new Atom(this);
    }

    update() {

    }

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Game
};

const game = new Phaser.Game(config);
