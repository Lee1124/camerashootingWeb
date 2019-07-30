<template>
  <el-dialog
    :title="'['+curDevice.name+']使用情况'"
    :modal="false"
    top="0"
    :visible.sync="showUseListDig"
    width="772px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    @opened="getEquiUsage"
    custom-class="useList-dialog"
  >
    <div class="useList-main">
      <div class="useList-search">
        <div style="display: inline-block;">
          <selectTime @getStartTime="getStartTime" @getEndTime="getEndTime"></selectTime>
        </div>
        <el-button @click="getEquiUsage">查询</el-button>
      </div>
      <div class="useList-table">
        <noData msg="暂无数据" v-if="data.length==0"></noData>
        <el-table
          :data="data"
          stripe
          border
          :max-height="270"
          :header-row-class-name="headerClassName"
          :row-class-name="rowClassName"
          highlight-current-row
          class="commonScrollStyle"
        >
          <el-table-column prop="atimeStr" label="时间" width="150"></el-table-column>
          <el-table-column prop="ordertitle" :show-overflow-tooltip="true" label="订单" width="255">
            <template slot-scope="scope">
              <span>{{scope.row.ordertitle}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="auserStr" label="申请人" width="119">
            <template slot-scope="scope">
              <span>{{scope.row.auserStr}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rtimeStr" label="归还时间" width="140">
            <template slot-scope="scope">
              <span>{{scope.row.rtimeStr}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import selectTime from "../../common/selectTime/selectTime";
export default {
  props: ["showUseListDig", "curDevice"],
  components: { selectTime },
  data() {
    return {
      data: [],
      searchData: {
        stime: "",
        etime: "",
        equid: ""
      }
    };
  },
  mounted() {},
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeUseListDelDig");
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
    /**
     * 获取选择的时间段
     */
    getStartTime(startTime) {
      this.searchData.stime = startTime;
    },
    getEndTime(endTime) {
      this.searchData.etime = endTime;
    },

    //自定义表格样式
    headerClassName({ row, rowIndex }) {
      return "useList-header";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) {
        return "useList-row useList-row2";
      } else {
        return "useList-row useList-row1";
      }
    },
    /**
     * 获取设备使用情况
     */
    getEquiUsage() {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiOrder/GetEquiUsage";
      this.$Axios({
        method: "POST",
        url: url,
        data: {
          stime: this.searchData.stime,
          etime: this.searchData.etime,
          equid: this.curDevice.id
        },
        success(res) {
          if (res.status == 200) {
            that.data = res.data;
          } else {
            that.$message.error("查询设备使用情况失败");
          }
        },
        error(err) {}
      });
    }
  }
};
</script>

<style scoped>
/*使用清单弹窗*/
.useList-main {
  width: 666px;
  height: 310px;
  padding-top: 40px;
  margin: auto;
}

/*保存按钮*/
.useList-dialog .el-button {
  width: 64px;
  height: 32px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
  margin: auto;
  margin-left: 30px;
}

.useList-table {
  width: 100%;
  height: 184px;
  margin-top: 30px;
  position: relative;
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

.table-useList {
  color: #5996f8;
  margin-left: 10px;
}
</style>
<style>
/*弹窗样式*/
.useList-dialog {
  width: 772px;
  height: 516px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.useList-dialog .el-dialog__header {
  padding-top: 35px;
}

.useList-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.useList-dialog .el-dialog__body {
  padding: 0px !important;
}

.useList-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*表格样式*/
.useList-header {
  height: 34px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
.useList-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

.useList-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  padding: 0px;
}
.useList-row .cell {
  line-height: 34px;
}
.useList-row:hover > td {
  background: #f0f0fa !important;
  color: #5996f8 !important;
}
.useList-row1 td {
  background: #ffffff;
}

.useList-row2 td {
  background: #f0f0f0;
}
</style>

