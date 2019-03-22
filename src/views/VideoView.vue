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
      autoplay
    ></video>

    <Three360Canvas
      :videoIsReady="videoIsLoaded"
      :fov="fov"
      videoTagId="video-source"
    ></Three360Canvas>
    <!-- <v-card class="camera-controls">
      <v-card-title>
        <h3>
          Titta runt genom att klicka och dra i bilden. Gör kamera-dollying med
          scroll-hjulet. Använd reglaget nedan för att zooma.
        </h3>
      </v-card-title>
      <v-card-actions>
        <v-slider
          v-model="fov"
          min="20"
          max="200"
          thumb-label
          label="Field of view"
        ></v-slider>
      </v-card-actions>
    </v-card> -->
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Three360Canvas from '@/components/Three360Canvas.vue';
// import * as red5pro from '@/js/red5pro';
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
  // private videoUrl: string = 'http://188.166.5.71:1935/live/detu/playlist.m3u8';
  private videoUrl: string =
    'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8';
  // 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
  private videoTag!: HTMLVideoElement;
  // private threeContainer!: HTMLDivElement;
  // private threeCanvas!: HTMLCanvasElement;
  // private scene!: THREE.Scene;
  // private camera: any = null;
  // private renderer: any = null;
  // private controls: any = null;
  // private effect: any = null;
  private fov: number = 50;
  // private cameraDistance: number = 70;
  private buttonState: boolean = false;
  private videoIsLoaded = false;

  private streamName: string = 'mystream';

  private mounted() {
    this.videoTag = <HTMLVideoElement>this.$refs.videoTag;

    if (this.$route.query) {
      if (this.$route.query.videourl) {
        this.videoUrl = <string>this.$route.query.videourl;
      }

      if (this.$route.query.streamname) {
        this.streamName = <string>this.$route.query.streamname;
      }
    }

    if (this.videoUrl.endsWith('.m3u8')) {
      this.setupHls(this.videoTag);
    } else if (this.videoUrl.endsWith('.mp4')) {
      this.videoTag.src = this.videoUrl;
      this.videoTag.play();
    } else {
      this.setupRed5Pro(this.videoUrl);
    }

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
    // console.log(video);
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

  private setupRed5Pro(videoUrl: string) {
    console.log('initializing red5prosdk');
    console.log(red5prosdk);
    let subscriber = new red5prosdk.RTCSubscriber();

    red5prosdk.setLogLevel(red5prosdk.LOG_LEVELS.TRACE); // red5prosdk.LOG_LEVELS.WARN

    // Create a view instance based on video element id.
    let viewer = new red5prosdk.PlaybackView('video-source');
    // viewer.addEventListener('loadedmetadata', () => {
    //   viewer.play();
    // });

    // Attach the subscriber to the view.
    viewer.attachSubscriber(subscriber);

    // Using Chrome/Google TURN/STUN servers.
    var iceServers = [{ urls: 'stun:stun2.l.google.com:19302' }];

    // Initialize
    subscriber
      .init({
        protocol: 'wss',
        host: this.videoUrl,
        port: 443,
        app: 'live',
        streamName: this.streamName,
        iceServers: iceServers,
        subscriptionId:
          'subscriber-' + Math.floor(Math.random() * 0x10000).toString(16),
        rtcpMuxPolicy: 'negotiate',
      })
      .then(function() {
        // Invoke the playback action
        // subscriber.play();
        return subscriber.subscribe();
        // return subscriber.play();
      })
      .catch(function(error: any) {
        // A fault occurred while trying to initialize and subscribe to the stream.
        console.error(error);
      });
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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
