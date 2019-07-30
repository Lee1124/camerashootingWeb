<!--添加设备-->
<template>
  <div id="addSheBeiDiaLog">
    <el-dialog
      title="添加设备"
      :visible.sync="showAddSheBeiDiaLog"
      custom-class="commonDiaLog addSheBeiDiaLog"
      :modal="false"
      @open="openEvent"
      :close-on-click-modal="false"
      :before-close="beforeCloseEvent"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <div class="content">
        <div class="commonBox filterNav floatL">
          <div class="search">
            <search @searchNews="searchNews" searchPlaceholderText="查询设备..." ref="mySearch"></search>
          </div>
          <div class="nav commonScrollStyle">
            <template v-for="(items,index) in menuList1">
              <div class="list" @click="selectThis(items,1)">
                <i class="el-icon-arrow-down" v-show="!items.isSelected"></i>
                <i class="el-icon-arrow-up" v-show="items.isSelected"></i>
                <span v-text="items.name"></span>
                <transition name="slide-fade">
                  <div class="innerListBox" v-show="items.isSelected">
                    <template v-for="(items2,index2) in items.data">
                      <div class="innerList" @click.stop="selectThis(items2,2)">
                        <span v-cloak :class="{innerColor:items2.isSelected}">
                          <span class="text">{{items2.name}}({{items2.count}})</span>
                           <p class="line" v-show="items2.isSelected"></p>
                        </span>
                      </div>
                    </template>
                  </div>
                </transition>
              </div>
            </template>
          </div>
        </div>
        <div class="commonBox returnList floatR">
          <div class="title">{{sheBeiTitle}}</div>
          <div style="position: relative;">
            <noData msg="暂无相关数据" v-if="tableData.length==0"></noData>
            <el-table
              :data="tableData"
              border
              max-height="350px"
              :style="{borderTop:0}"
              :header-row-class-name="headerClassName"
              :row-class-name="rowClassName"
              ref="table"
              style="width: 100%;text-align: center">
              <el-table-column
                label="序号"
                type="index"
                width="50px"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                label="设备"
                prop="name"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                label="当前状态"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.state==1" style="color: #FF0000;" v-cloak>不可用</span>
                  <span v-if="scope.row.state==0" style="color: #808080;" v-cloak>可用</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                  <span class="btn btn1" @click="lookDetails(scope.row)">查看</span>
                  <span class="btn btn2" @click="selectedThis(scope.row)">选择</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
    <sheBeiDetailsDiaLog :showSheBeiDetailsDiaLog="showSheBeiDetailsDiaLog"></sheBeiDetailsDiaLog>
  </div>
</template>

<script>
  import sheBeiDetailsDiaLog from '../diaLog/sheBeiDetailsDiaLog';//设备详情
  /*方法*/
  let myMethods = {
    /*查看详情*/
    lookDetails(rowObj){
      this.showSheBeiDetailsDiaLog=true;
      this.keepRowObj={
        Equid:rowObj.id
      };
    },
    /*选取当前*/
    selectedThis(rowObj){
      this.$emit('selectedThis',rowObj)
    },
    close() {
      this.$parent.closeDialog();
    },
    openEvent() {
      this.getMenuList1();
      setTimeout(()=>{
        this.clearData();
      })
    },
    //打开时清除部分数据
    clearData(){
      this.$refs.mySearch.searchText='';
      this.selectedRowData={};
      this.tableData=[];
      this.sheBeiTitle='请选择设备类型';
    },
    /*获取左边列表最外层数据*/
    getMenuList1() {
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/GetEquiBaseList';
      this.$Axios({
        method: 'GET',
        url: url,
        success(res) {
          // console.log(res);
          if (res.status == 200) {
            res.data.forEach((item, index, arr) => {
              arr[index].isSelected = false;
              arr[index].data = [];
              this.getMenuList2(arr[index],'');
            });
            this.menuList1 = res.data;
          } else {
            this.$message({
              message: res.statusText,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    /*获取左边列表里层数据*/
    getMenuList2(itemObj,searchText) {
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/EquiTypeList';
      let data = {
        baseid: itemObj.id,
        like: searchText
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            res.data.forEach((item, index, arr) => {
              arr[index].isSelected = false;
              if (this.selectedRowData.id==arr[index].id){
                arr[index].isSelected=true;
              }
            });
            itemObj.data = res.data;
            this.devTypeList=this.devTypeList.concat(res.data)
          } else {
            this.$message({
              message: res.statusText,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    /*查询菜单列表*/
    searchNews(val) {
      this.searchText=val;
      this.menuList1.forEach((item, index, arr) => {
        this.getMenuList2(arr[index],val);
      });
      this.typeIsSelected();
      this.getSheBeiList();
    },
    /*判断那种类型被选中*/
    typeIsSelected(){
      this.menuList1.forEach((item,index,arr)=>{
        arr[index].data.forEach((item2,index2,arr2)=>{
          if (arr2[index2].isSelected){
            this.selectedRowData=arr2[index2];
          }
        })
      });
    },
    //选中菜单最外面/里面事件
    selectThis(itemObj, type) {
      if (type == 1) {
        itemObj.isSelected = !itemObj.isSelected;
      } else if (type == 2) {
        this.menuList1.forEach((item,index,arr)=>{
          arr[index].data.forEach((item2,index2,arr2)=>{
            arr2[index2].isSelected=false;
          })
        });
        itemObj.isSelected = true;
        this.typeIsSelected();
        this.getSheBeiList();
      }
    },
    /*根据选择获取右边列表*/
    getSheBeiList(){
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/GetEquiInfoList';
      let data = {
        page: 1,
        size: 1000,
        typeid: this.selectedRowData.id,
        like: this.searchText,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            this.tableData=res.data;
            this.sheBeiTitle=this.selectedRowData.name+'('+this.tableData.length+')';
          } else {
            this.$message({
              message: res.statusText,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    beforeCloseEvent(){
      console.log('进来')
    },
    headerClassName({row, rowIndex}) {
      return 'tableHeaderStyle'
    },
    rowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'tableRowStyle tableRow2nStyle'
      } else {
        return 'tableRowStyle tableRow1nStyle'
      }
    },

  };
  export default {
    name: "addSheBeiDiaLog",
    props: ['showAddSheBeiDiaLog'],
    components:{
      sheBeiDetailsDiaLog
    },
    data() {
      return {
        menuList1: [],//菜单1
        tableData: [],//右边表格数据
        sheBeiTitle:'',
        isShowNoData:false,
        selectedRowData:{},//选中类型的数据
        searchText:'',//查询的关键词
        showSheBeiDetailsDiaLog:false,
        keepRowObj:{},
        devTypeList:[],
      };
    },
    methods: myMethods,
    created() {
    },
    mounted() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  @import "../../../../static/css/tableStyle.css";
  #noData{
    height: 350px!important;
    margin-top: -1px!important;
  }
  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    /*opacity: 0;*/
    height: 0;
  }

  /*添加设备弹框样式*/

  >>> .addSheBeiDiaLog {
    padding: 0 50px 40px;
    width: 60%;
    height: 72%;
    min-height: 580px;
    min-width: 920px;
  }

  >>> .addSheBeiDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .addSheBeiDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .addSheBeiDiaLog .el-dialog__body {
    height: 88%;
  }

  >>> .addSheBeiDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  >>> .addSheBeiDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .addSheBeiDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  >>> .addSheBeiDiaLog .closeIcon {
    right: 40px;
    top: 26px;
  }

  /*内容区*/
  .content {
    height: 100%;
    text-align: left;
    padding: 30px 0 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content .commonBox {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.13);
    border-radius: 5px;
  }

  .filterNav {
    width: 22.6%;
    height: 100%;
    padding: 20px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .returnList {
    width: 72.5%;
    height: 100%;
    padding: 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .returnList .title {
    color: #4C4C4C;
    font-size: 15px;
    margin-bottom: 23px;
  }

  .nav {
    margin-top: 5px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 92%;
    overflow-y: auto;
  }

  .nav .list {
    height: auto;
    min-height: 66px;
    /*line-height: 66px;*/
    padding-top: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #F5F5F5;
    font-size: 14px;
    color: #808080;
    cursor: pointer;
  }

  .nav .list i {
    margin-right: 5px;
  }

  .nav .innerList {
    height: 54px;
    color: #1D213E;
    transition: all .2s;
    position: relative;
  }
  .nav .innerList .text{
    position: absolute;
    left: 2em;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .nav .innerListBox {
    padding: 2px 0;
    overflow: hidden;
  }

  .nav .innerList:hover {
    background: #F0F4F9;
    color: #5996F8;
  }

  .nav .innerList .line {
    width: 40px;
    height: 1px;
    background: rgba(89, 150, 248, 1);
    position: absolute;
    bottom: 0;
    left: 2em;
  }

  .nav .innerList .innerColor {
    color: #5996F8;
  }

  .btn {
    text-decoration: underline;
    cursor: pointer;
  }

  .btn1 {
    margin-right: 15px;
    color: #FF6600;
  }

  .btn2 {
    color: #5996F8;
  }

</style>
