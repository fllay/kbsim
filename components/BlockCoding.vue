<template>
  <div
    class="d-flex flex-fill flex-column"
    style="background-color: white"
  >
    <div class="blockly" ref="blocklyDiv"></div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations , mapGetters } from "vuex";
import Blockly from "blockly";
import blocklyPython from "blockly/python";
export default {
  name: "BlocklyComponent",
  props: {
    isRunning: Boolean,
  },
  data() {
    return {
      blockly_woakspace: null,
      blockly_xml: "",
      code : "",
    };
  },
  methods: {
    clear(){

    },
    getCode(){

    },
    
  },
  computed: {
    ...mapState(["currentDevice","serverUrl","streamUrl"]),
    updateXML: function () {
      console.log("Update XML to workspace");
      this.blockly_woakspace.clear();
      let textToDom = Blockly.Xml.textToDom(this.blockly_xml);
      Blockly.Xml.domToWorkspace(this.blockly_woakspace, textToDom);
    },
  },
  mounted() {
    const base_blocks = `<xml ref="toolbox" style="display: none">
      <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <category name="If">
        <block type="controls_if"></block>
        <block type="controls_if">
          <mutation else="1"></mutation>
        </block>
        <block type="controls_if">
          <mutation elseif="1" else="1"></mutation>
        </block>
      </category>
      <category name="Boolean" colour="%{BKY_LOGIC_HUE}">
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
      </category>
    </category>
    <category name="Loops" colour="%{BKY_LOOPS_HUE}">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <field name="VAR">i</field>
        <value name="FROM">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="TO">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
        <value name="BY">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
    </category>
    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic"></block>
      <block type="math_single"></block>
      <block type="math_trig"></block>
      <block type="math_constant"></block>
      <block type="math_number_property"></block>
      <block type="math_round"></block>
      <block type="math_on_list"></block>
      <block type="math_modulo"></block>
      <block type="math_constrain">
        <value name="LOW">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="HIGH">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="TO">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
      </block>
      <block type="math_random_float"></block>
      <block type="math_atan2"></block>
    </category>
    <category name="Text" colour="%{BKY_TEXTS_HUE}">
    <block type="text"></block>
    <block type="text_length"></block>
    <block type="text_print"></block>
</category>
    <category name="Lists" colour="%{BKY_LISTS_HUE}">
      <block type="lists_create_empty"></block>
      <block type="lists_create_with"></block>
      <block type="lists_repeat">
        <value name="NUM">
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf"></block>
      <block type="lists_getIndex"></block>
      <block type="lists_setIndex"></block>
    </category>
    <sep></sep>
    <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
    </category>
    <category name="Functions" custom="PROCEDURE" colour="%{BKY_PROCEDURES_HUE}">
    </category>
    <sep></sep>
      
      <category name="KidBright AI" colour="%{BKY_VARIABLES_HUE}">
      <block type="init_ros_node"></block>
      <block type="start_object_detector"></block>
      <block type="start_image_classification"></block>
      <block type="start_wake_word_detector"></block>
      <block type="rospy_loop"></block>
      <block type="get_objects"></block>
      <block type="get_classes"></block>
      <block type="get_sound"></block>

      <block type="get_object_attr"></block>
      <block type="set_velocity"></block>
      <block type="delay"></block>
  </category>
  </xml>`;

    Blockly.Python["start_object_detector"] = function (block) {
      var cc =
        "import rosnode\nimport subprocess\nimport time\nimport os\nros_nodes = rosnode.get_node_names()\nif not '/image_feature' in ros_nodes:\n";
      cc =
        cc +
        "\tcommand='rosrun kidbright_tpu tpu_detect.py " +
        process.env.VUE_APP_ROOT +
        "/" +
        this.$store.getters.getProjectDir +
        "'\n";
      cc =
        cc +
        "\tprocess = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)\n\ttime.sleep(10) \n";

      return cc;
    }.bind(this);

    Blockly.Python["start_image_classification"] = function (block) {
      var cc =
        "import rosnode\nimport subprocess\nimport time\nimport os\nros_nodes = rosnode.get_node_names()\nif not '/image_class' in ros_nodes:\n";
      cc =
        cc +
        "\tcommand='rosrun kidbright_tpu tpu_classify.py " +
        process.env.VUE_APP_ROOT +
        "/" +
        this.$store.getters.getProjectDir +
        "'\n";
      cc =
        cc +
        "\tprocess = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)\n\ttime.sleep(10) \n";

      return cc;
    }.bind(this);

    Blockly.Python["start_wake_word_detector"] = function (block) {
      var dur = this.$store.getters.getProjDescription
      //console.log("==========> Duraion is =======>");
      //console.log(dur.Duration*4);
      var nf = dur.Duration*4
      var cc =
        "import rosnode\nimport subprocess\nimport time\nimport os\nros_nodes = rosnode.get_node_names()\nif not '/wake_class_wait' in ros_nodes:\n";
      cc =
        cc +
        "\tcommand='rosrun kidbright_tpu wakeword_classify.py " +
        "_terminate:=False "  +
        "_model:=" +
        process.env.VUE_APP_ROOT +
        "/" +
        this.$store.getters.getProjectDir +
        "/audios/model.h5 " + 
        "label_file:=" +
        process.env.VUE_APP_ROOT +
        "/" +
        this.$store.getters.getProjectDir +
        "/audios/label_map.pkl " +
        "_nframe:=" + 
        nf.toString() +
        "'\n";
      cc =
        cc +
        "\tprocess = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)\n\ttime.sleep(10) \n";

      return cc;
    }.bind(this);

    Blockly.Python["init_ros_node"] = function (block) {
      var code =
        "from geometry_msgs.msg import Twist\nimport rospy\nimport time\nrospy.init_node('get_center', anonymous=True)\nvelocity_publisher = rospy.Publisher('/cmd_vel', Twist, queue_size=1)\nvel_msg = Twist()\n";

      code =
        code +
        "import roslib\nimport rospy\nfrom kidbright_tpu.msg import tpu_object\nfrom kidbright_tpu.msg import tpu_objects\nfrom std_msgs.msg import String\n";
      return code;
    };

    Blockly.Blocks["get_objects"] = {
      init: function () {
        this.appendDummyInput().appendField("get objects");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["get_classes"] = {
      init: function () {
        this.appendDummyInput().appendField("get classes");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["get_sound"] = {
      init: function () {
        this.appendDummyInput().appendField("get sound");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["sumorobot_opponent"] = {
      init: function () {
        this.setColour("#0099E6");
        this.appendDummyInput().appendField("opponent");
        this.setOutput(true, "Boolean");
      },
    };

    Blockly.Blocks["start_object_detector"] = {
      init: function () {
        this.appendDummyInput().appendField("Start object detector");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["start_image_classification"] = {
      init: function () {
        this.appendDummyInput().appendField("Start image classification");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["start_wake_word_detector"] = {
      init: function () {
        this.appendDummyInput().appendField("Start wake word detector");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["init_ros_node"] = {
      init: function () {
        this.appendDummyInput().appendField("ROS node initialization");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["rospy_loop"] = {
      init: function () {
        this.appendDummyInput().appendField("ROS LOOP");
        this.appendStatementInput("DO")
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["get_object_attr"] = {
      init: function () {
        this.appendValueInput("VAR")
          .setCheck(null)
          .appendField("get")
          .appendField(
            new Blockly.FieldDropdown([
              ["cx", "cx"],
              ["cy", "cy"],
              ["width", "width"],
              ["height", "height"],
              ["label", "label"],
            ]),
            "DATA_FIELD"
          )
          .appendField(" from");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["set_velocity"] = {
      init: function () {
        this.appendDummyInput().appendField("move with ");
        this.appendDummyInput()
          .appendField("linear velocity")
          .appendField(new Blockly.FieldNumber(0), "LINEAR");
        this.appendDummyInput()
          .appendField("angular velocity")
          .appendField(new Blockly.FieldNumber(0), "ANGULAR");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["delay"] = {
      init: function () {
        this.appendDummyInput().appendField("delay");
        this.appendValueInput("NAME").setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Python["set_velocity"] = function (block) {
      var number_linear = block.getFieldValue("LINEAR");
      var number_angular = block.getFieldValue("ANGULAR");
      var code =
        "vel_msg.linear.y = 0\nvel_msg.linear.z = 0\nvel_msg.angular.x = 0\nvel_msg.angular.y = 0\n";
      code =
        code +
        "vel_msg.linear.x = " +
        number_linear +
        "\n" +
        "vel_msg.angular.z = " +
        number_angular +
        "\n";
      code = code + "velocity_publisher.publish(vel_msg)\n";

      return code;
    };

    Blockly.Python["get_object_attr"] = function (block) {
      var dropdown_data_field = block.getFieldValue("DATA_FIELD");
      var value_var = Blockly.Python.valueToCode(
        block,
        "VAR",
        Blockly.Python.ORDER_ATOMIC
      );
      // TODO: Assemble Python into code variable.
      console.log(block.getFieldValue("DATA_FIELD"));
      var code = value_var + "." + block.getFieldValue("DATA_FIELD");
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python["rospy_loop"] = function (block) {
      var statements_name = Blockly.Python.statementToCode(block, "NAME");
      // TODO: Assemble Python into code variable.
      var branch = Blockly.Python.statementToCode(block, "DO");
      branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
      var code = "while not rospy.is_shutdown():\n" + branch;
      return code;
    };

    Blockly.Python["get_objects"] = function (block) {
      var code =
        "rospy.wait_for_message('/tpu_objects', tpu_objects, timeout=4).tpu_objects";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python["get_classes"] = function (block) {
      // TODO: Assemble Python into code variable.
      var code =
        "rospy.wait_for_message('/tpu_objects', tpu_objects, timeout=4).tpu_objects";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python["get_sound"] = function (block) {
      // TODO: Assemble Python into code variable.
      var code =
        "rospy.wait_for_message('/inference', String, timeout=4).data";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python["delay"] = function (block) {
      var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
      );
      // TODO: Assemble Python into code variable.
      var code = "time.sleep(" + value_name + ")\n";
      return code;
    };

    setTimeout(() => {
      //alert("Hello blockly")
      var tt = {};
      tt.toolbox = base_blocks;
      tt.scrollbars = true;
      tt.css = true;
      tt.zoom = {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 4,
        minScale: 0.25,
        scaleSpeed: 1.1,
      };

      var blckDiv = this.$refs["blocklyDiv"];
      this.blockly_woakspace = Blockly.inject(this.$refs["blocklyDiv"], tt);
      //>>>>>>>>>>>> this.$store.commit("setBlocklyWorkspace", this.blockly_woakspace);
      console.log("Injection running ***********************************");
      //console.log(this.blockly_woakspace)
      this.loaded = true;
    }, 500);
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "setBlocklyXml") {
        setTimeout(() => {
          console.log("updating xml !!!!!!!!!");
          //console.log(state.blockly_xml)
          this.blockly_xml = state.blockly_xml;
          // console.log('blockly_xml == ',this.blockly_xml)
          //this.blockly_woakspace = state.blockly_xml
          this.blockly_woakspace.clear();
          let textToDom = Blockly.Xml.textToDom(this.blockly_xml);
          Blockly.Xml.domToWorkspace(this.blockly_woakspace, textToDom);
        }, 500);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
$primary-color: #007e4e;
$black: #333;
$yellow: #fff7d6;
$grey: #eeeeee;

* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding: 0;
}


.blockly-module {
  display: flex;
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  .blockly {
    height: 100%;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>

.custom-control-label::before {
  top: 0 !important;
}

.custom-control-label::after {
  top: 2px !important;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #333;
  border-color: #333;
  background-color: #333;
}

</style>
