import ElectronShell from "./shell";

export default class Player extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;
    shell: ElectronShell;
    disabled: boolean;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'proton');
        this.sprite.displayWidth = this.sprite.displayHeight = 40;
        this.add(this.sprite);
        this.depth = 100;
        this.reset(shell);
    }

    jumpToShell(newShell: ElectronShell) {
        if (this.disabled) {
            return;
        }
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: newShell.radius,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                let angleOffset = newShell.angle - this.shell.angle;
                this.shell.remove(this);
                this.shell = newShell;
                this.shell.add(this);
                this.angle -= angleOffset;
                this.disabled = false;
            },
        });
    }

    jumpToKernel(nextLevel: () => void) {
        if (this.disabled) {
            return;
        }
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: 0,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.shell.remove(this);
                this.shell = null;
                this.disabled = false;
                nextLevel();
            },
        });
    }

    reset(outerShell: ElectronShell) {
        this.sprite.x = outerShell.radius + 200;
        this.angle = 90;
        if (this.shell != null) {
            this.shell.remove(this);
        }
        this.shell = outerShell;
        this.shell.add(this);
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.shell.radius,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.disabled = false;
            },
        });
    }

}
