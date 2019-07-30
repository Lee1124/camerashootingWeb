<!--酒店详情-->
<template>
  <div id="addHotel">
    <el-dialog
      :title="myTitle"
      :visible.sync="showHotelOrHQDetailsDiaLog"
      custom-class="commonDiaLog addHotelDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--酒店详情-->
      <div v-loading="isShowLoading">
        <template v-if="hotelOrHQObj.type == 'hotel'" v-for="(item,index) in showHotelOrHQArr">
          <ul class="content">
            <li>
              <span class="label">城市：</span>
              <span class="value">{{item.CityName}}</span>
            </li>
            <li>
              <span class="label">酒店：</span>
              <span class="value">{{item.HotelName}}</span>
            </li>
            <li>
              <span class="label">地址：</span>
              <span class="value">{{item.HotelAddress}}</span>
            </li>
            <li>
              <span class="label">说明：</span>
              <span class="value">{{item.Remark|remarkStr}}</span>
            </li>
          </ul>
        </template>
        <template v-if="hotelOrHQObj.type == 'HQ'" v-for="(item,index) in showHotelOrHQArr">
          <ul class="content">
            <li>
              <span class="label">城市：</span>
              <span class="value">{{item.CityName}}</span>
            </li>
            <li>
              <span class="label">婚庆：</span>
              <span class="value">{{item.WeddingName}}</span>
            </li>
            <li>
              <span class="label">地址：</span>
              <span class="value">{{item.WeddingAddress}}</span>
            </li>
            <li>
              <span class="label">说明：</span>
              <span class="value">{{item.Remark|remarkStr}}</span>
            </li>
          </ul>
        </template>
      </div>
    </el-dialog>
    <!--this.$store.state.showDiaLogObj.showHotelOrHQDetailsDiaLog-->
  </div>
</template>

<script>

  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
    },
    openEvent(){
      this.isShowLoading=false;
    },
    openedEvent() {
      if (this.hotelOrHQObj.type == 'hotel' || this.hotelOrHQObj.type == 'HQ') {
        this.isShowLoading=true;
        let url;
        let data;
        if (this.hotelOrHQObj.type == 'hotel') {
          this.myTitle = '酒店详情';
          url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraHotelInfoByHotelId';
          data = {HotelId: this.hotelOrHQObj.obj.HotelId};
        } else {
          this.myTitle = '婚庆详情';
          url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraWeddingInfoByWeddingId';
          data = {WeddingId: this.hotelOrHQObj.obj.WeddingId};
        }
        this.$Axios({
          method: 'POST',
          url: url,
          data: data,
          success(res) {
            // console.log(res)
            this.isShowLoading=false;
            this.showHotelOrHQArr=[res.data.data];
          }
        })
      }
    }
  };
  export default {
    name: "addHotelDiaLog",
    props: {
      showHotelOrHQDetailsDiaLog: {
        type: Boolean,
        default() {
          return false
        }
      },
      hotelOrHQObj: {
        type: Object,
        default() {
          return {
            type: '',
            obj: {},
          }
        }
      },
    },
    data() {
      return {

        myTitle: '',
        showHotelOrHQArr: [{
          CityName:'',
          HotelName:'',
          HotelAddress:'',
          Remark:'',
          WeddingName:'',
          WeddingAddress:'',
        }],
        isShowLoading:false
      };
    },
    methods: myMethods,
    created() {
    },
    mounted() {

    },
    filters: {
      remarkStr(val) {
        return val ? val : '暂无说明'
      }
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .addHotelDiaLog .closeIcon {
    right: 40px;
    top: 28px;
  }

  /*新增酒店弹框样式*/
  .commonBox {
    display: inline-block;
    width: 200px;
    height: 32px;
  }

  >>> .addHotelDiaLog {
    padding: 0 40px 40px;
    width: 540px;
    height: 400px;
  }

  >>> .addHotelDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .addHotelDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .addHotelDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  >>> .addHotelDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .addHotelDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  ul.content {
    padding: 50px;
  }

  ul.content li {
    text-align: left;
    font-size: 14px;
    margin-bottom: 30px;
  }

  ul.content li span.label {
    color: #B2B2B2;
  }

  ul.content li span.value {
    color: #4C4C4C;
    margin-left: 20px;
  }

</style>
