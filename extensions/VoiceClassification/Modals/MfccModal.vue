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
    async display(id){
      console.log("show mfcc for id : ", id);
      this.$bvModal.show("mfcc-modal");
      let audioCtx = new AudioContext();
      let audio = new Audio(`${this.getBaseURL}/${id}.wav`);
      let source = audioCtx.createMediaElementSource(audio);
      source.connect(audioCtx.destination);
      const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: 512,
    featureExtractors: ["rms"],
    callback: (features) => {
      console.log(features);
    },
  });
  analyzer.start();
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
    margin-top: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>