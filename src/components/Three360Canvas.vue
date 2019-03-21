<template>
  <div class="three-container" ref="threeContainer">
    <canvas class="three-canvas" ref="threeCanvas"></canvas>
    <div id="video-overlay">
      <div class="video-button-grid">
        <v-btn class="right" flat icon>
          <v-icon @click="fullscreen()">fullscreen</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import * as THREE from 'three';
import { WEBVR } from '@/js/WebVR';
import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
  components: {},
  props: {
    // fov: Number,
    // videoElement: HTMLVideoElement,
  },
})
export default class Three360Canvas extends Vue {
  private threeContainer!: HTMLDivElement;
  private threeCanvas!: HTMLCanvasElement;
  private scene!: THREE.Scene;
  private camera: any = null;
  private renderer: any = null;
  private controls: any = null;
  private effect: any = null;
  // private fov: number = 108;
  private cameraDistance: number = 70;
  private videoElement!: HTMLVideoElement;

  @Prop({ default: 20 })
  fov!: number;

  @Prop({ default: true })
  videoIsReady!: boolean;

  @Watch('videoIsReady')
  videoReadyChanged(newValue: boolean, oldValue: boolean) {
    if (newValue == true) {
      this.start3D();
    }
  }

  // @Prop({ default: null })
  // videoElement!: HTMLVideoElement;

  @Prop({ default: '' })
  videoTagId!: string;

  @Watch('fov')
  onFovChanged(newValue: number, oldValue: number) {
    this.camera.fov = newValue;
    this.camera.updateProjectionMatrix();
  }

  private mounted() {
    this.videoElement = <HTMLVideoElement>(
      document.getElementById(this.videoTagId)
    );
    this.threeContainer = <HTMLDivElement>this.$refs.threeContainer;
    this.threeCanvas = <HTMLCanvasElement>this.$refs.threeCanvas;

    document.addEventListener('keypress', e => {
      if (e.key === 'f') {
        console.log('f was pressed');
        this.threeCanvas.requestFullscreen();
      }
    });
  }

  private start3D() {
    this.initThreeScene();
    this.videoToSphere(this.videoElement);
  }

  private videoToSphere(videoTag: HTMLVideoElement) {
    // for (i = 0; i < scene.children.length; i++) {
    //   if (scene.children[i].stitchBall === true) {
    //     scene.remove(scene.children[i]);
    //     //console.log("remove");
    //   }
    // }

    let video: any = videoTag;
    let texture: any = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    let geometry: any = new THREE.SphereGeometry(100, 32, 32, 0);
    //console.log(geometry);
    geometry.scale(-1, 1, 1);

    // geometry.rotateZ(-Math.PI / 2);
    // geometry.rotateZ(stitchHelper.stitchPreSets[stitchHelper.currentMode].rotateZ); //-Math.PI / 2);
    geometry.rotateY(-Math.PI / 2);
    let material = new THREE.MeshBasicMaterial({ map: texture });
    let mesh = new THREE.Mesh(geometry, material);
    // mesh.stitchBall = true;
    this.scene.add(mesh);
  }

  private initThreeScene() {
    this.scene = new THREE.Scene();
    // this.threeContainer = <HTMLDivElement>this.$refs.threeContainer;
    let width = this.threeContainer.offsetWidth;
    let height = this.threeContainer.offsetHeight;
    let fov = this.fov;
    let aspect = width / height;
    let near = 0.01;
    let far = 4000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // this.camera.position.set(0, 0, 0.001);
    this.camera.position.set(0, this.cameraDistance, 0);

    // Test object
    // let demoGeometry = new THREE.SphereGeometry(5,16,16);
    // let demoMaterial = new THREE.MeshBasicMaterial({ color : 0xFF9900, transparent: true, opacity: 0.5, wireframe:true });
    // let mesh = new THREE.Mesh(demoGeometry, demoMaterial);
    // scene.add(mesh);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.threeCanvas,
    });
    this.renderer.setClearColor(0x000055, 0);
    this.renderer.setSize(width, height);
    // let rendererDom = this.renderer.domElement;
    // rendererDom.className = 'three-canvas';
    // this.threeContainer.appendChild(rendererDom);

    // window.addEventListener('resize', () => {
    //   this.resizeScene();
    // });

    // this.effect = new THREE.StereoEffect(renderer);
    // this.effect.setSize(width, height);

    // var directionalLight = new THREE.DirectionalLight(0xffffff);
    // directionalLight.position.set(0, 0.7, 0.7);
    // this.scene.add(directionalLight);

    // console.log('browser VR support:');
    // console.log(WEBVR.isVRSupported());

    // console.log('searching vr:');
    if (this.$route.query && this.$route.query.novr == 'true') {
      console.log('No VR requested. Skipping vr initialization');
    } else {
      WEBVR.isVRFound()
        .then((value: any) => {
          console.log('vr resolved: ' + value);
          this.renderer.vr.enabled = true;
          document.body.appendChild(
            WEBVR.createButton(this.renderer, {
              frameOfReferenceType: 'head-model',
            })
          );
        })
        .catch((value: any) => {
          console.log('rejected: ' + value);
        });
    }

    this.controls = new OrbitControls(this.camera, this.threeCanvas);
    this.controls.noPan = true;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 2;
    this.controls.rotateSpeed = 0.1;
    this.controls.enableDamping = true;
    // this.controls.autoRotate = true;

    // function setOrientationControls(e) {
    //   if (e) {
    //     //detect if the device support orientation
    //     if (!e.alpha) {
    //       return;
    //     }
    //   }

    //   HUDSystem.switchGyroMode();
    //   controls = new THREE.DeviceOrientationControls(camera, true);

    //   document.body.addEventListener('touchend', this.fullscreen);
    //   window.removeEventListener(
    //     'deviceorientation',
    //     setOrientationControls,
    //     true
    //   );
    // }

    //controls.enableDamping = true; // Damp is not recommeded;
    //controls.dampingFactor = 0.32;

    // window.addEventListener('deviceorientation', setOrientationControls, true);

    this.animateLoop();
    // this.updateScene();
  }

  private updateScene() {
    // if (!settingDB.headset) {
    //   this.renderer.render(this.scene, this.camera);
    // } else {
    //   effect.render(scene, camera);
    // }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private resizeScene() {
    this.camera.aspect =
      this.threeContainer.clientWidth / this.threeContainer.clientHeight;
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.threeContainer.clientWidth,
      this.threeContainer.clientHeight
    );
  }

  private fullscreen() {
    //   //console.log("hi");
    //   if (this.threeContainer.requestFullscreen) {
    this.threeCanvas.requestFullscreen();
    //   } else if (this.threeContainer.msRequestFullscreen) {
    //     this.threeContainer.msRequestFullscreen();
    //   } else if (this.threeContainer.mozRequestFullScreen) {
    //     this.threeContainer.mozRequestFullScreen();
    //   } else if (this.threeContainer.webkitRequestFullscreen) {
    //     this.threeContainer.webkitRequestFullscreen();
    //   }
  }

  private animateLoop() {
    // requestAnimationFrame(this.animateLoop);
    // // HUDSystem.update();
    // this.updateScene();

    this.renderer.setAnimationLoop(this.updateScene);
  }
}
</script>

<style lang="scss" scoped>
.three-container {
  width: 100%;
  position: relative;
  // height: 100%;
}

#video-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba(20, 20, 255, 0.2);
  z-index: 200;
  pointer-events: none;
}

#video-overlay * {
  z-index: 400;
  pointer-events: all;
}

.video-button-grid {
  // background-color: rgba(0, 200, 50, 0.2);
  position: absolute;
  bottom: 0;
  width: 100%;
  float: right;
  // display: grid;
  // grid
}

// .video-button-grid .right {
//   float: right;
// }

.three-canvas {
  border-radius: 1rem;
}
</style>
