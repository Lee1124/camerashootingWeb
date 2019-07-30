<!--人员管理选择弹框-->
<template>
  <div id="personSelect">
    <el-dialog
      title="人员选择"
      :visible.sync="showPersonSelectDiaLog"
      custom-class="commonDiaLog personSelectDiaLog"
      :modal="false"
      :before-close="closeBefore"
      :close-on-click-modal="false"
      @open="openEvent"
      :show-close="false">
      <i class="closeIcon" @click="closeDiaLog($event,'personSelect')"></i>
      <div class="content">
        <div class="search clearfloat">
          <div class="searchSmallBox selectDepartment">
            <dropSelect1 :options="departmentList" ref="childDropSelect1_department"
                         dropSelect1Placeholder="请选择部门"></dropSelect1>
          </div>
          <div class="searchSmallBox userName">
            <commonInput ref="childCommonInput_userName" inputPlaceholderText="输入用户名"></commonInput>
          </div>
          <div class="searchSmallBox todayArrange">
            <el-checkbox v-model="todayArrangeChecked">当天已安排</el-checkbox>
          </div>
          <div class="searchSmallBox searchBtn">
            <button @click="queryNews">查询</button>
          </div>
        </div>

        <div class="table" style="position: relative;">
          <noData msg="暂无相关数据" v-if="isShowNoData"></noData>
          <el-table
            v-loading="isShowMyLoading"
            :data="personSelectList"
            border
            max-height="300"
            :style="{borderColor:'#DDD',borderBottom:'1px solid #DDD'}"
            :header-row-class-name="personSelectHeaderClassName"
            :row-class-name="personSelectRowClassName"
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="userName"
              align="center"
              width="110px"
              show-overflow-tooltip
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="department"
              align="center"
              width="110px"
              show-overflow-tooltip
              label="部门">
            </el-table-column>
            <el-table-column
              prop="position"
              align="center"
              width="110px"
              show-overflow-tooltip
              label="职位">
            </el-table-column>
            <el-table-column
              prop="orderNum"
              align="center"
              width="110px"
              show-overflow-tooltip
              label="订单量">
            </el-table-column>
            <el-table-column
              align="center"
              width="119px"
              label="操作">
              <template slot-scope=scope>
                <span style="cursor:pointer;" @click="selectThisPerson(scope.row)">选择</span>
                <!--<span>|</span>-->
                <!--<span style="cursor:pointer;">查看工作量</span>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    todayArrangeChecked: true,
    personSelectList: [],
    departmentId: '',
    likeName: '',
    /*部门列表*/
    departmentList: [],
    isShowMyLoading:false,
    isShowNoData:false,
  };
  /*方法*/
  let myMethods = {
    //确定
    Confirm(type) {
      this.$parent.Confirm(type);
    },
    //关闭弹框
    closeDiaLog() {
      this.$parent.closeDialog('selectPerson');
    },
    closeBefore() {

    },
    //显示事件
    openEvent() {
      this.isShowMyLoading=true;
      this.getDepartmentList();
      this.getPersonList();
    },

    //获取部门列表
    getDepartmentList() {
      let url = '/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchDepartmentList';
      let data = {
        BranchId: getkevalue().branchid
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            res.data.data.forEach((item, index, arr) => {
              arr[index].label = arr[index].DepartmentName;
              arr[index].value = arr[index].DepartmentId;
            });
            this.departmentList = res.data.data;
            this.isShowMyLoading=false;
          }
        }
      })
    },

    //获取人员选择列表
    getPersonList() {
      this.isShowNoData=true;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetUserInfoByDepartmentOrLikeName';
      let data = {
        DepartmentId: this.departmentId,
        LikeName: this.likeName,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            res.data.data.forEach((item, index, arr) => {
              arr[index].userName = arr[index].UserName;
              arr[index].department = arr[index].DepartmentName;
              arr[index].position = arr[index].DutyName;
              arr[index].orderNum = arr[index].UserOrderCount;
            });
            this.personSelectList = res.data.data;
            if (this.personSelectList.length==0){
              this.isShowNoData=true;
            } else {
              this.isShowNoData=false;
            }
          }
        }
      })
    },
    //根据条件查询
    queryNews() {
      let departmentValue = this.$refs.childDropSelect1_department.dropSelectValue;
      let userNameValue = this.$refs.childCommonInput_userName.inputValue;
      this.departmentId = departmentValue;
      this.likeName = userNameValue;
      this.getPersonList();
    },
    /*=====选择当前人员=====*/
    selectThisPerson(rowObj){
      // this.rowObj=rowObj;
      this.$parent.getSelectedNews(rowObj);
      this.$parent.closeDialog('selectPerson');
    },
    //人员选择表头类名
    personSelectHeaderClassName() {
      return 'personSelectHeaderStyle'
    },
    //人员选择表格类名
    personSelectRowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'personSelectTableRowStyle personSelectTableRow2nStyle'
      } else {
        return 'personSelectTableRowStyle personSelectTableRow1nStyle'
      }
    },
  };
  export default {
    name: "personSelect",
    props: ['showPersonSelectDiaLog'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
    },
    mounted() {
    },
    updated() {
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .el-dialog__footer {
    position: absolute;
    left: 50%;
    bottom: 35px;
    width: 100%;
    text-align: center;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  #noData {
    height: 295px !important;
    margin-top: -2px!important;
  }

  /*添加人员*/
  >>> .personSelectDiaLog {
    width: 710px;
    height: 475px;
    padding: 0 50px 45px;
    margin-top: 0!important;
  }

  >>> .personSelectDiaLog .closeIcon {
    right: 50px;
    top: 30px;
  }

  >>> .personSelectDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .personSelectDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  .search {
    margin: 20px 0;
  }

  .searchSmallBox {
    width: 160px;
    height: 32px;
    float: left;
    margin-right: 10px;
    line-height: 32px;
  }

  .searchSmallBox:last-of-type {
    width: 70px;
  }

  .todayArrange >>> .el-checkbox__inner {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    text-align: center;
    line-height: 23px;
  }

  .todayArrange >>> .el-checkbox__label {
    color: #B2B2B2;
  }

  .todayArrange >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409EFF;
  }

  .todayArrange >>> .el-checkbox__inner::after {
    left: 9px;
    top: 6px;
    -webkit-transform: rotate(45deg) scale(1.2);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg) scale(1.2);
  }

  .searchBtn button {
    width: 64px;
    height: 32px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    outline: none;
    border: 0;
    cursor: pointer;
    font-size: 14px;
    color: #FFF;
    transition: all .2s;
  }

  .searchBtn button:hover {
    background: rgba(89, 150, 248, .9);
  }

  >>> .personSelectHeaderStyle th {
    color: #FFF;
    background: #BBBBBB;
    height: 34px;
    padding: 0;
    font-size: 14px;
    border-color: #DDD;
  }

  >>> .personSelectTableRowStyle td {
    height: 34px;
    padding: 0;
    color: #4C4C4C;
    font-size: 14px;
    border-top: 0;
    border-bottom: 0;
    border-color: #DDD;
  }

  >>> .personSelectTableRowStyle:hover td {
    background: #F0F4FA;
    color: #5996F8;
  }

  >>> .personSelectTableRow1nStyle td {
    background: #FFFFFF;
  }

  >>> .personSelectTableRow2nStyle td {
    background: #F5F5F5;
  }

  >>> .el-table--border::after, .el-table--group::after {
    height: 100%;
  }

</style>

