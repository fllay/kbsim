<template>
  <modal
    id="unity-modal"
    name="unity-modal"
    :draggable="true"
    :clickToClose="false"
    :width="1000"
    :height="700"
  >
    <div>
      <button v-on:click="hide">hide</button>
      <unity
        ref="gameInstance"
        src="/Build/VK Build.json"
        width="1000"
        height="600"
        unityLoader="/Build/UnityLoader.js"
      ></unity>
      <button v-on:click="onClickF()">Forward</button>
      <button v-on:click="onClickB()">Backward</button>
      <button v-on:click="onClickL()">TurnLeft</button>
      <button v-on:click="onClickR()">TurnRight</button>
      <button v-on:click="onClickS()">Stop</button>
      <p id="ImgBase64">0</p>
    </div>
  </modal>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

import VModal from "vue-js-modal";
import Unity from "vue-unity-webgl";

export default {
  name: "Unity_view",
  components: {
    VModal,
    Unity,
  },
  computed: {},
  methods: {
    hide: function () {
      this.$modal.hide("unity-modal");
    },
    onClickF() {
      this.$refs.gameInstance.message(
        "CameraVK",
        "KanomchanLinearDirec",
        "0.15"
      );
      this.$refs.gameInstance.message("CameraVK", "KanomchanAngularDirec", "0");
    },
    onClickB() {
      this.$refs.gameInstance.message(
        "CameraVK",
        "KanomchanLinearDirec",
        "-0.15"
      );
      this.$refs.gameInstance.message("CameraVK", "KanomchanAngularDirec", "0");
    },
    onClickL() {
      this.$refs.gameInstance.message(
        "CameraVK",
        "KanomchanAngularDirec",
        "0.4"
      );
      this.$refs.gameInstance.message("CameraVK", "KanomchanLinearDirec", "0");
    },
    onClickR() {
      this.$refs.gameInstance.message(
        "CameraVK",
        "KanomchanAngularDirec",
        "-0.4"
      );
      this.$refs.gameInstance.message("CameraVK", "KanomchanLinearDirec", "0");
    },
    onClickS() {
      this.$refs.gameInstance.message("CameraVK", "KanomchanLinearDirec", "0");
      this.$refs.gameInstance.message("CameraVK", "KanomchanAngularDirec", "0");
    },
    ImgStream(value)
    {
          document.getElementById("ImgBase64").innerHTML = value;
    }
  },
};
</script>
