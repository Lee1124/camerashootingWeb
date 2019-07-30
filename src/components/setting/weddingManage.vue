<template>
  <div class="wedding-content">
    <div class="wedding-seach">
      <div class="seach-left">
        <div class="seach-select">
          <!-- <inputSelect inputSearchPlaceholder="请选择城市" :listData="cityData" @inputFocus="getCityNews"></inputSelect> -->
          <el-select
            filterable
            v-model="searchParamet.CityId"
            size="small"
            clearable
            placeholder="请选择城市"
          >
            <el-option
              v-for="city in cityData"
              :key="city.CityId"
              :label="city.CityName"
              :value="city.CityId"
            ></el-option>
          </el-select>
        </div>
        <div class="seach-input">
          <el-input
            placeholder="搜索..."
            size="small"
            v-model="searchParamet.WeddingName"
            class="input-with-select"
          >
            <div class="search-div" slot="append" @click="getOrderWeddingInfo(true)">
              <img src="static\img\common\search.png" />
            </div>
          </el-input>
        </div>
      </div>
      <el-button @click="addWeddingDig">添加新婚庆</el-button>
    </div>
    <div class="wedding-table" ref="tableBox" v-loading="devIsLodding">
      <noData msg="暂无数据" v-if="weddingList.length==0"></noData>
      <el-table
        :data="weddingList"
        stripe
        border
        :max-height="tableHeight"
        :header-row-class-name="headerClassName"
        :row-class-name="rowClassName"
        highlight-current-row
        class="commonScrollStyle"
      >
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="WeddingName" label="婚庆" min-width="63"></el-table-column>
        <el-table-column prop="CityName" sortable label="城市" min-width="35"></el-table-column>
        <el-table-column prop="WeddingAddress" label="地址" min-width="86"></el-table-column>
        <el-table-column label="操作" min-width="44">
          <template slot-scope="scope">
            <span class="table-delete noSelect" @click="deleteDig(scope.row)">删除</span>
            <span class="table-detail noSelect" @click="detailDig(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div
      v-if="weddingList.length!=0"
      style="position: relative;bottom: -10px;left: 0px;right: 0;width:80.4%"
      class="clearfloat"
    >
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="allCount"
        :hide-on-single-page="true"
        :page-size="searchParamet.PageSize"
        @current-change="getOrderWeddingInfo(false)"
        :current-page.sync="searchParamet.PageIndex"
      ></el-pagination>
    </div>

    <!--删除弹窗-->
    <el-dialog
      title="删除提示"
      :modal="false"
      top="0"
      :visible.sync="showDeletwDig"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="delete-dialog"
    >
      <div class="delete-main">
        <div class="delete-tip">
          <span class="delete-tip1">是否确定删除该婚庆？</span>
          <span class="delete-tip2">• 包含"{{curWedding.WeddingName}}"全部资料信息</span>
        </div>
        <div class="delete-bottom">
          <el-button type="text" class="btn-cancel" @click="showDeletwDig=false">取消</el-button>
          <el-button class="btn-save" @click="addCameraWeedingInfo(curWedding,true)">确认删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!--详情弹窗-->
    <el-dialog
      title="婚庆详情"
      :modal="false"
      top="0"
      :visible.sync="showDetailDig"
      width="542px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      custom-class="detail-dialog"
    >
      <div class="detail-main">
        <div class="detail-item">
          <span class="span-title">城市：</span>
          <span class="span-value">{{curWedding.CityName}}</span>
        </div>
        <div class="detail-item">
          <span class="span-title">婚庆：</span>
          <span class="span-value">{{curWedding.WeddingName}}</span>
        </div>
        <div class="detail-item">
          <span class="span-title">地址：</span>
          <span class="span-value">{{curWedding.WeddingAddress}}</span>
        </div>
        <div class="detail-item">
          <span class="span-title">说明：</span>
          <span class="span-value">{{curWedding.Remark}}</span>
        </div>
        <div class="detail-button">
          <el-button @click="editWeddingDig">编辑</el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑弹窗-->
    <el-dialog
      :title="typeTitle+'婚庆'"
      :modal="false"
      top="0"
      :visible.sync="showEditlDig"
      width="542px"
      :close-on-click-modal="false"
      :before-close="cancelEdit"
      custom-class="editWedd-dialog"
    >
      <div class="edit-main">
        <div class="edit-item">
          <span class="span-title">城市：</span>
          <el-select
            v-model="editWedding.CityId"
            size="small"
            filterable
            class="span-value"
            placeholder="请选择城市"
          >
            <el-option
              v-for="city in cityData"
              :key="city.CityId"
              :label="city.CityName"
              :value="city.CityId"
            ></el-option>
          </el-select>
        </div>
        <div class="edit-item">
          <span class="span-title">婚庆：</span>
          <el-input size="small" v-model="editWedding.WeddingName" class="span-value"></el-input>
        </div>
        <div class="edit-item">
          <span class="span-title">地址：</span>
          <el-input size="small" v-model="editWedding.WeddingAddress" class="span-value"></el-input>
        </div>
        <div class="edit-item">
          <span class="span-title edit-area">说明：</span>
          <el-input type="textarea" v-model="editWedding.Remark" class="edit-value"></el-input>
        </div>
        <div class="edit-button">
          <el-button
            type="text"
            v-if="editWedding.WeddingId&&editWedding.WeddingId!=''"
            class="btn-cancel"
            @click="cancelEdit"
          >取消编辑</el-button>
          <el-button type="text" v-else class="btn-cancel" @click="showEditlDig=false">取消</el-button>
          <el-button
            class="btn-delete"
            v-if="editWedding.WeddingId&&editWedding.WeddingId!=''"
            @click="addCameraWeedingInfo(editWedding,true)"
          >删除</el-button>
          <el-button @click="addCameraWeedingInfo(editWedding,false)">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import inputSelect from "../common/inputSearch/inputSearch"; //搜索框
let id = "root"; //默认根节点id
export default {
  data() {
    return {
      weddingList: [],
      searchParamet: {
        CityId: "",
        WeddingName: "",
        PageIndex: 1,
        PageSize: 15
      },
      allCount: 0, //总条数
      cityData: [],
      currentPge: 1,
      curWedding: {
        WeddingId: "",
        WeddingName: "",
        CityId: "",
        WeddingAddress: "",
        Remark: "",
        BranchId: 0,
        IsUsed: true,
        CityName: ""
      },
      editWedding: {}, //编辑的婚庆信息
      showDeletwDig: false,
      showDetailDig: false,
      showEditlDig: false,
      tableHeight: "610",
      tableBoxHeight: "",
      devIsLodding: true,
      typeTitle: "新增"
    };
  },
  created() {
    this.loadResize();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDomHeight();
      }, 1);
    });
  },
  mounted() {
    this.getOrderWeddingInfo(true);
    this.getCityNews();
  },
  components: {},
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
    headerClassName({ row, rowIndex }) {
      return "wedding-header";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) {
        return "wedding-row wedding-row2";
      } else {
        return "wedding-row wedding-row1";
      }
    },
    /**
     * 关闭弹窗
     */
    handleClose(done) {
      done();
    },
    /**
     * 显示删除提示弹窗
     */
    deleteDig(weddingData) {
      this.curWedding = clone(weddingData);
      this.showDeletwDig = true;
    },
    /**
     * 显示详情弹窗
     */
    detailDig(weddingData) {
      this.curWedding = clone(weddingData);
      this.showDetailDig = true;
    },
    /**
     * 显示编辑弹窗
     */
    editWeddingDig() {
      this.editWedding = clone(this.curWedding);
      this.showDetailDig = false;
      this.typeTitle = "编辑";
      this.showEditlDig = true;
    },
    /**
     * 显示新增弹窗
     */
    addWeddingDig() {
      this.editWedding = {};
      this.typeTitle = "新增";
      this.showEditlDig = true;
    },
    /**
     * 取消编辑
     */
    cancelEdit() {
      this.showEditlDig = false;
      if (this.editWedding.WeddingId && this.editWedding.WeddingId != "") {
        this.showDetailDig = true;
      }
    },
    /**
     * 获取城市列表
     */
    getCityNews() {
      let that = this;
      let url =
        "/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCityList";
      this.$Axios({
        method: "POST",
        url: url,
        success(res) {
          if (res.data.status) {
            that.cityData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {}
      });
    },
    //搜索筛选
    filterCity(data, searchVal) {
      let filterData = data.filter(item => {
        if (item.name.indexOf(searchVal) != -1) {
          return item;
        }
      });
      this.cityData = filterData;
    },
    /** 
     * 获取婚庆列表 是否初始化页码
     */
    getOrderWeddingInfo(isInitPage = false) {
      if (isInitPage) {
        this.searchParamet.PageIndex = 1;
      }
      this.devIsLodding = true;
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderWeddingInfo`,
        data: {
          CityId: this.searchParamet.CityId,
          WeddingName: this.searchParamet.WeddingName,
          PageIndex: this.searchParamet.PageIndex,
          PageSize: this.searchParamet.PageSize
        },
        success(res) {
          that.devIsLodding = false;
          if (res.data.status) {
            if (res.data.data.length == 0 && this.searchParamet.PageIndex > 1) {
              this.searchParamet.PageIndex--;
              this.getOrderWeddingInfo();
            }
            that.weddingList = res.data.data;
            that.allCount = res.data.allCount;
          }
        },
        error(err) {
          console.log(err);
        }
      });
    },
    /**
     * 新增、编辑婚庆
     */
    addCameraWeedingInfo(weddingInfo, isDelete) {
      let that = this;
      let type = "add";
      if (isDelete) {
        type = "delete";
      } else {
        if (!weddingInfo.CityId || weddingInfo.CityId == "") {
          that.$message({
            message: "城市不能为空",
            type: "warning"
          });
          return;
        }
        if (!weddingInfo.WeddingName || weddingInfo.WeddingName == "") {
          that.$message({
            message: "婚庆名称不能为空",
            type: "warning"
          });
          return;
        }
        if (weddingInfo.WeddingId && weddingInfo.WeddingId != "") {
          type = "update";
        }
      }

      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/AddCameraWeedingInfo`,
        data: {
          CityId: weddingInfo.CityId,
          WeedingName: weddingInfo.WeddingName,
          WeedingAddress: weddingInfo.WeddingAddress,
          Remark: weddingInfo.Remark,
          Type: type,
          WeddingId: weddingInfo.WeddingId
        },
        success(res) {
          if (res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            that.showEditlDig = false;
            that.showDetailDig = false;
            this.showDeletwDig = false;
            that.getOrderWeddingInfo();
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    }
  }
};
</script>

<style scoped>
@import "../../../static/css/orderTableStyle.css";
.wedding-content {
  margin-left: 40px;
  height: 93%;
}
.wedding-seach {
  width: 80.4%;
  height: 12.5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wedding-table {
  width: 80.4%;
  height: 74%;
  position: relative;
}
.seach-left > div {
  display: inline-block;
}
.seach-input {
  margin-left: 10px;
}
.wedding-seach .el-button,
.detail-button .el-button,
.delete-bottom .el-button,
.edit-button .el-button {
  width: 96px;
  height: 34px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
}
.edit-button {
  margin-top: 35px;
  float: right;
}
.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}
.btn-delete {
  background: transparent !important;
  color: #5996f8 !important;
  border-color: #5996f8;
}
>>> textarea {
  resize: none;
}
.table-delete {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  text-decoration: underline;
  margin-right: 32px;
  cursor: pointer;
  color: #ffa200;
}
.table-detail {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  color: #5996f8;
}
.search-div {
  width: 40px;
  height: 24px;
  cursor: pointer;
  border-left: 1px solid #ddd;
}
.search-div img {
  margin-top: 4px;
}
/*删除弹窗*/
.delete-tip {
  margin-left: 88px;
  margin-top: 35px;
}

.delete-tip1 {
  width: 100%;
  display: inline-block;
  font-size: 22px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(76, 76, 76, 1);
}
.delete-tip2 {
  width: 380px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
  margin-top: 28px;
}

.delete-bottom {
  margin-top: 49px;
  margin-right: 62px;
  float: right;
}

/*详情弹窗*/
.detail-main,
.edit-main {
  width: 430px;
  height: 345px;
  padding-top: 50px;
  border-top: 1px solid #dddddd;
  margin: auto;
}
.edit-main {
  padding-top: 40px;
}

.detail-item,
.edit-item {
  text-align: left;
}
.span-title {
  width: 60px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 47px;
}
.edit-area {
  line-height: 30px;
  height: 100px;
}

.span-value {
  width: 210px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 47px;
}
.edit-value {
  width: 365px;
  height: 102px;
  margin-top: 8px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}

.detail-button {
  margin-top: 100px;
}

>>> .wedding-header {
  height: 46px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
>>> .wedding-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

>>> .wedding-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  padding: 0px;
}
>>> .wedding-row .cell {
  line-height: 46px;
}
>>> .wedding-row:hover > td {
  background: #f0f4fa !important;
  color: #5996f8 !important;
}
>>> .wedding-row1 td {
  background: #ffffff;
}

>>> .wedding-row2 td {
  background: #f0f0f0;
}
>>> .seach-select .el-select .el-input {
  width: 130px;
}
>>> .edit-item .el-select .el-input {
  width: 210px;
}
>>> .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

/*搜索框样式*/
>>> .seach-input .el-input-group--append .el-input__inner {
  border-right-color: transparent;
  width: 210px;
}
>>> .seach-input .el-input-group--append .el-input__inner:hover {
  border-right-color: #c0c4cc;
}
>>> .seach-input .el-input-group--append .el-input__inner:focus {
  border-right-color: #409eff;
}

>>> .seach-input .el-input-group__append {
  background: transparent;
  padding: 0;
}
</style>

<!--无scoped 覆盖框架默认样式-->
<style>
/*编辑信息弹窗*/
.detail-dialog,
.editWedd-dialog {
  width: 542px;
  height: 476px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

/*删除提示弹窗*/
.delete-dialog {
  width: 500px;
  height: 299px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.detail-dialog .el-dialog__header,
.editWedd-dialog .el-dialog__header {
  padding-top: 28px;
  padding-bottom: 24px;
  text-align: left;
}
.delete-dialog .el-dialog__header {
  padding-top: 35px;
}
.detail-dialog .el-dialog__title,
.editWedd-dialog .el-dialog__title {
  margin-left: 32px;
}
.detail-dialog .el-dialog__title,
.editWedd-dialog .el-dialog__title,
.delete-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.detail-dialog .el-dialog__body,
.editWedd-dialog .el-dialog__body,
.delete-dialog .el-dialog__body {
  padding: 0px !important;
}

.detail-dialog .el-dialog__headerbtn,
.editWedd-dialog .el-dialog__headerbtn {
  right: 50px;
}
.detail-dialog .el-dialog__headerbtn,
.editWedd-dialog .el-dialog__headerbtn,
.delete-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*设置页面弹窗居中*/
.wedding-content > .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}

.edit-value .el-textarea__inner {
  height: 100px;
}
</style>

