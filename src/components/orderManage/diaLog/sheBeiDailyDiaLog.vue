<!--设备日志-->
<template>
  <div id="sheBeiDailyDiaLog">
    <el-dialog
      title="设备日志"
      :visible.sync="showSheBeiDailyDiaLog"
      custom-class="commonDiaLog addHotelDiaLog sheBeiDailyDiaLog"
      :modal="false"
      @open="openEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <div class="content">
        <div class="title">{{dailyDetailsObj.equiname}}
          <span class="zt" v-cloak style="color:#FF0000;" v-if="dailyDetailsObj.state=='待出库'"> （{{dailyDetailsObj.state}}）</span>
          <span class="zt" v-cloak style="color:#FF9C00;" v-if="dailyDetailsObj.state=='待归还'">（{{dailyDetailsObj.state}}）</span>
          <span class="zt" v-cloak style="color:#808080;" v-if="dailyDetailsObj.state=='已归还'">（{{dailyDetailsObj.state}}）</span>
        </div>
        <ul>
          <li>
            <p>申&nbsp;请&nbsp;人 ：<span v-text="dailyDetailsObj.applyname"></span></p>
            <p>申请时间 ：<span v-text="dailyDetailsObj.applytime"></span></p>
          </li>
          <li>
            <p>出&nbsp;库&nbsp;人 ：<span v-text="dailyDetailsObj.outuser"></span></p>
            <p>出库时间 ：<span v-text="dailyDetailsObj.outtime"></span></p>
          </li>
          <li>
            <p>归&nbsp;还&nbsp;人 ：<span v-text="dailyDetailsObj.retuser"></span></p>
            <p>归还时间 ：<span v-text="dailyDetailsObj.rettime"></span></p>
          </li>
        </ul>

      </div>
    </el-dialog>
  </div>
</template>

<script>

  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
    },
    openEvent() {
      this.dailyRowObj = this.$parent.keepRowObj;
      this.getDaily();
    },
    getDaily() {
      let url = '/xlapi/CameraManage/EquiManage/EquiOrder/GetEquiOrderlibLogo';
      let data = {
        equilid: this.dailyRowObj.id,
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res)
            this.dailyDetailsObj = res.data.data;
          }
        }
      })
    }
  };
  export default {
    name: "sheBeiDailyDiaLog",
    props: ['showSheBeiDailyDiaLog'],
    data() {
      return {
        /*api等信息*/
        api: getkevalue().apiurl,
        dailyRowObj: {},
        dailyDetailsObj: {
          applyname: "",
          applytime: "",
          equiname: "",
          outtime: "",
          outuser: "",
          rettime: "",
          retuser: "",
          state: ""
        }
      };
    },
    methods: myMethods,
    created() {
    },
    mounted() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  /*新增酒店弹框样式*/
  .commonBox {
    display: inline-block;
    width: 200px;
    height: 32px;
  }

  >>> .sheBeiDailyDiaLog {
    padding: 0 40px 40px;
    width: 590px;
    height: 485px;
  }

  >>> .sheBeiDailyDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .sheBeiDailyDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .sheBeiDailyDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  >>> .sheBeiDailyDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .sheBeiDailyDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  >>> .sheBeiDailyDiaLog .closeIcon {
    right: 40px;
    top: 26px;
  }

  /*内容区*/
  .content {
    text-align: left;
    padding: 30px 20px 0;
  }

  .content .title {
    font-size: 20px;
    font-weight: 700;
  }

  .content .title .zt {
    font-weight: 400;
  }

  .content ul {
    padding: 0 50px;
  }

  .content ul li {
    padding: 30px 0;
    border-bottom: 1px dashed #DDD;
  }

  .content ul li p {
    margin-bottom: 5px;
    font-size: 14px;
    color: #808080;
  }

  .content ul li p span {
    color: #4C4C4C;
  }

  .content ul li p:first-of-type {
    letter-spacing: 1px;
  }


</style>
