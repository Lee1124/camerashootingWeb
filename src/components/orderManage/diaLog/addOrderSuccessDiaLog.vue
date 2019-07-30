<template>
    <div id="addOrderSuccessDiaLog">
      <el-dialog
        title=""
        :visible.sync="showAddOrderSuccessDiaLog"
        custom-class="commonDiaLog addOrderSuccessDiaLog"
        :modal="false"
        @open="openEvent"
        @opened="openedEvent"
        :before-close="closeBefore"
        :close-on-click-modal="false"
        :show-close="false">
        <i class="closeIcon" @click="closeTip"></i>
        <!--成功界面-->
        <div class="addNewOrderSuccess" >
          <ul>
            <li>
              <div class="icon1"></div>
              <p class="icon1-text">订单新增成功</p>
            </li>
            <li>
              <p class="erWeiMa-text">扫描二维码发送客户填写意向表</p>
              <div class="erWeiMa">
                <img :src="QRCodeImgUrl" alt="微信小程序二维码" title="微信小程序二维码">
              </div>
            </li>
            <li>
              <p class="hunLi-text" v-cloak>{{orderTitle}}</p>
              <p v-cloak>{{orderType|orderTypeStr}}</p>
            </li>
          </ul>
        </div>
        <!--/成功界面-->
      </el-dialog>
    </div>
</template>

<script>
    /*数据*/
    let dataObj = {
      orderId:'',
      orderTitle:'',
      orderType:'',
      QRCodeImgUrl:'',
    };
    /*方法*/
    let myMethods = {
      closeBefore(){

      },
      closeTip() {
        this.$parent.closeDialog('update');
      },
      openEvent(){
        this.orderId=this.$parent.orderId;
        this.orderType=this.$parent.selectedTypeId;
        this.QRCodeImgUrl=loginApi+"/xlapi/CameraManage/CameraUserInfoManage/UserLogin/GetCameraOrderYXBQRCode?" +
          "content=orderId="+this.orderId+"%26share=true%26url=yixiangbiao&scence="
      },
      openedEvent(){
        this.getOrderTitle();
      },
      /*根据订单获取订单标题*/
      getOrderTitle() {
        let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderTitleByOrderId';
        let data = {
          OrderId: this.orderId
        };
        this.$Axios({
          method: 'POST',
          url: url,
          data: data,
          success(res) {
            if (res.data.status) {
              this.orderTitle = res.data.data;
            }
          }
        })
      },

    };
    export default {
      name: "addOrderSuccessDiaLog",
      props: ['showAddOrderSuccessDiaLog'],
      data() {
        return dataObj;
      },
      methods: myMethods,
      created() {
      },
      filters:{
        orderTypeStr(val){
          if (val==1){
            return '婚礼拍摄'
          } else if (val==2){
            return '活动拍摄'
          }
        }
      }
    }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  /*成功弹框的样式*/
  >>> .addOrderSuccessDiaLog {
    width: 36.5%;
    height: 76.5%;
    padding: 2.5%;
    min-width: 400px;
    min-height: 520px;
  }

  .addOrderSuccessDiaLog ul li {
    /*margin: 20px 0;*/
  }
  .addOrderSuccessDiaLog ul li:nth-of-type(2) {
    margin-top: 15%;
  }

  .addOrderSuccessDiaLog .icon1 {
    width: 110px;
    height: 110px;
    background: url("../../../../static/img/order/success.png") no-repeat center center;
    margin: 0 auto 10%;
  }

  .addOrderSuccessDiaLog .icon1-text {
    color: #11CA64;
    font-size: 24px;
  }

  .addOrderSuccessDiaLog .erWeiMa-text {
    color: #BBBBBB;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .addOrderSuccessDiaLog .erWeiMa {
    width: 160px;
    height: 160px;
    margin: 5% auto;
  }
  .addOrderSuccessDiaLog .erWeiMa img{
    width: 100%;
    height: 100%;
  }

  .addOrderSuccessDiaLog .hunLi-text {
    width: 100%;
    margin: 0 auto 10px;
  }
</style>
