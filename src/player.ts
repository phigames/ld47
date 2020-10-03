import ElectronShell from "./shell";

export default class Player extends Phaser.GameObjects.Sprite {

    shell: ElectronShell;
    invulnerable: boolean;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, 0, 0, 'proton');
        this.scale = 0.1;
        this.depth = 100;
        this.reset(shell);
    }

    jumpToShell(shell: ElectronShell) {
        this.shell.remove(this);
        this.shell = shell;
        this.shell.add(this);
        this.scene.tweens.add({
            targets: this,
            x: this.shell.radius,
            duration: 500,
            ease: 'Quad.easeOut',
        })
    }

    reset(outerShell: ElectronShell) {
        this.x = outerShell.radius + 200;
        this.invulnerable = true;
        if (this.shell !== undefined) {
            this.shell.remove(this);
        }
        this.shell = outerShell;
        this.shell.add(this);
        this.scene.tweens.add({
            targets: this,
            x: this.shell.radius,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.invulnerable = true;
            },
        });
    }

}
