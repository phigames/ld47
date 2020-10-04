import * as C from "./constants";


export default class Kernel extends Phaser.GameObjects.Container {

    nextAngle: number;
    nextDistance: number;
    totalProtons: number;

    constructor(scene: Phaser.Scene, numProtons: number) {
        super(scene);
        this.nextAngle = 0;
        this.nextDistance = 0;
        this.totalProtons = 0;
        for (let i = 0; i < numProtons; i++) {
            this.addProton(false);
        }
        this.scene.tweens.add({
            targets: this,
            angle: -360,
            duration: 5000,
            repeat: -1,
        });
    }

    addProton(animate: boolean = true) {
        let radians = this.nextAngle * (Math.PI / 180);
        let proton = new Phaser.GameObjects.Image(this.scene, Math.cos(radians) * this.nextDistance, Math.sin(radians) * this.nextDistance, 'proton');
        proton.displayWidth = proton.displayHeight = C.PROTON_SIZE;
        proton.angle = Math.random() * 360;
        this.addAt(proton, 0);
        this.totalProtons++;
        this.nextAngle += 222.5;
        this.nextDistance += 20 / this.totalProtons ** 2;

        if (animate) {
            this.scene.tweens.add({
                targets: this,
                scale: 1.3,
                duration: 100,
                yoyo: true,
            })
        }
    }

}
