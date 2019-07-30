<template>
  <el-dialog
    title="出库清单"
    :modal="false"
    top="0"
    :visible.sync="showDetailDig"
    width="722px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="outgoing-dialog"
  >
    <div class="detail-main">
      <div class="detail-item">
        <div>
          <span class="span-title">订&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单：</span>
          <span class="span-value">{{curOutLib.ordertitle}}</span>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <span class="span-title">领取时间：</span>
          <span class="span-value span-date">{{dateFormat(curOutLib.Receivedate)}}</span>
        </div>
        <div>
          <span class="span-title">归还时间：</span>
          <span class="span-value span-date">{{dateFormat(curOutLib.Returndate)}}</span>
        </div>
      </div>
      <div class="detail-item">
        <span class="span-title table-title">设备领取清单</span>
      </div>
      <div class="detail-table">
        <el-table
          :data="curOutLib.Orderlibs"
          stripe
          border
          :max-height="188"
          :header-row-class-name="headerClassName"
          :row-class-name="rowClassName"
          highlight-current-row
          class="commonScrollStyle"
        >
          <el-table-column type="index" label="序号" width="65"></el-table-column>
          <el-table-column prop="equiName" label="设备" width="238"></el-table-column>
          <el-table-column prop="ToState" label="状态" width="105">
            <template slot-scope="scope">
              <span class="table-state noSelect">{{scope.row.ToState}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <span class="table-detail noSelect" @click="showLookDeviceDig(scope.row.Equid)">详情</span>
              <span
                v-if="scope.row.State=='1'"
                class="table-detail table-outgoing noSelect"
                @click="showSingleInDig(scope.row)"
              >归还</span>
              <span
                v-else-if="scope.row.State=='0'"
                class="table-detail table-outgoing noSelect"
                @click="showSingleOutDig(scope.row)"
              >出库</span>
              <span
                v-else
                class="table-detail table-none noSelect"
                @click="showSingleOutDig(scope.row)"
              >出库</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="detail-item">
        <div>
          <span class="span-title person-title">申请人：</span>
          <div style="display: inline-block;">
            <span class="span-value span-person" v-for="appl in curOutLib.applyUser">{{appl}}</span>
          </div>
        </div>
        <div>
          <span class="span-title person-title">出库人：</span>
          <div style="display: inline-block;">
            <span class="span-value span-person" v-for="out in curOutLib.outUser">{{out}}</span>
          </div>
        </div>
        <div>
          <span class="span-title person-title">归还人：</span>
          <div style="display: inline-block;">
            <span class="span-value span-person" v-for="ret in curOutLib.retUser">{{ret}}</span>
          </div>
        </div>
      </div>
      <div class="edit-button">
        <el-button type="text" class="btn-cancel" @click="handleClose">取消</el-button>
        <el-button @click="showOneClickOutDig">一键出库</el-button>
      </div>
    </div>
    <!--操作提示弹窗-->
    <deleleDig
      :showDeleteDig="showTipDig"
      :dataClass="deleteTypeName"
      :dataName="deleteName"
      :tipText="tipText"
      @closeDeleteDig="showTipDig=fasle"
      @confirmDelete="confirmOperate"
    ></deleleDig>
  </el-dialog>
</template>

<script>
import deleleDig from "../components/deleteTipDig"; //提示弹框
export default {
  props: ["showDetailDig", "curOutLib"],
  components: { deleleDig },
  data() {
    return {
      showTipDig: false,
      curOrderlib: {},
      deleteTypeName: "",
      deleteName: "",
      tipText: ""
    };
  },
  mounted() {},
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeOutgoingDelDig");
    },
    /**
     * 显示设备详情弹窗
     */
    showLookDeviceDig(Equid) {
      this.$emit("showLookDeviceDig", Equid);
    },
    /**
     * 保存信息
     */
    saveDevice() {
      this.$emit("saveDevice");
    },
    /**
     * 确认操作
     */
    confirmOperate() {
      if (this.deleteType == "outGoing") {
        this.confirmOutging(1);
      } else if (this.deleteType == "inGoing") {
        this.confirmOutging(2);
      } else if (this.deleteType == "oneClick") {
        this.oneClickReturnOrOut();
      }
    },
    /**
     * 打开单个出库提示弹窗
     *
     */
    showSingleOutDig(curData) {
      if (curData.State == 2) {
        this.$message({
          message: "无需出库",
          type: "warning"
        });
        return;
      }
      this.curOrderlib = clone(curData);
      this.deleteTypeName = "是否确定出库该物品";
      this.deleteType = "outGoing";
      this.deleteName = "出库";
      this.tipText = `或者确认“${this.curOrderlib.equiName}”取消出库`;
      this.showTipDig = true;
    },
    /**
     * 打开单个归还提示弹窗
     *
     */
    showSingleInDig(curData) {
      this.curOrderlib = clone(curData);
      this.deleteTypeName = "是否确定归还该物品";
      this.deleteType = "inGoing";
      this.deleteName = "归还";
      this.tipText = `或者确认“${this.curOrderlib.equiName}”取消归还`;
      this.showTipDig = true;
    },
    /**
     * 打开一键出库提示弹窗
     *
     */
    showOneClickOutDig() {
      let outList = this.curOutLib.Orderlibs.filter(out => out.State == 0);
      console.log(this.curOutLib.Orderlibs);
      if (outList.length > 0) {
        this.deleteTypeName = "是否确认一键出库";
        this.deleteType = "oneClick";
        this.deleteName = "出库";
        this.tipText = `包含“${outList[0].equiName}”等${outList.length}件设备`;
        this.showTipDig = true;
      } else {
        this.$message({
          message: "当前没有可出库设备",
          type: "warning"
        });
      }
    },
    /**
     * 时间格式化
     */
    dateFormat(date) {
      return getFormatTime(date, ".");
    },
    /**
     * 获取订单信息
     */
    getEquiOrder() {
      this.$emit("getEquiOrder");
    },

    //自定义表格样式
    headerClassName({ row, rowIndex }) {
      return "outgoing-header";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) {
        return "outgoing-row outgoing-row2";
      } else {
        return "outgoing-row outgoing-row1";
      }
    },
    /**
     * 确认单个出库、归还
     */
    confirmOutging(state) {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiOrder/SingleReturnOrOut";
      this.$Axios({
        method: "POST",
        data: {
          equilid: this.curOrderlib.id,
          state: state
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            that.showTipDig = false;
            that.getEquiOrder();
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    },

    /**
     * 一键出入库
     */
    oneClickReturnOrOut() {
      console.log("11", this.curOutLib);
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiOrder/OneClickReturnOrOut";
      this.$Axios({
        method: "POST",
        data: {
          orderid: this.curOutLib.orderid,
          state: 0
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            that.showTipDig = false;
            that.getEquiOrder();
            that.$parent.getOutLibPageList();
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.detail-main {
  width: 550px;
  height: 425px;
  padding-top: 40px;
  margin: auto;
}
.detail-item {
  display: flex;
  justify-content: space-between;
}

.span-title {
  width: 75px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 50px;
}
.person-title {
  width: 60px;
}

.span-value {
  /* width: 180px; */
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 50px;
}
.span-date {
  width: 180px;
}
.table-title {
  width: auto;
  color: #808080;
  font-weight: bold;
}
.span-person {
  width: 95px;
}

.edit-button {
  margin-top: 22px;
  float: right;
}

/*保存按钮*/
.outgoing-dialog .el-button {
  width: 96px;
  height: 34px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
  margin: auto;
}

.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}
.detail-table {
  width: 100%;
  height: 184px;
}

.table-detail {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  color: #0fce00;
}

.table-state {
  color: #ff8400;
}

.table-outgoing {
  color: #5996f8;
  margin-left: 10px;
}
.table-none {
  color: #808080;
  margin-left: 10px;
}
</style>
<style>
/*弹窗样式*/
.outgoing-dialog {
  width: 722px;
  height: 580px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.outgoing-dialog .el-dialog__header {
  padding-top: 35px;
}

.outgoing-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.outgoing-dialog .el-dialog__body {
  padding: 0px !important;
}

.outgoing-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*表格样式*/
.outgoing-header {
  height: 46px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
.outgoing-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

.outgoing-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  padding: 0px;
}
.outgoing-row .cell {
  line-height: 46px;
}
.outgoing-row:hover > td {
  background: #f0f0fa !important;
  color: #5996f8 !important;
}
.outgoing-row1 td {
  background: #ffffff;
}

.outgoing-row2 td {
  background: #f0f0f0;
}
</style>

