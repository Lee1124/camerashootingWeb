<!--选择某天的订单列表及详情-->
<template>
  <div id="checkedDayOrderDetailsDiaLog">
    <el-dialog
      title=""
      :visible.sync="showOrderDetailsDiaLog"
      custom-class="commonDiaLog orderDetailsDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <div class="content">
        <div class="content-hd">
          <p v-cloak class="checkedDay">{{orderList.checkedDay}}</p>
          <p v-cloak class="orderCount">共计{{orderList.orderCount}}个订单</p>
        </div>
        <div class="content-list">
          <ul class="commonScrollStyle">
            <noData msg="无订单" v-show="orderList.list.length==0"></noData>
            <template v-for="(item,index) in orderList.list">
              <li :key="index" @click="openOrderDetails(item)">
                {{item.OrderTitle}}
                <i class="icon"></i>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "checkedDayOrderDetailsDiaLog",
    props: {
      showOrderDetailsDiaLog:{
        type:Boolean,
        default(){
          return true
        }
      },
      orderList:{
        type:Object,
        default(){
          return {
            checkedDay:'2019年5月27日 星期一 ',
            orderCount:3,
            list:[
              {name:'20190527丽思卡尔顿酒店宝宝宴'},
              {name:'20190527丽思卡尔顿酒店宝尔顿酒店宝宝宴'},
              {name:'20190527丽思卡尔顿酒店宝尔顿酒店宝宝宴'},
              {name:'20190527丽思卡尔顿酒店宝店宝宝宴'}
            ]
          }
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      /*打开订单详情页面*/
      openOrderDetails(itemObj){
        // this.$parent.isShowOrderDetailsPage=true
        this.$store.commit('keepIsShowOrderDetailsPage',true)
        this.$parent.orderDetailsRowObj={
          OrderId:itemObj.OrderId
        }
      },
      close() {
        this.$store.commit('keepShowOrderDetailsDiaLog',false)
      },
      openEvent() {

      },
      openedEvent() {

      },
    },
    created() {

    },
  }
</script>

<style scoped>
  >>> .el-dialog__header,
  >>> .el-dialog__body,
  >>> .el-dialog__footer {
    padding: 0;
  }
  .closeIcon {
    width: 18px;
    height: 18px;
    text-align: center;
    display: block;
    font-style: normal;
    position: absolute;
    right: 26px;
    top: 26px;
    cursor: pointer;
    z-index: 99988;
    box-sizing: border-box;
    transition: all .2s;
    background: url("../../../static/img/common/close.png") no-repeat center center;
  }
  >>> .orderDetailsDiaLog {
    width:513px;
    height:325px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 21px 0px rgba(0, 0, 0, 0.17);
    padding: 60px 45px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content {
    text-align: left;
  }
  .checkedDay {
    color: #333;
    font-size: 20px;
  }
  .orderCount {
    font-size: 14px;
    color: #999;
    margin: 15px 0;
  }
  .content-list ul {
    height: 130px;
    overflow-y: auto;
    position: relative;
  }
  .content-list ul li {
    margin-top: 25px;
    color: #666666;
    font-size: 14px;
    cursor: pointer;
    transition: all .3s;
  }
  .content-list ul li:hover {
    color: #5996F8;
  }
  .content-list ul li .icon{
    display: inline-block;
    width: 14px;
    height: 11px;
    background: url("../../../static/img/order/right-go.png") no-repeat center center;
    margin-left: 40px;
    opacity:0;
  }
  .content-list ul li:hover .icon{
    opacity: 1;
  }
</style>
