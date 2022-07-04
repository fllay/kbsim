<template>
  <b-modal
      id="mfcc-modal"
      centered
      size="md"
      title="MFCC"
      modal-class="my-modal-class"
      :hide-footer="false"
      @close="onClose"
      @hide="onClose"
    >
      <div class="display-screen">
        <canvas width="320" height="320" id="mfcc-canvas"></canvas>
      </div>
    </b-modal>
</template>
<script>
import { mapState, mapActions, mapMutations , mapGetters } from 'vuex';
import Meyda from "meyda";
export default {
  name : "InferenceModal",
  components:{
    
  },
  data(){
    return {
    }
  },
  computed: {
    ...mapState("project",["project"]),
    ...mapGetters("dataset",[ 'dataList','getBaseURL','positionOf']),
  },
  methods:{
    display(id){  
      console.log("show mfcc for id : ", id);
      this.$bvModal.show("mfcc-modal");
      this.$nextTick(()=>{
        this.render(id);
      });
    },
    render(id){
      let canvas = document.getElementById("mfcc-canvas");
      let ctx = canvas.getContext("2d");
      let audioCtx = new AudioContext();
      let audio = new Audio(`${this.getBaseURL}/${id}.wav`);
      audio.loop = false;
      let source = audioCtx.createMediaElementSource(audio);
      source.connect(audioCtx.destination);
      let startTime = 0;
      let duration = this.project.options.duration * 1000;
      let prevX = 0;
      let width = canvas.width;
      let height = canvas.height;
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioCtx,
        source: source,
        bufferSize: 512,
        featureExtractors: ["mfcc"],
        callback: (features) => {
          // if(startTime == 0){
          //   startTime = new Date();
          // }
          let esp = (new Date()) - startTime;
          let x = esp / duration * width;
          let h = height / features["mfcc"].length;
          let mfcc = features["mfcc"];
          for(let i in mfcc){
            let v = mfcc[i];
            //let color = this.colorTemperatureToRGB(v * 20000);
            ctx.fillStyle = `rgb(${((v * 100) | 0)}, 0, 0)`
            ctx.fillRect(prevX, i * h, x - prevX, h); 
          }
          prevX = x;
          //startTime = new Date();
        },
      });
      audio.addEventListener("ended",()=>{
        console.log("ended");
        analyzer.stop();
      });
      audio.addEventListener("play",()=>{
        console.log("played");
        analyzer.start();
        startTime = new Date();
      })
      audio.play();
    },
    colorTemperatureToRGB(kelvin){
        var temp = kelvin / 100;
        var red, green, blue;
        if( temp <= 66 ){ 
            red = 255; 
            green = temp;
            green = 99.4708025861 * Math.log(green) - 161.1195681661;
            if( temp <= 19){
                blue = 0;
            } else {
                blue = temp-10;
                blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
            }
        } else {
            red = temp - 60;
            red = 329.698727446 * Math.pow(red, -0.1332047592);
            green = temp - 60;
            green = 288.1221695283 * Math.pow(green, -0.0755148492 );
            blue = 255;
        }
        return {
            r : this.clamp(red,   0, 255),
            g : this.clamp(green, 0, 255),
            b : this.clamp(blue,  0, 255)
        }
    },
    clamp( x, min, max ) {
        if(x<min){ return min; }
        if(x>max){ return max; }
        return x;
    },
    onClose: async function(){
      
    },
  }
}
</script>
<style lang="scss" scoped>
  .display-screen {
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    canvas {
      padding: 5px;
      background-color: #333;
    }
  }
</style>