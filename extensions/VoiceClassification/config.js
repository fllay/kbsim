export default {
  id: "VOICE_CLASSIFICATION",
  name: "Voice Classification",
  title: "Time series: การแยกแยะเสียง (Voice Classification)",
  type: "Classifier",
  description: "",
  config: {}, // not use yet
  options: {
    //json of pre-config Model Design
    duration: {
      type: "number", //ref to https://bootstrap-vue.org/docs/components/form-input#input-type
      required: true,
      title: "Duration (s)",
      description: "ช่วงเวลาของคำ 1 คำ (มีค่าตั้งแต่ 1-3 วินาที)",
      attributes: {
        min: 1,
        max: 3,
        step: 1,
        required: true,
      },
      value: 1, //default value
    },
    delay: {
      type: "number",
      required: true,
      title: "Delay (ms)",
      description: "ช่วงเวลาพักหายใจ หรือ ช่วงเว้นว่างระหว่างคำ (0 - 3000 ms)",
      attributes: {
        min: 1,
        max: 3000,
        step: 1,
        required: true,
      },
      value: 1000,
    },
  },
  // model: {}, // json of pre-config Model Design, this will register auto by ExtensionManager
  instructions: {
    capture: "VoiceClassification/Instructions/CaptureInstruction.vue",
    annotate: "VoiceClassification/Instructions/AnnotateInstruction.vue",
    train: "VoiceClassification/Instructions/TrainInstruction.vue",
  },
  //components : ['image_classification/components/Capture.vue'] // this will register auto by ExtensionManager
};
