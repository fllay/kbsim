<template>
  <div class="hint">
    <div class="main-hint txt">
      <p class="p-color font-weight-bold">ขั้นตอนที่ 4 Coding</p>
      <p>
        ขั้นตอนนี้ใช้สร้างชุดคำสั่งโดยการลากบล็อคคำสั่งจากแถบเครื่องมือ
        ในกรณีที่ยังไม่มีโมเดลรู้จำต้องการทำกระบวนการสร้างโมเดล
        โดยมีลำดับเริ่มจาก<br /><span class="p-color"
          >ขั้นตอนที่ 1 (Capture)</span
        >
        <br /><span class="p-color">ขั้นตอนที่ 2 (Annotate)</span>
        <br /><span class="p-color">ขั้นตอนที่ 3 (Training)</span>
      </p>
      <p>
        <br><b>ชุด blockly ที่เกี่ยวข้องกัน</b>
        <ul>
          <li> * Start object detector และ get objects </li>
          <li> * Start Image classification และ get classes </li>
          <li> * Start wake word detector และ get sound </li>
        </ul>
      </p>
    </div>
    <div class="mascot">
      <img
        v-if="!isRunning"
        src="~/assets/images/UI/png/Mask Group 11.png"
        alt=""
        srcset=""
      />
      <img
        v-if="isRunning"
        src="~/assets/images/UI/svg/Mask Group 10.svg"
        alt=""
        srcset=""
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(['isRunning'])
  }
}
</script>