<template>
  <div class="ourgoing-main">
    <div class="search-div">
      <div class="radio-search">
        <el-radio-group v-model="searchData.state" @change="getOutLibPageList">
          <el-radio label>全部状态</el-radio>
          <el-radio label="0">待出库</el-radio>
          <el-radio label="1">待归还</el-radio>
          <el-radio label="2">已归还</el-radio>
        </el-radio-group>
      </div>
      <div class="date-search">
        <div class="selectTime">
          <selectTime @getStartTime="getStartTime" @getEndTime="getEndTime"></selectTime>
        </div>
        <el-input
          size="small"
          v-model="searchData.appuser"
          placeholder="搜索申请人"
          style="width:200px;margin-left:15px"
        ></el-input>
        <el-button class="search-btn" @click="getOutLibPageList(true)">查询</el-button>
      </div>
    </div>
    <div class="div-table" ref="tableBox" v-loading="devIsLodding">
      <noData msg="暂无数据" v-if="dataList.length==0"></noData>
      <el-table
        :data="dataList"
        stripe
        border
        :max-height="tableHeight"
        :header-row-class-name="headerClassName"
        :row-class-name="rowClassName"
        highlight-current-row
        class="commonScrollStyle"
      >
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="title" :show-overflow-tooltip="true" label="订单" min-width="47.5">
          <template slot-scope="scope">
            <span :title="scope.row.title" class="order-title">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applycount" label="申请数量" min-width="12"></el-table-column>
        <el-table-column prop="outcount" label="出库数量" min-width="12"></el-table-column>
        <el-table-column prop="retcount" label="归还数量" min-width="12"></el-table-column>
        <el-table-column prop="outtime" label="出库时间" min-width="14"></el-table-column>
        <el-table-column prop="applyuser" label="申请人" min-width="17"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="14.5">
          <template slot-scope="scope">
            <span
              :class="scope.row.state=='待出库'?'table-state2':'table-state1'+' noSelect'"
            >{{scope.row.state}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="12.5">
          <template slot-scope="scope">
            <span class="table-detail noSelect" @click="showOutLibDetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div
      v-if="dataList.length!=0"
      style="position: relative;bottom: -10px;left: 0px;right: 0;width:100%"
      class="clearfloat"
    >
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="count"
        :hide-on-single-page="true"
        :page-size="searchData.size"
        @current-change="getOutLibPageList()"
        :current-page.sync="searchData.page"
      ></el-pagination>
    </div>

    <outgoingDetail
      :showDetailDig="showDetailDig"
      :curOutLib="curOutLib"
      @closeOutgoingDelDig="showDetailDig=false"
      @getEquiOrder="getEquiOrder(curOutLib.orderid)"
      @showLookDeviceDig="showLookDeviceDig"
    ></outgoingDetail>

    <!--查看设备弹窗-->
    <lookDeviceDig
      :showLookDevDig="showLookDevDig"
      :curDevice="curDevice"
      :devTypeList="[]"
      :isEdit="true"
      @closeLookDeviceDig="showLookDevDig=false"
    ></lookDeviceDig>
  </div>
</template>

<script>
import selectTime from "../../common/selectTime/selectTime";
import outgoingDetail from "../components/outgoingDetail"; //出库清单弹窗
import lookDeviceDig from "../components/lookDeviceDig"; //查看设备弹框
export default {
  components: { selectTime, outgoingDetail, lookDeviceDig },
  created() {
    this.loadResize();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDomHeight();
      }, 1);
    });
  },
  mounted() {
    this.getOutLibPageList(true);
  },
  data() {
    return {
      searchData: {
        state: "",
        stime: "",
        etime: "",
        appuser: "",
        page: 1,
        size: 15
      },
      radio: 3,
      dataList: [],
      curOutLib: {},
      curOrderlib: {},
      curDevice: {},
      tableHeight: "610",
      tableBoxHeight: "",
      deleteTypeName: "",
      deleteName: "",
      tipText: "",
      showDetailDig: false,
      showLookDevDig: false,
      showTipDig: false,
      devIsLodding: true,
      count: 0
    };
  },
  methods: {
    loadResize() {
      let that = this;
      $(window).resize(() => {
        that.getDomHeight();
      });
    },
    //获取元素高度
    getDomHeight() {
      this.tableBoxHeight = $(this.$refs.tableBox).height();
      this.tableHeight = this.tableBoxHeight;
    },
    //当前页
    handleSizeChange(index) {
      console.log(`当前页: ${index}`);
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
    getStartTime(startTime) {
      this.searchData.stime = startTime;
    },
    getEndTime(endTime) {
      this.searchData.etime = endTime;
    },

    /******************弹窗相关******************/
    showOutLibDetail(curData) {
      this.getEquiOrder(curData.orderid).then(res => {
        this.showDetailDig = true;
      });
    },

    /******************API相关******************/

    /**
     * 分页获取出库列表
     */
    getOutLibPageList(isInitPage = false) {
      if (isInitPage) {
        this.searchData.page = 1;
      }
      this.devIsLodding = true;
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiOrder/GetOutLibPageList";
      this.$Axios({
        method: "POST",
        data: {
          status: this.searchData.state,
          stime: this.searchData.stime,
          etime: this.searchData.etime,
          appuser: this.searchData.appuser,
          page: this.searchData.page,
          size: this.searchData.size
        },
        url: url,
        success(res) {
          that.devIsLodding = false;
          if (res.status == 200) {
            if (res.data.data.length == 0 && this.searchData.page > 1) {
              this.searchData.page--;
              this.getOutLibPageList();
            }
            that.dataList = res.data.data;
            that.count = res.data.count;
          } else {
            that.$message.error("查询出库列表失败");
          }
        },
        error(err) {
          that.$message.error("查询出库列表失败");
        }
      });
    },
    /**
     * 显示设备查看弹窗
     */
    showLookDeviceDig(eid) {
      console.log(eid);
      this.getEquiInfo(eid).then(res => {
        this.getEquiImgs(eid).then(r => {
          this.curDevice.imgList = r.data;
          this.curDevice.typeName = res.data.equitypeName;
          this.showLookDevDig = true;
        });
      });
    },
    /**
     * 获取订单
     */
    getEquiOrder(orderid) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiOrder/GetEquiOrder";
        this.$Axios({
          method: "POST",
          data: {
            orderid: orderid,
            type: ""
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              that.curOutLib = clone(res.data);
              resolve(res);
            } else {
              reject(res);
              that.$message.error("查询出库详情失败");
            }
          },
          error(err) {
            that.$message.error("查询出库详情失败");
            reject(res);
          }
        });
      });
    },
    /**
     * 获取设备图片集合
     */
    getEquiImgs(devId) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiImgs";
        this.$Axios({
          method: "GET",
          data: {
            eid: devId
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              resolve(res);
            } else {
              that.$message.error("获取设备图片失败");
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 获取单个设备
     */
    getEquiInfo(id) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiInfo";
        this.$Axios({
          method: "GET",
          data: {
            id: id
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              this.curDevice = clone(res.data);
              resolve(res);
            } else {
              reject(res);
              that.$message.error("查询设备详情失败");
            }
          },
          error(err) {
            that.$message.error("查询设备详情失败");
            reject(res);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
@import "../../../../static/css/orderTableStyle.css";
.ourgoing-main {
  width: 100%;
  height: 89.84%;
}
.search-div {
  width: 100%;
  height: 16.23%;
  min-height: 100px;
  background: #fff;
  padding-top: 1.5%;
  margin-top: -2.3%;
}
.radio-search,
.date-search {
  text-align: left;
  margin-left: 2.9%;
  line-height: 50px;
}
.selectTime {
  display: inline-block;
  width: 350px;
}
.search-btn {
  width: 64px !important;
  height: 32px;
  background: #5996f8 !important;
  padding: 0px;
  margin-left: 25px !important;
  color: #fff !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  border-radius: 5px !important;
}

.div-table {
  width: 92.9%;
  height: 67.1%;
  margin: auto;
  margin-top: 1.9%;
  position: relative;
}

.table-detail {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  color: #5996f8;
}
.table-state1 {
  color: #ff9000;
}
.table-state2 {
  color: #ff0000;
}
>>> .radio-search .el-radio__inner {
  width: 21px;
  height: 21px;
}
>>> .el-radio__inner::after {
  display: none;
}
>>> .el-radio__input.is-checked .el-radio__inner {
  background: url("../../../../static/img/device/radio.png") !important;
}

/*表格样式*/
>>> .outgoing-header {
  height: 46px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
>>> .outgoing-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

>>> .outgoing-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  padding: 0px;
}
>>> .outgoing-row .cell {
  line-height: 46px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
>>> .outgoing-row:hover > td {
  background: #f0f0fa !important;
  color: #5996f8 !important;
}
>>> .outgoing-row1 td {
  background: #ffffff;
}

>>> .outgoing-row2 td {
  background: #f0f0f0;
}
</style>

<style>
/*设置页面弹窗居中*/
.ourgoing-main .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>


