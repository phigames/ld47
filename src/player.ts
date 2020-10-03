import ElectronShell from "./shell";

export default class Player extends Phaser.GameObjects.Sprite {

    shell: ElectronShell;
    disabled: boolean;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, 0, 0, 'proton');
        this.displayWidth = this.displayHeight = 40;
        this.depth = 100;
        this.reset(shell);
    }

    calculateDisplayOriginX(distance: number) {
        return (-distance + this.displayWidth / 2) / this.scaleX;
    }

    jumpToShell(shell: ElectronShell) {
        if (this.disabled) {
            return;
        }
        let angleOffset = shell.angle - this.shell.angle;
        this.shell.remove(this);
        this.shell = shell;
        this.shell.add(this);
        this.angle -= angleOffset;
        this.disabled = true;
        this.scene.tweens.add({
            targets: this,
            displayOriginX: this.calculateDisplayOriginX(this.shell.radius),
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.disabled = false;
            },
        })
    }

    reset(outerShell: ElectronShell) {
        this.displayOriginX = this.calculateDisplayOriginX(outerShell.radius + 200);
        if (this.shell !== undefined) {
            this.shell.remove(this);
        }
        this.shell = outerShell;
        this.shell.add(this);
        this.disabled = true;
        this.scene.tweens.add({
            targets: this,
            displayOriginX: this.calculateDisplayOriginX(this.shell.radius),
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.disabled = false;
            },
        });
    }

}
