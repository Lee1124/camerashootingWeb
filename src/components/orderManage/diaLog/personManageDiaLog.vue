<!--人员管理查看界面-->
<template>
  <div id="personManage">
    <el-dialog
      :title="orderTitle"
      :visible.sync="showPersonManageDiaLog"
      custom-class="dialogBox1"
      :close-on-click-modal="false"
      :modal="false"
      @opened="openedEvent"
      :show-close="false">
      <i class="closeIcon" @click="closeTip"></i>
      <div class="content clearfloat" v-loading="isShowMyLoading">
        <template v-for="(items,index) in personManageListData">
          <div class="list">
            <span class="label">{{items.name}}</span>
            <ul class="commonScrollStyle">
              <template v-for="(items2,index2) in items.positionList">
                <li>
                  <label v-cloak>{{items2.PostName}}：</label>
                  <div class="personBox">
                    <template v-for="(items3,index3) in items2.PostUserList">
                      <span v-cloak>{{items3.UserName}}<img src="../../../../static/img/order/smallClose.png"
                                                            v-if="items2.IsCanEdit"
                                                            @click="deleteThisPerson(items2,items3)"
                                                            class="close"></span>
                    </template>
                  </div>
                  <span class="add" v-if="items2.IsCanEdit" @click="openAddPerson(items2)"></span>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <!--人员安排选择弹框-->
    <personSelectDiaLog :showPersonSelectDiaLog="showPersonSelectDiaLog"></personSelectDiaLog>
  </div>
</template>

<script>
  import personSelectDiaLog from '../diaLog/personSelectDiaLog';//人员选择

  /*方法*/
  let myMethods = {
    closeTip() {
      this.$parent.closeDialog();
      if (this.type == 'list') {
        let menuId = this.$route.query.id;
        if (menuId == 5) {
          this.$parent.getOrderData(undefined, '');
        } else {
          this.$parent.getOrderData2();

        }
      }
    },

    //关闭选择页面
    closeDialog() {
      this.showPersonSelectDiaLog = false;
    },

    //打开添加人员界面
    openAddPerson(itemObj) {
      this.addItemObj = itemObj;
      this.showPersonSelectDiaLog = true;
    },
    //打开人员安排列表页面事件
    openedEvent() {
      this.isShowMyLoading = true;
      if (this.type == 'details') {
        this.orderId = this.$parent.orderDetailsRowObj.OrderId;
      } else if (this.type == 'list') {
        this.orderId = this.$parent.rowObj.OrderId;
      }
      this.getPersonManageList();
      this.getOrderTitle();
    },
    //获取人员安排列表
    getPersonManageList() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderPostUserList';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res.data.data)
            this.personManageListData[0].positionList = res.data.data.XSList;
            this.personManageListData[1].positionList = res.data.data.PSList;
            this.personManageListData[2].positionList = res.data.data.HQList;
            this.personManageListData[3].positionList = res.data.data.KFList;
            this.isShowMyLoading = false;
          } else {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },

    //获取人员选择回传的信息
    getSelectedNews(itemObj) {
      this.addPersonRequest('add', itemObj)
    },
    //增加人员请求
    addPersonRequest(type, itemObj1, itemObj2) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/AddOrDeleteCameraOrderPostInfo';
      let data;
      if (type == 'add') {
        data = {
          OrderId: this.orderId,
          Type: type,
          UpdateUserId: itemObj1.UserId,
          PostId: this.addItemObj.PostId,
        };
      } else if (type == 'delete') {
        data = {
          OrderId: this.orderId,
          Type: type,
          UpdateUserId: itemObj2.UserId,
          PostId: itemObj1.PostId,
          OrderPostInfoId: itemObj2.OrderPostInfoId,
        };
      }
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.getPersonManageList();
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'success'
            });
            if (this.type == 'list') {

            } else if (this.type == 'details') {
              this.$parent.getPersonManageList();
            }
          } else {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        },
        error(err) {
          console.log(err)
        }
      })
    },
    //移除人员
    deleteThisPerson(itemObj1, itemObj2) {
      this.addPersonRequest('delete', itemObj1, itemObj2);
    },

    //根据订单获取标题
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
          } else {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    }
  };
  export default {
    name: "personManage",
    props: ['showPersonManageDiaLog', 'type'],
    data() {
      return {
        personManageListData: [
          {name: '销售', positionList: []},
          {name: '拍摄', positionList: []},
          {name: '后期', positionList: []},
          {name: '客服', positionList: []}
        ],
        /*加载图标*/
        isShowMyLoading: false,
        /*人员安排内容*/
        showPersonSelectDiaLog: false,
        /*订单ID*/
        orderId: '',
        /*增加时保存的信息*/
        addItemObj: {},

        /*订单标题*/
        orderTitle: '',
      };
    },
    methods: myMethods,
    created() {
    },
    components: {
      personSelectDiaLog: personSelectDiaLog,
    }

  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .dialogBox1 {
    width: 660px;
    height: 455px;
    padding: 30px 50px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 0 !important;
    top: 50%;
    transform: translateY(-50%);
  }

  >>> .dialogBox1 .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .dialogBox1 .el-dialog__body {
    height: 320px;
  }

  >>> .dialogBox1 .content {
    height: 100%;
    padding: 24px 0 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .list {
    width: 49%;
    float: left;
    text-align: left;
  }

  .list .label {
    color: #808080;
    font-size: 14px;
  }

  .list:nth-of-type(2n) {
    float: right;
  }

  .list:nth-of-type(3), .list:nth-of-type(4) {
    margin-bottom: 0;
  }

  .list ul {
    height: 150px;
    overflow: auto;
    margin-top: 10px;
  }

  .list ul li {
    height: 45px;
    line-height: 48px;
    text-align: left;
    padding-left: 15px;
    color: #808080;
    font-size: 14px;
    transition: all .2s;
  }

  .list ul li:hover {
    background: #F5F5F5;
  }

  .list ul li .personBox {
    display: inline-block;
    overflow-x: auto;
    line-height: 20px;
    max-width: 140px;
    white-space: nowrap;
    vertical-align: -5px;
    padding-top: 10px;
    box-sizing: border-box;
  }

  .list ul li span {
    color: #4C4C4C;
    font-weight: 700;
    position: relative;
    margin-right: 12px;
  }

  .list ul li span .close {
    position: absolute;
    right: -8px;
    top: -8px;
    visibility: hidden;
    transition: all .2s;
    cursor: pointer;
  }

  .list ul li span:hover .close {
    visibility: visible;
  }

  .list ul li span.add {
    vertical-align: -3px;
    cursor: pointer;
    width: 17px;
    height: 17px;
    display: inline-block;
    background: url("../../../../static/img/order/add0.png") no-repeat center center;
    visibility: hidden;
  }

  .list ul li span.add:hover {
    background: url("../../../../static/img/order/add1.png") no-repeat center center;
  }

  .list ul li:hover .add {
    visibility: visible;
  }


</style>
