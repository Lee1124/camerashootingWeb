<!--支付对象表格-->
<template>
  <div>
    <div style="margin: 15px 0;text-align: left" class="clearfloat">
      <el-input style="width: 190px;float: left;height: 32px" slot="prepend" v-model="FORM_DATA.like" placeholder="请输入支付对象名称..."></el-input>
      <el-button @click="FORM_DATA.page = 1;handlerInit_DATA()" style="float: left;height: 32px" slot="append" icon="el-icon-search" ></el-button>
    </div>
    <div style="position: relative">
      <noData msg="暂无数据" v-if="tableData.length == 0"></noData>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="350"
        :header-row-class-name="headerClassName"
        class="tav-column"
        :row-class-name="handlertableRowClassName"
        lazy>
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="支付对象"
          prop="Name">
        </el-table-column>
        <el-table-column
          label="负责人"
          prop="Name">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="Phone">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="props">
            <span style="text-decoration: underline;color: #FF8A00;cursor: pointer"  @click="handleDetelSell(props.row)">删除</span>
            <span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleEnLook(props.row)">编辑</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div v-if="total > 8" style="position: relative;width: 100%;height: 50px">
      <div  style="position: absolute;bottom: 10px;left: 0px;right: 0;" class="clearfloat">
      <span style="position: absolute;
    left: 35px;
    right: 0px;
    bottom: 7px;
      width: max-content;font-size: 14px;color: #4c4c4c;">共{{ total }}条内容</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="8"
          @current-change="handleSizeChange"
          :current-page="currentPge"
        >
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "ZhiFuDuiXiang",
        data(){
          return {
            tableData:[],
            total:0,          //总数
            currentPge:1,     //初始化当前页
            FORM_DATA:{
              page:1,           //当前页
              size:8,
              like:"",        //支付对象
            },
            row:null,                 //当前列信息
          }
        },
        methods:{
          //初始化数据
          handlerInit_DATA(){
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/AmountSet/GetSupplierList',
              data:{
                ...this.FORM_DATA
              },
              success(res){
                this.total = res.data.count;
                this.tableData = [...res.data.t_PUB_SUPPLIERs]
              },
              error(err){
                console.log(err)
              }
            });
          },
          //分页
          handleSizeChange( val ){
            this.FORM_DATA.page = val;      //当前页
            this.handlerInit_DATA()
          },
          //删除
          handleDetelSell(row){
            this.row = row
            let _that = this.$parent
            _that.tip = {
              dialogVisible:true,
              primary:this.handlerPrimary,
              title:'删除支付对象',
              footer:['取消','确认删除'],
              bodyTitle:'确认删除该支付对象?确认继续',
            }
          },
          handlerPrimary(){
            let _that = this.$parent
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/AmountSet/DelSupplier',
              data:{
                id:this.row.Id
              },
              success(res){
                if(res.data){
                  this.$tips('删除成功!')
                  _that.tip.dialogVisible = false
                  this.handlerInit_DATA()
                }else{
                  this.$warning('删除失败!')
                }


              },
              error(err){
                console.log(err)
              }
            });
          },
          //编辑
          handleEnLook(row){
            this.row = row
            let _that = this.$parent
            _that.Addplay.Visible = true
            _that.Addplay.callback = this.handlerEdit
            _that.Addplay.title = '编辑支付对象'
           this.$nextTick(()=> {
             console.log(row)
             _that.$refs.Addplays.FromData.Explain = row.Remark
             _that.$refs.Addplays.FromData.address = row.Address
             _that.$refs.Addplays.FromData.phone = row.Phone
             _that.$refs.Addplays.FromData.title = row.Name
             _that.$refs.Addplays.FromData.id = row.Id
             // _that.$refs.Addplays.FromData.userInfo

           })
          },
          handlerEdit(data){
            data.id = this.row.Id
            let _that = this.$parent
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/AmountSet/UpSupplier',
              data:{
                ...data
              },
              success(res){
                if(res.data.status){
                  this.$tips('修改成功!')
                  this.handlerInit_DATA()
                  _that.AddObject.dialogVisible = false
                }else{
                  this.$warning(res.data.msg)
                }

              },
              error(err){
                console.log(err)
              }
            });
          },
          //表头样式
          headerClassName({row, rowIndex}) {
            return 'orderTableHeaderStyles'
          },
          //外层表格样式
          handlertableRowClassName({row, rowIndex}){
            //奇数行
            if(rowIndex % 2 == 1){
              return 'warning-row'
            }else{
              return 'success-row'
            }
          },
        },
      created(){
          this.handlerInit_DATA()
      }
    }
</script>

<style scoped>
  @import "../../../../static/css/orderTableStyle.css";
  /deep/.warning-row {
    background: #FFFFFF !important;
  }

  /deep/ .success-row {
    background: #F7F7F7 !important;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center !important;
  }
  /deep/ td{
    text-align: center !important;
    font-size: 14px !important;
    color: #4c4c4c !important;
  }
  /deep/ .el-input__inner{
    border-radius: 4px 0 0 4px !important;
  }
  /deep/ .el-button{
    border-radius:  0  4px 4px 0 !important;
    outline: none !important;
  }
  /deep/ .el-button:active {
    color: #4c4c4c !important;
    border-color: #DCDFE6 !important;
    outline: 0 !important;
  }
  /deep/ .el-button:focus, .el-button:hover{
    background: transparent !important;
  }
  /deep/ .el-input__inner{
    height: 32px !important;
  }
  /deep/ .el-button{
    padding: 9px 20px !important;
  }
</style>
