<template>
  <div class="recorder-container d-flex align-items-center">
    <div v-if="recording" class="recorder-container-active"></div>
    <p v-if="counting > 0" class="counting-timer-p">
      {{ counting }}
    </p>
    <div v-show="id == null" class="full">
      <canvas id="waveform-client"></canvas>
    </div>
    <div v-show="id != null" class="full">
      <WaveFormPlayer 
      :id="id" 
      sound_ext="wav" 
      img_ext="jpg" 
      :delay="project.options.duration" 
      :ref="`wavsuf`"
      :mute="true"
      >
      </WaveFormPlayer>
    </div>
    <div class="recorder-wrap">
      <div class="vol-adj d-flex">
        <img
          src="~/assets/images/UI/svg/volume-up.svg"
          height="16"
          class="op-btn"
        />
        <b-form-input
          type="range"
          v-model="volume"
          @change="(v)=>$emit('volumeChange',parseFloat(v))"
          min="0"
          max="1"
          step="0.1"
        ></b-form-input>
      </div>
      <div class="time-counter">
        <span class="current-time">{{
          timeCurrent ? timeCurrent + ":00": "0:00"
        }}</span
        ><span>/ {{ project.options.duration }}:00</span>
      </div>
    </div>
  </div>
</template>
<script>
import WaveFormPlayer from "./WaveFormPlayer.vue";
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
  components: {
    WaveFormPlayer
  },
  props: ["id"],
  // model: {
  //     prop: 'myInput',
  //     event: 'blur'
  // },
  data() {
    return {
      recording : false,
      volume: 0.5,
      timeCurrent: 0,
      timeCounter : null,
      counting: 0,
      recorder : null,
      activeIndex:0,
      audioContext: null,
      audioSource: null,
      audioGain: null,
    };
  },
  computed: {
    ...mapState('project', ['project']),
    ...mapState(['currentDevice']),
    isBrowser(){
      return this.currentDevice === "BROWSER";
    }
  },
  methods: {
    draw(audioCtx, mediaStreamSource, time){
      return new Promise((resolve,reject)=>{
        let canvas = document.getElementById("waveform-client");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = '#FFA500';
        ctx.imageSmoothingEnabled = false;
        let analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        mediaStreamSource.connect(analyser);
        let w = canvas.width;
        let h = canvas.height;
        let startTime = new Date();
        let sectionData = [];
        let prevX = 0;
        function animate(){
          let esp = (new Date()) - startTime;
          let progressWidth = esp / time * w;
          analyser.getByteTimeDomainData(dataArray);
          let v = Math.max.apply(null,dataArray) - 128; // max  
          let actualHigh = v / 256 * h * 1.5 + 3;
          ctx.fillRect(prevX, (h - actualHigh) / 2, progressWidth - prevX, actualHigh);
          prevX = progressWidth;
          if(esp < time){
            requestAnimationFrame(animate);
          }else{
            mediaStreamSource.disconnect(analyser);
            return resolve(sectionData);
          }
        }
        requestAnimationFrame(animate);
      });
    },
    async recordComplete(rec,blob){
      console.log("recorded");
      let img = await this.downloadPreview();
      this.$emit("recorded", {sound : blob, preview : img});
      this.clearCanvas();
    },
    downloadPreview(){
      return new Promise(resolve=>{
        const tmpCanvas = document.getElementById("waveform-client");
        tmpCanvas.toBlob(resolve, "image/jpeg", 0.8);
      });
    },
    async initRecord(){
      this.audioContext = new AudioContext();
      this.audioGain = this.audioContext.createGain();
      this.audioGain.gain.value = this.volume; // setting it to 10%
      this.audioGain.connect(this.audioContext.destination);
      try{
        let stream = await navigator.mediaDevices.getUserMedia({audio: true,video: false});
        this.audioSource = this.audioContext.createMediaStreamSource(stream);
        //stop the input from playing back through the speakers
        this.recorder = new WebAudioRecorder(this.audioSource, {
            workerDir: "js/",
            encoding: "wav",
            timeLimit: 3,
            encodeAfterRecord: true,
        });
        this.recorder.onComplete = await this.recordComplete.bind(this);
        return true;
      }catch(err){
        console.log(err);
        return false;
      }
    },
    clearCanvas(){
      let canvas = document.getElementById("waveform-client");
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
    async record(){
      if(!this.audioContext){
        let res = await this.initRecord();
        if(!res){
          return;
        }
      }
      this.clearCanvas();
      //--------- countdown --------//
      this.counting = 3;
      await this.$helper.sleep(1000);
      this.counting = 2;
      await this.$helper.sleep(1000);
      this.counting = 1;
      await this.$helper.sleep(1000);
      this.counting = 0;
      //------------ start ----------//
      this.recording = true;
      console.log("=== start record ===");
      this.$emit("onRecording");
      //--------------------------- //
      //this.audioSource.connect(this.audioContext.destination); //get the encoding
      this.recorder.startRecording();
      this.startTimer();
      
      await this.draw(this.audioContext, this.audioSource, this.project.options.duration * 1000);
      
      this.stopTimer();
      this.recorder.finishRecording();
      //this.audioSource.disconnect(this.audioContext.destination); //get the encoding
      //--------------------------- //      
      this.$emit("onStopRecord");
      //await this.$helper.sleep(this.project.options.delay);
      //--------------------------- //
      this.recording = false;
      console.log("=== end record ===");
    },
    async simulatePlay(){
      if(this.$refs.wavsuf){
        this.startTimer();
        await this.$refs.wavsuf.play();
        this.stopTimer();
      }
    },
    startTimer(){
      this.timeCurrent = 0;
      this.timeCounter  = setInterval(()=>{
        this.timeCurrent += 1;
      },1000);
    },
    stopTimer(){
      clearInterval(this.timeCounter);
    }
  }
}
</script>
<style scoped lang="scss">
$primary-color: #007e4e;
.counting-timer-p{
  color: #6b6b6b;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 120px;
  position: absolute;
}
.recorder-container {
  background: #333333;
  width: 100%;
  height: 250px;
  position: relative;
  .recorder-wrap {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 30px;
    left: 30px;
    z-index: 1;
    .vol-adj {
      background-color: #fff;
      border-radius: 19px;
      padding: 10px 20px;
      box-shadow: 0 0 10px #33333333;
      margin-right: 10px;
      display: flex;
      align-items: center;
      img {
        margin-right: 0.3em;
      }
      input[type="range"] {
        width: 60px;
      }
    }
    .time-counter {
      background-color: #fff;
      border-radius: 19px;
      padding: 10px 20px;
      box-shadow: 0 0 10px #33333333;
      span {
        font-weight: bold;
      }
      .current-time {
        color: $primary-color;
        padding-right: 5px;
      }
    }
    .rec-counter {
      background-color: #fff;
      border-radius: 19px;
      padding: 10px 20px;
      box-shadow: 0 0 10px #33333333;
      color: $primary-color;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
}
.recorder-container-active {
  border: 10px solid #007e4e !important;
  position: absolute;
  width: 100%;
  height: 100%;
}
.full {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>