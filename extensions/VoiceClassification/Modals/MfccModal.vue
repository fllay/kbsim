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
        <b-img-lazy class="thumb" :src="`${getBaseURL}/${id}_mfcc.jpg`" alt="" srcset="">
        </b-img-lazy>
      </div>
    </b-modal>
</template>
<script>
import { mapState, mapActions, mapMutations , mapGetters } from 'vuex';
export default {
  name : "InferenceModal",
  components:{
    
  },
  data(){
    return {
      id : null,
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
        this.id = id;
      });
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