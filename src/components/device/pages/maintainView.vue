<template>
  <div class="maintain-main">
    <div class="search-div">
      <div class="radio-search">
        <el-radio-group v-model="searchData.state" @change="getCheckFlowList">
          <el-radio label>全部状态</el-radio>
          <el-radio label="0">待审核</el-radio>
          <el-radio label="1">已审核</el-radio>
        </el-radio-group>
      </div>
      <div class="date-search">
        <div class="selectTime">
          <selectTime @getStartTime="getStartTime" @getEndTime="getEndTime"></selectTime>
        </div>
        <el-input
          size="small"
          v-model="searchData.username"
          placeholder="搜索报损人"
          style="width:200px;margin-left:15px"
        ></el-input>
        <el-button class="search-btn" @click="getCheckFlowList(true)">查询</el-button>
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
        <el-table-column prop="equiname" label="设备" :show-overflow-tooltip="true" min-width="26.5"></el-table-column>
        <el-table-column prop="ordertitle" :show-overflow-tooltip="true" label="订单" min-width="39"></el-table-column>
        <el-table-column prop="droptimeStr" label="报损时间" min-width="22.5"></el-table-column>
        <el-table-column prop="dropusername" label="报损人" min-width="20"></el-table-column>
        <el-table-column prop="dropStatus" label="状态" min-width="17.5">
          <template slot-scope="scope">
            <span
              :class="(scope.row.dropStatus=='待审核'?'table-state2':'table-state1')+' noSelect'"
            >{{scope.row.dropStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="16">
          <template slot-scope="scope">
            <span class="table-detail noSelect" @click="showCheckFlow(scope.row)">审核</span>
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
        @current-change="getCheckFlowList()"
        :current-page.sync="searchData.page"
      ></el-pagination>
    </div>

    <checkFlowDig
      :showCheckFlowDig="showCheckFlowDig"
      :curDamage="curDamage"
      @closeCheckFlowDig="showCheckFlowDig=false"
    ></checkFlowDig>
  </div>
</template>

<script>
import selectTime from "../../common/selectTime/selectTime";
import checkFlowDig from "../components/checkFlowDig"; //审核弹窗
export default {
  components: { selectTime, checkFlowDig },
  created() {
    this.loadResize();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDomHeight();
      }, 1);
    });
  },
  mounted() {
    this.getCheckFlowList(true);
  },
  data() {
    return {
      searchData: {
        state: "",
        stime: "",
        etime: "",
        username: "",
        page: 1,
        size: 10
      },
      radio: 3,
      dataList: [],
      curDamage: {},
      tableHeight: "610",
      tableBoxHeight: "",
      tipText: "",
      showCheckFlowDig: false,
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
    //自定义表格样式
    headerClassName({ row, rowIndex }) {
      return "maintain-header";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) {
        return "maintain-row maintain-row2";
      } else {
        return "maintain-row maintain-row1";
      }
    },
    getStartTime(startTime) {
      this.searchData.stime = startTime;
    },
    getEndTime(endTime) {
      this.searchData.etime = endTime;
      console.log("111", endTime);
    },

    /******************弹窗相关******************/
    /**
     * 打开审核弹窗
     */
    showCheckFlow(curData) {
      this.GetEquiDrop(curData.id);
      this.showCheckFlowDig = true;
    },

    /******************API相关******************/

    /**
     * 分页获取报损列表
     */
    getCheckFlowList(isInitPage = false) {
      if (isInitPage) {
        this.searchData.page = 1;
      }
      this.devIsLodding = true;
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiDropList";
      this.$Axios({
        method: "POST",
        data: {
          state: this.searchData.state,
          stime: this.searchData.stime,
          etime: this.searchData.etime,
          username: this.searchData.username,
          page: this.searchData.page,
          size: this.searchData.size
        },
        url: url,
        success(res) {
          that.devIsLodding = false;
          if (res.status == 200) {
            if (res.data.data.length == 0 && this.searchData.page > 1) {
              this.searchData.page--;
              this.getCheckFlowList();
            }
            that.count = res.data.count;
            that.dataList = res.data.data;
          } else {
            that.$message.error("查询报损列表失败");
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    },

    /**
     * 获取报损详情
     */
    GetEquiDrop(id) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiDrop";
        this.$Axios({
          method: "GET",
          data: {
            id: id
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              that.curDamage = clone(res.data.data);
              resolve(res);
            } else {
              reject(res);
              that.$message.error("查询报损详情失败");
            }
          },
          error(err) {
            that.$message.error(err);
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
.maintain-main {
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
  color: #808080;
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
>>> .maintain-header {
  height: 46px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
>>> .maintain-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

>>> .maintain-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  padding: 0px;
}
>>> .maintain-row .cell {
  line-height: 46px;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}
>>> .maintain-row:hover > td {
  background: #f0f0fa !important;
  color: #5996f8 !important;
}
>>> .maintain-row1 td {
  background: #ffffff;
}

>>> .maintain-row2 td {
  background: #f0f0f0;
}
</style>

<style>
/*设置页面弹窗居中*/
.maintain-main .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>


