<template>
  <div class="home">
    <video
      onkeydown="this.paused? this.play(): this.pause()"
      onclick="this.paused? this.play(): this.pause()"
      @loadeddata="videoLoaded()"
      ref="videoTag"
      id="video-source"
      muted
      controls
      loop
    ></video>
    <!-- <div class="three-container" ref="threeContainer">
      <canvas class="three-canvas" ref="threeCanvas"></canvas>
    </div> -->
    <Three360Canvas
      :videoIsReady="videoIsLoaded"
      :fov="fov"
      videoTagId="video-source"
    ></Three360Canvas>
    <v-card class="camera-controls">
      <v-card-title
        ><h3>
          Titta runt genom att klicka och dra i bilden. Gör kamera-dollying med
          scroll-hjulet. Använd reglaget nedan för att zooma.
        </h3></v-card-title
      >
      <v-card-actions>
        <v-slider
          v-model="fov"
          min="20"
          max="200"
          thumb-label
          label="Field of view"
        ></v-slider>
      </v-card-actions>
      <!-- <v-card-actions>
        <v-btn v-on:click="buttonState = !buttonState">Video is playing</v-btn>
      </v-card-actions> -->
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Three360Canvas from '@/components/Three360Canvas.vue';
// import * as THREE from 'three';
// import { OrbitControls } from 'three-orbitcontrols-ts';
import Hls from 'hls.js';

@Component({
  components: {
    HelloWorld,
    Three360Canvas,
  },
})
export default class VideoView extends Vue {
  private videoUrl: string =
    'https://wowzaprod254-i.akamaihd.net/hls/live/767623/347fc50a/playlist.m3u8';
  // 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8';
  // 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
  // private videoUrl: string = 'https://wowzaprod200-i.akamaihd.net/hls/live/755582/c77e8264/playlist.m3u8';
  // private videoUrl: string = 'https://wowzaprod252-i.akamaihd.net/hls/live/759094/aada032e/playlist.m3u8';
  private videoTag!: HTMLVideoElement;
  // private threeContainer!: HTMLDivElement;
  // private threeCanvas!: HTMLCanvasElement;
  // private scene!: THREE.Scene;
  // private camera: any = null;
  // private renderer: any = null;
  // private controls: any = null;
  // private effect: any = null;
  private fov: number = 108;
  // private cameraDistance: number = 70;
  private buttonState: boolean = false;
  private videoIsLoaded = false;

  private mounted() {
    this.videoTag = <HTMLVideoElement>this.$refs.videoTag;

    this.setupHls(this.videoTag);
    document.addEventListener('keypress', e => {
      // console.log('key:');
      // console.log(e);
      if (e.code === 'Space') {
        this.videoTag.paused ? this.videoTag.play() : this.videoTag.pause();
      }
    });

    // this.threeContainer = <HTMLDivElement>this.$refs.threeContainer;
    // this.threeCanvas = <HTMLCanvasElement>this.$refs.threeCanvas;
    // this.initThreeScene();
    // this.videoToSphere(this.videoTag);
  }

  public videoLoaded() {
    // console.log('video was loaded');
    this.videoIsLoaded = true;
  }

  private setupHls(videoTag: HTMLVideoElement) {
    // var video = document.getElementById('video');
    const video = videoTag;
    console.log(video);
    if (Hls.isSupported()) {
      // console.log('media source extension is supported');
      const hls = new Hls();
      hls.loadSource(this.videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('manifest parsed');
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }

  // private videoToSphere(videoTag: HTMLVideoElement) {
  //   // for (i = 0; i < scene.children.length; i++) {
  //   //   if (scene.children[i].stitchBall === true) {
  //   //     scene.remove(scene.children[i]);
  //   //     //console.log("remove");
  //   //   }
  //   // }

  //   let video: any = videoTag;
  //   let texture: any = new THREE.VideoTexture(video);
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.format = THREE.RGBFormat;

  //   let geometry: any = new THREE.SphereGeometry(100, 32, 32, 0);
  //   //console.log(geometry);
  //   geometry.scale(-1, 1, 1);

  //   // geometry.rotateZ(-Math.PI / 2);
  //   // geometry.rotateZ(stitchHelper.stitchPreSets[stitchHelper.currentMode].rotateZ); //-Math.PI / 2);
  //   geometry.rotateY(-Math.PI / 2);
  //   let material = new THREE.MeshBasicMaterial({ map: texture });
  //   let mesh = new THREE.Mesh(geometry, material);
  //   // mesh.stitchBall = true;
  //   this.scene.add(mesh);
  // }

  // private initThreeScene() {
  //   this.scene = new THREE.Scene();
  //   // this.threeContainer = <HTMLDivElement>this.$refs.threeContainer;
  //   let width = this.threeContainer.offsetWidth;
  //   let height = this.threeContainer.offsetHeight;
  //   let fov = this.fov;
  //   let aspect = width / height;
  //   let near = 0.01;
  //   let far = 4000;
  //   this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //   // this.camera.position.set(0, 0, 0.001);
  //   this.camera.position.set(0, this.cameraDistance, 0);

  //   // Test object
  //   // let demoGeometry = new THREE.SphereGeometry(5,16,16);
  //   // let demoMaterial = new THREE.MeshBasicMaterial({ color : 0xFF9900, transparent: true, opacity: 0.5, wireframe:true });
  //   // let mesh = new THREE.Mesh(demoGeometry, demoMaterial);
  //   // scene.add(mesh);

  //   this.renderer = new THREE.WebGLRenderer({
  //     alpha: true,
  //     canvas: this.threeCanvas,
  //   });
  //   this.renderer.setClearColor(0x000055, 0);
  //   this.renderer.setSize(width, height);
  //   // let rendererDom = this.renderer.domElement;
  //   // rendererDom.className = 'three-canvas';
  //   // this.threeContainer.appendChild(rendererDom);

  //   // window.addEventListener('resize', () => {
  //   //   this.resizeScene();
  //   // });

  //   // this.effect = new THREE.StereoEffect(renderer);
  //   // this.effect.setSize(width, height);

  //   // var directionalLight = new THREE.DirectionalLight(0xffffff);
  //   // directionalLight.position.set(0, 0.7, 0.7);
  //   // this.scene.add(directionalLight);

  //   this.controls = new OrbitControls(this.camera, this.threeCanvas);
  //   this.controls.noPan = true;
  //   this.controls.enableZoom = true;
  //   this.controls.zoomSpeed = 2;
  //   this.controls.rotateSpeed = 0.1;
  //   this.controls.enableDamping = true;
  //   // this.controls.autoRotate = true;

  //   // function setOrientationControls(e) {
  //   //   if (e) {
  //   //     //detect if the device support orientation
  //   //     if (!e.alpha) {
  //   //       return;
  //   //     }
  //   //   }

  //   //   HUDSystem.switchGyroMode();
  //   //   controls = new THREE.DeviceOrientationControls(camera, true);

  //   //   document.body.addEventListener('touchend', this.fullscreen);
  //   //   window.removeEventListener(
  //   //     'deviceorientation',
  //   //     setOrientationControls,
  //   //     true
  //   //   );
  //   // }

  //   //controls.enableDamping = true; // Damp is not recommeded;
  //   //controls.dampingFactor = 0.32;

  //   // window.addEventListener('deviceorientation', setOrientationControls, true);

  //   this.animateLoop();
  //   // this.updateScene();
  // }

  // private updateScene() {
  //   // if (!settingDB.headset) {
  //   //   this.renderer.render(this.scene, this.camera);
  //   // } else {
  //   //   effect.render(scene, camera);
  //   // }

  //   this.controls.update();
  //   this.renderer.render(this.scene, this.camera);
  // }

  // private resizeScene() {
  //   this.camera.aspect =
  //     this.threeContainer.clientWidth / this.threeContainer.clientHeight;
  //   // this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(
  //     this.threeContainer.clientWidth,
  //     this.threeContainer.clientHeight
  //   );
  // }

  // // private fullscreen() {
  // //   //console.log("hi");
  // //   if (this.threeContainer.requestFullscreen) {
  // //     this.threeContainer.requestFullscreen();
  // //   } else if (this.threeContainer.msRequestFullscreen) {
  // //     this.threeContainer.msRequestFullscreen();
  // //   } else if (this.threeContainer.mozRequestFullScreen) {
  // //     this.threeContainer.mozRequestFullScreen();
  // //   } else if (this.threeContainer.webkitRequestFullscreen) {
  // //     this.threeContainer.webkitRequestFullscreen();
  // //   }
  // // }

  // private animateLoop() {
  //   requestAnimationFrame(this.animateLoop);
  //   // HUDSystem.update();

  //   this.updateScene();
  // }
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
}

.camera-controls {
  padding: 2rem;
  box-sizing: border-box;
  grid-column-start: 2;
  border-radius: 1rem;
}

video {
  width: 100%;
  // display: none;
  border-radius: 1rem;
}

// .three-container {
//   width: 100%;
//   // height: 100%;
// }

// .three-canvas {
//   border-radius: 1rem;
// }
</style>
