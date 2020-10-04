import 'phaser';
import {Atom} from "./atom";
import * as C from './constants';


export default class Game extends Phaser.Scene {

    atom: Atom;
    lives: number;
    lifeDisplay: Phaser.GameObjects.Container;
    elementDisplay: Phaser.GameObjects.Image;

    constructor() {
        super('game');
    }

    preload() {
        this.loadImage('titlescreen');
        this.loadImage('background');
        this.loadImage('electron');
        this.loadImage('proton');
        this.loadImage('ring');
        this.loadImage('life');
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
        let titleScreen = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'titlescreen');
        titleScreen.displayWidth = C.GAME_WIDTH;
        titleScreen.displayHeight = C.GAME_HEIGHT;
        titleScreen.setInteractive();

        this.input.keyboard.on('keydown', () => {
            this.input.keyboard.off('keydown');
            titleScreen.off('pointerdown');
            titleScreen.destroy();
            this.start();
        });
        titleScreen.on('pointerdown', () => {
            this.input.keyboard.off('keydown');
            titleScreen.off('pointerdown');
            titleScreen.destroy();
            this.start();
        });
    }

    update(time: number, delta: number) {
        if (this.atom !== undefined) {
            this.atom.update(time, delta);
        }
    }

    start() {
        let background = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'background');
        background.displayWidth = C.GAME_WIDTH;
        background.displayHeight = C.GAME_HEIGHT;

        this.lifeDisplay = new Phaser.GameObjects.Container(this, 70, 70);
        this.lifeDisplay.scale = C.GUI_SCALE;
        this.lives = C.INITIAL_LIVES + 1;
        this.removeLife();
        this.add.existing(this.lifeDisplay);

        this.elementDisplay = new Phaser.GameObjects.Image(this, C.GAME_WIDTH - 70, 70, null);
        this.elementDisplay.scale = C.GUI_SCALE;
        this.add.existing(this.elementDisplay);

        this.atom = new Atom(this);
        this.add.existing(this.atom);
    }

    removeLife() {
        this.lives--;
        this.lifeDisplay.removeAll();
        for (let i = 0; i < this.lives; i++) {
            let life = new Phaser.GameObjects.Image(this, i * 300, 0, 'life');
            this.lifeDisplay.add(life);
        }
        if (this.lives <= 0) {
            this.scene.start('gameover', {elementNumber: this.atom.elementNumber});
        }
    }

    updateElementDisplay(elementNumber:  number) {
        this.elementDisplay.setTexture('element' + elementNumber.toString());
    }

}


class TitleScreen extends Phaser.Scene {

    constructor() {
        super('title');
    }

    preload() {
        this.load.image('titlescreen', 'assets/titlescreen.png');
    }

    create() {
    }

}


class GameOverScreen extends Phaser.Scene {

    constructor() {
        super('gameover');
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png');
    }

    create(data: {elementNumber: number}) {
        console.log(data.elementNumber);
    }

}


const config = {
    type: Phaser.AUTO,
    width: C.GAME_WIDTH,
    height: C.GAME_HEIGHT,
    scene: [Game, GameOverScreen],
    scale: {
        mode: Phaser.Scale.FIT,
    },
};

const game = new Phaser.Game(config);
