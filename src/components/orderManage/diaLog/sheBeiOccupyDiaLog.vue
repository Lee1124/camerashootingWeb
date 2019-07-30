<!--设备被占用提示-->
<template>
  <div id="sheBeiOccupyDiaLog">
    <el-dialog
      title="设备占用提示"
      :visible.sync="showSheBeiOccupyDiaLog"
      custom-class="commonDiaLog sheBeiOccupyDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--设备被占用提示内容-->
      <div class="content">
        <P class="title">您修改的日期有以下设备被占用，确认修改后被占用的设备将会被移除</P>
        <p class="list"><span>• 领用时间段：</span><span>{{sheBeiOccupyObj.time}}</span></p>
        <p class="list">• 被占用设备({{sheBeiOccupyObj.num}})</p>
        <div class="tableBox">
          <el-table
            :data="sheBeiOccupyObj.tableData"
            border
            max-height="150px"
            :style="{borderColor:'#DDD'}"
            :header-row-class-name="headerClassName"
            :row-class-name="rowClassName"
            style="width: 100%;text-align: center">
            <el-table-column
              label="设备"
              prop="equiname"
              show-overflow-tooltip
              align="center">
            </el-table-column>
            <el-table-column
              label="订单"
              prop="ordertitle"
              show-overflow-tooltip
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              width="110px"
              align="center">
              <template slot-scope="scope">
                <span @click.stop="lookSheBei(scope.row)"
                      style="color: #5996F8;text-decoration: underline;cursor:pointer;">查看设备</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="close">取 消</el-button>
           <el-button type="primary" @click="confirmChange()">确定修改</el-button>
        </span>
    </el-dialog>
    <!--设备详情-->
    <sheBeiDetailsDiaLog :showSheBeiDetailsDiaLog="showSheBeiDetailsDiaLog"></sheBeiDetailsDiaLog>
  </div>
</template>

<script>
  import sheBeiDetailsDiaLog from '../diaLog/sheBeiDetailsDiaLog';//设备详情
  export default {
    name: "sheBeiOccupyDiaLog",
    props: {
      /*是否显示*/
      showSheBeiOccupyDiaLog: {
        type: Boolean,
        default() {
          return false
        }
      },
      /*表格数据*/
      sheBeiOccupyObj: {
        type: Object,
        default() {
          return {
            tableData: [],
            time: '',
            num: 0,
          }
        }
      }
    },
    data() {
      return {
        showSheBeiDetailsDiaLog:false,
        keepRowObj:{}
      }
    },
    components:{
      sheBeiDetailsDiaLog
    },
    methods: {
      showTips(msg, type = 'success') {
        this.$message({
          message: msg,
          customClass: 'msgTips',
          type: type
        });
      },
      headerClassName({row, rowIndex}) {
        return 'tableHeaderStyle'
      },
      rowClassName({row, rowIndex}) {
        if (rowIndex % 2 != 0) {
          return 'tableRow2nStyle tableRowStyle'
        } else {
          return 'tableRow1nStyle tableRowStyle'
        }
      },
      /*取消或关闭弹框*/
      close() {
        this.$emit('closeDiaLog');
      },
      confirmChange() {
        console.log(this.sheBeiOccupyObj)
        let url = '/xlapi/CameraManage/EquiManage/EquiOrder/DelEquilibEquiList';
        let data = {
          orderid: this.sheBeiOccupyObj.orderId,
          stime: this.sheBeiOccupyObj.getTime,
          etime: this.sheBeiOccupyObj.returnTime
        };
        this.$Axios({
          method: 'POST',
          url: url,
          data: data,
          success(res) {
            if (res.data.status) {
              this.showTips(res.data.msg);
              let url = '/xlapi/CameraManage/EquiManage/EquiOrder/UpdateEquiOrder';
              let data = {
                orderid: this.sheBeiOccupyObj.orderId,
                stime: this.sheBeiOccupyObj.getTime,
                etime: this.sheBeiOccupyObj.returnTime
              };
              this.$Axios({
                method: 'POST',
                url: url,
                data: data,
                success(res) {
                  this.close();
                  this.$emit('getOrderSheBeiList');
                  console.log(res)
                }
              })
            }
          }
        })
      },
      openEvent() {

      },
      openedEvent() {

      },
      lookSheBei(itemObj) {
        this.showSheBeiDetailsDiaLog=true;
        this.keepRowObj={
          Equid:itemObj.equid
        }
      }
    },
    created() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  @import "../../../../static/css/tableStyle.css";

  >>> .sheBeiOccupyDiaLog .closeIcon {
    right: 40px;
    top: 28px;
  }

  >>> .sheBeiOccupyDiaLog {
    padding: 0 40px 40px;
    width: 720px;
    height: 480px;
  }

  >>> .sheBeiOccupyDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .sheBeiOccupyDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .sheBeiOccupyDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  >>> .sheBeiOccupyDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .sheBeiOccupyDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  .content {
    text-align: left;
  }

  .content .title {
    color: #4C4C4C;
    font-size: 18px;
    margin: 35px 0;
  }

  .content .list {
    color: #808080;
    font-size: 14px;
    margin-bottom: 20px;
  }

</style>
