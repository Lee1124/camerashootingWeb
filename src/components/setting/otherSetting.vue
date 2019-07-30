<template>
  <div class="other-content commonScrollStyle">
    <div class="depart-item" v-for="(group,index) in otherList">
      <div class="item-top">
        <span>{{group.ParentName}}设置</span>
        <div class="group-add" @click="addOtherDig(group)">
          <div></div>
          <span>新增</span>
        </div>
      </div>
      <div class="table-div" ref="tableBox" v-loading="devIsLodding">
        <noData :msg="'暂无'+group.ParentName" v-if="group.ChildrenDictionaryList.length==0"></noData>
        <el-table
          :data="group.ChildrenDictionaryList"
          stripe
          border
          :max-height="tableHeight"
          header-row-class-name="depart-header"
          row-class-name="depart-row"
          highlight-current-row
          class="commonScrollStyle"
        >
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column
            prop="Name"
            :show-overflow-tooltip="true"
            :label="group.ParentName"
            min-width="70"
          ></el-table-column>
          <el-table-column label="操作" min-width="40">
            <template slot-scope="scope">
              <span
                class="table-delete noSelect"
                @click="deleteOtherDig(scope.row,group.ParentName)"
              >删除</span>
              <span class="table-edit noSelect" @click="editOtherDig(scope.row,group.ParentName)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="depart-item">
      <div class="item-top">
        <span>职务/头衔设置</span>
        <div class="group-add" @click="addOtherDig({},true)">
          <div></div>
          <span>新增</span>
        </div>
      </div>
      <div class="table-div" ref="tableBox" v-loading="devIsLodding">
        <noData msg="暂无职务" v-if="dictionaryList.length==0"></noData>
        <el-table
          :data="dictionaryList"
          stripe
          border
          :max-height="tableHeight"
          header-row-class-name="depart-header"
          row-class-name="depart-row"
          highlight-current-row
          class="commonScrollStyle"
        >
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="DutyName" :show-overflow-tooltip="true" label="职务/头衔" min-width="70"></el-table-column>
          <el-table-column label="操作" min-width="40">
            <template slot-scope="scope">
              <span class="table-delete noSelect" @click="deleteOtherDig(scope.row,'职务/头衔')">删除</span>
              <span class="table-edit noSelect" @click="editOtherDig(scope.row,'职务/头衔')">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="depart-item">
      <div class="item-top">
        <span>作品审核人设置</span>
        <div class="group-add" @click="addCheckUserDig({})">
          <div></div>
          <span>新增</span>
        </div>
      </div>
      <div class="table-div" ref="tableBox" v-loading="devIsLodding">
        <noData msg="暂无作品审核人" v-if="checkUserList.length==0"></noData>
        <el-table
          :data="checkUserList"
          stripe
          border
          :max-height="tableHeight"
          header-row-class-name="depart-header"
          row-class-name="depart-row"
          highlight-current-row
          class="commonScrollStyle"
        >
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="username" :show-overflow-tooltip="true" label="审核人" min-width="70"></el-table-column>
          <el-table-column label="操作" min-width="40">
            <template slot-scope="scope">
              <span class="table-delete noSelect" @click="deleteCheckUserDig(scope.row)">删除</span>
              <span class="table-edit noSelect" @click="addCheckUserDig(scope.row)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--编辑新增弹窗-->
    <el-dialog
      :title="digTitle+deleteType"
      :modal="false"
      :visible.sync="showOtherDig"
      width="472px"
      top="0"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="otherAdd-dialog"
    >
      <div class="otherAdd-main">
        <div>
          <el-input
            size="small"
            class="other-name"
            v-model="curOther.Name"
            :placeholder="'请输入'+deleteType"
          ></el-input>
        </div>
        <div class="otherAdd-bottom">
          <el-button type="text" class="btn-cancel" @click="showOtherDig=false">取消</el-button>
          <el-button class="btn-save" @click="editOrAddOther()">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!--删除弹窗-->
    <el-dialog
      title="删除提示"
      :modal="false"
      :visible.sync="showDeletwDig"
      width="500px"
      top="0"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="delete-dialog"
    >
      <div class="delete-main">
        <div class="delete-tip">
          <span class="delete-tip1">是否确定删除该{{deleteType}}？</span>
          <span class="delete-tip2">•"{{curOther.Name}}"{{deleteType}}删除后如遇到问题，请及时联系管理员</span>
        </div>
        <div class="delete-bottom">
          <el-button type="text" class="btn-cancel" @click="showDeletwDig=false">取消</el-button>
          <el-button class="btn-save" @click="deleteOther">确认删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!--删除弹窗(仅删除审核人)-->
    <el-dialog
      title="删除提示"
      :modal="false"
      :visible.sync="showDeletwDig1"
      width="500px"
      top="0"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="delete-dialog"
    >
      <div class="delete-main">
        <div class="delete-tip">
          <span class="delete-tip1">是否确定删除该审核人？</span>
          <span class="delete-tip2">•"{{curCheckUser.username}}"删除后如遇到问题，请及时联系管理员</span>
        </div>
        <div class="delete-bottom">
          <el-button type="text" class="btn-cancel" @click="showDeletwDig1=false">取消</el-button>
          <el-button class="btn-save" @click="addUpdateCameraCheckTypeUser({},true)">确认删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!--人员选择弹窗-->
    <personSelectDiaLog :showPersonSelectDiaLog="showPersonSelectDiaLog"></personSelectDiaLog>
  </div>
</template>
<script>
import personSelectDiaLog from "../orderManage/diaLog/personSelectDiaLog"; //人员选择
export default {
  data() {
    return {
      searchStr: "",
      otherList: [],
      curOther: {
        Id: "",
        Name: ""
      },
      curCheckUser: {},
      dictionaryList: [], //职务列表
      checkUserList: [], //初稿审核人列表
      digTitle: "",
      showOtherDig: false,
      showDeletwDig1: false,
      showDeletwDig: false,
      showPersonSelectDiaLog: false, //是否显示人员选择弹窗
      isEditPerson: false, //是否为编辑审核人
      tableHeight: "235",
      tableBoxHeight: "",
      devIsLodding: true,
      deleteType: "订单来源"
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
    this.getMyBranchOtherList();
    this.getCameraDutyListByBranch();
    this.getCameraCheckTypeUser();
  },
  components: { personSelectDiaLog },
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
      if (this.tableBoxHeight) {
        this.tableHeight = this.tableBoxHeight;
      }
      console.log("tableHeight", this.tableHeight);
    },
    //人员选择回传的信息
    getSelectedNews(itemObj) {
      this.addUpdateCameraCheckTypeUser(itemObj);
    },
    /**
     * 关闭弹窗
     */
    handleClose(done) {
      done();
    },
    /**
     * 显示人员选择弹窗
     */
    addCheckUserDig(curCheck) {
      this.curCheckUser = curCheck;
      this.showPersonSelectDiaLog = true;
    },
    //关闭弹框
    closeDialog() {
      this.showPersonSelectDiaLog = false;
    },

    /**
     * 显示编辑弹窗
     */
    editOtherDig(row, groupName) {
      this.leaderList = [];
      this.defaultUserList = [];
      this.curOther = clone(row);
      this.digTitle = "编辑";
      this.deleteType = groupName;
      this.showOtherDig = true;
    },
    /**
     * 显示新增弹窗
     */
    addOtherDig(group, isDuty = false) {
      this.leaderList = [];
      this.curOther = {};
      this.digTitle = "新增";
      if (isDuty) {
        this.deleteType = "职务/头衔";
      } else {
        this.deleteType = group.ParentName;
        this.curOther.ParentId = group.ParentId;
      }
      this.showOtherDig = true;
    },
    /**
     * 确认新增、编辑岗位
     */
    editOrAddOther() {
      if (this.deleteType == "职务/头衔") {
        this.addUpdateCameraDutyList(false);
      } else {
        this.operateOther(false);
      }
    },
    /**
     * 显示删除提示弹窗
     */
    deleteOtherDig(row, groupName) {
      this.curOther = clone(row);
      this.deleteType = groupName;
      this.showDeletwDig = true;
    },
    /**
     * 显示删除提示弹窗(审核人)
     */
    deleteCheckUserDig(row) {
      this.curCheckUser = clone(row);
      this.showDeletwDig1 = true;
    },
    /**
     * 确认删除岗位
     */
    deleteOther(isDuty = false) {
      if (this.deleteType == "职务/头衔") {
        this.addUpdateCameraDutyList(true);
      } else {
        this.operateOther(true);
      }
    },
    /**
     * 获取当前店铺的字典列表
     */
    getMyBranchOtherList() {
      let that = this;
      this.devIsLodding = true;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/GetCameraDictionaryListByBranch`,
        data: {},
        success(res) {
          that.devIsLodding = false;
          if (res.data.status) {
            that.otherList = res.data.data;
            // res.data.data.forEach(other => {
            //   let info = {
            //     groupName: other.ParentName,
            //     otherInfo: other.ChildrenDictionaryList
            //   };
            //   that.otherList.push(info);
            // });
          }
        },
        error(err) {
          console.log(err);
        }
      });
    },
    /**
     * 获取当前店铺的审核人列表
     */
    getCameraCheckTypeUser() {
      let that = this;
      this.devIsLodding = true;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/GetCameraCheckTypeUser`,
        data: {
          CheckType: "初稿审核"
        },
        success(res) {
          that.devIsLodding = false;
          if (res.data.status) {
            that.checkUserList = res.data.data;
            // res.data.data.forEach(other => {
            //   let info = {
            //     groupName: other.ParentName,
            //     otherInfo: other.ChildrenDictionaryList
            //   };
            //   that.otherList.push(info);
            // });
          }
        },
        error(err) {
          console.log(err);
        }
      });
    },

    /**
     * 新增、修改、删除字典  (是否为删除)
     */
    operateOther(isDelete) {
      let type = "";
      if (isDelete) {
        type = "Delete";
      } else if (this.curOther.Id && this.curOther.Id != "") {
        type = "Update";
      } else {
        type = "Add";
      }
      if (type == "Add" || type == "Update") {
        if (!this.curOther.Name || this.curOther.Name == "") {
          this.$message({
            message: `${this.deleteType}不能为空`,
            type: "warning"
          });
          return;
        }
      }
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/AddUpdateCameraDictionaryList`,
        data: {
          ParentId: this.curOther.ParentId,
          Name: this.curOther.Name,
          DictionaryId: this.curOther.Id,
          Type: type
        },
        success(res) {
          if (res.data.status) {
            if (type == "Delete") {
              this.showDeletwDig = false;
            } else {
              this.showOtherDig = false;
            }
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getMyBranchOtherList();
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    },
    /**
     * 获取职务列表
     */
    getCameraDutyListByBranch() {
      this.devIsLodding = true;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/GetCameraDutyListByBranch`,
        data: {},
        success(res) {
          this.devIsLodding = false;
          if (res.data.status) {
            this.dictionaryList = res.data.data;
            this.dictionaryList.forEach(d => {
              d.Name = d.DutyName;
            });
          }
        },
        error(err) {
          console.log(err);
        }
      });
    },
    /**
     * 新增修改删除职务
     */
    addUpdateCameraDutyList(isDelete = false) {
      let type = "";
      if (isDelete) {
        type = "Delete";
      } else if (this.curOther.DutyId && this.curOther.DutyId != "") {
        type = "Update";
      } else {
        type = "Add";
      }
      if (type == "Add" || type == "Update") {
        if (!this.curOther.Name || this.curOther.Name == "") {
          this.$message({
            message: `${this.deleteType}不能为空`,
            type: "warning"
          });
          return;
        }
      }
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/AddUpdateCameraDutyList`,
        data: {
          DutyId: this.curOther.DutyId,
          Name: this.curOther.Name,
          Type: type
        },
        success(res) {
          if (res.data.status) {
            if (type == "Delete") {
              this.showDeletwDig = false;
            } else {
              this.showOtherDig = false;
            }
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getCameraDutyListByBranch();
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    },
    /**
     * 新增修改删除审核人
     */
    addUpdateCameraCheckTypeUser(itemObj, isDelete = false) {
      let type = "";
      if (isDelete) {
        type = "Delete";
      } else if (this.curCheckUser.ID && this.curCheckUser.ID != "") {
        type = "Update";
      } else {
        type = "Add";
      }
      if (type == "Add" || type == "Update") {
        if (itemObj.UserId == "") {
          this.$message({
            message: `审核人不能为空`,
            type: "warning"
          });
          return;
        }
      }
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraDictionaryInfo/AddUpdateCameraCheckTypeUser`,
        data: {
          CheckType: "初稿审核",
          AddUserId: itemObj.UserId,
          AmountCheckId: this.curCheckUser.ID,
          Type: type
        },
        success(res) {
          if (res.data.status) {
            if (type == "Delete") {
              this.showDeletwDig1 = false;
            }
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getCameraCheckTypeUser();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
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
.other-content {
  margin: auto;
  width: 94%;
  height: 90%;
  max-height: 90%;
  overflow-y: auto;
  padding-left: 30px;
  display: flex;
  flex-wrap: wrap;
}

.table-edit {
  cursor: pointer;
  color: #5996f8;
}

.table-delete {
  cursor: pointer;
  color: #ff8a00;
  margin-right: 22.8%;
}
.group-add {
  display: flex;
  cursor: pointer;
}
.group-add div {
  width: 18px;
  height: 17px;
  background: url("../../../static/img/order/add0.png") no-repeat center center;
}
.group-add:hover span {
  color: #5996f8;
}
.group-add:hover div {
  background: url("../../../static/img/order/add1.png") no-repeat center center !important;
}

.group-add span {
  margin-left: 15px;
  font-weight: 400 !important;
}

/*弹窗样式 (编辑信息)*/
.otherAdd-main {
  width: 345px;
  height: 142px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 30px auto 0;
}

.otherAdd-main .from-title {
  width: 90px;
  display: inline-block;
  text-align: right;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
  line-height: 32px;
}

.otherAdd-main .otherAdd-bottom {
  width: 100%;
  height: 95px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.otherAdd-main .otherAdd-bottom .el-button {
  margin: 0 0 0 30px;
}

.other-content .el-button {
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

.other-name {
  width: 270px;
  height: 32px;
  border-radius: 5px;
}
.add-img {
  max-width: 17px;
  max-height: 17px;
  cursor: pointer;
}

.leader-span {
  display: inline-block;
  padding: 0 5px;
  min-width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: #5996f8 1px solid;
  border-radius: 4px;
}
.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}

.depart-item {
  width: 39.3%;
  height: 42%;
  padding: 5px 40px;
  margin: 2.3% 2.3% 0px 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.item-top {
  width: 100%;
  height: 19.4%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-top span {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #4c4c4c;
}
.item-top img {
  max-width: 18px;
  max-height: 17px;
  cursor: pointer;
}

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
  margin-top: 39px;
  margin-right: 62px;
  float: right;
}

.leader-div {
  display: inline-block;
}
.leader-div:hover img {
  visibility: visible;
}
.leader-delete {
  position: relative;
  top: -13px;
  right: 13px;
  visibility: hidden;
}
.table-div {
  width: 100%;
  height: 70.3%;
  position: relative;
}
>>> .depart-header {
  height: 34px;
  background: #bbbbbb !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
>>> .depart-header th {
  background: #bbbbbb !important;
  text-align: center;
  padding: 0px;
}

>>> .depart-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  padding: 0px;
}
>>> .depart-row .cell {
  line-height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<!--无scoped 覆盖框架默认样式-->
<style>
/* .otherAdd-dialog .el-input__inner {
  width: 184px;
  height: 32px;
  padding-left: 12px;
} */

/*编辑信息弹窗*/
.otherAdd-dialog {
  width: 472px;
  height: 296px;
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

.otherAdd-dialog .el-dialog__header,
.delete-dialog .el-dialog__header {
  padding-top: 35px;
}
.otherAdd-dialog .el-dialog__title,
.delete-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.otherAdd-dialog .el-dialog__body,
.delete-dialog .el-dialog__body {
  padding: 0px !important;
}

.otherAdd-dialog .el-dialog__headerbtn,
.delete-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*设置页面弹窗居中*/
.other-content > .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>

