<template >
  <div style="position: relative;">
    <noData msg="暂无数据" v-if="tableData.length == 0"></noData>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      height="300"
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
        label="账号"
        prop="NO">
      </el-table-column>
      <el-table-column
        label="开户行"
        prop="Address">
      </el-table-column>
      <el-table-column
        label="开户名"
        prop="UserName">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="props">
          <span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleEnLook(props.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "ZhanHuSheZhiTable",
        props:{
          acount:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            tableData:[],
            row:null,     //当前列信息
          }
        },
        methods:{
          //表头样式
          headerClassName({row, rowIndex}) {
            return 'orderTableHeaderStyles'
          },
          //初始化数据
          handlerInData(data){
            this.tableData = data
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
          //删除报账
          handleDetelAccount(row){
            this.acount.CallbackDelete(row)
          },
        //  编辑账号设置
          handleEnLook(row){
            this.row = row;
            let _that = this.$parent;
            _that.AddSettings.dialogVisible = true;
            _that.AddSettings.title = '编辑账号'
            _that.AddSettings.callback = this.handleEnLookByUser;
            this.$nextTick(()=>{
              let refs = _that.$refs.AddSetting;
              let data = refs.FROM_DATA;
              data.K_H_H = row.Address;
              data.K_H_M = row.UserName;
              data.z_c_z_h = row.IsOut;
              data.s_r_z_h = row.IsIn;
              data.m_r_z_h = row.isDefout;
              data.Q_S_S_J = row.BeginTime;
              data.M_C = row.Title;
              data.Z_H = row.NO;
              data.S_M = row.Remark
              refs.FROM_DATA = data;
            })
          },
        //  确认编辑
          handleEnLookByUser(){
            let _that = this.$parent;
            let refs = _that.$refs.AddSetting
            let data = refs.FROM_DATA
            let FORM_DATA  = {
              title:data.M_C,
              no:data.Z_H,
              username:data.K_H_M,
              address:data.K_H_H,
              isout:data.z_c_z_h,
              isin:data.s_r_z_h,
              isDefout:data.m_r_z_h,
              stime:data.Q_S_S_J.length > 10? data.Q_S_S_J.substring(0,10) : data.Q_S_S_J,
              id:this.row.ID,
              remark:data.S_M
            };
            this.handlerConFirmaTion(FORM_DATA)
          },
          //编辑确认
          handlerConFirmaTion(data){
            let _that = this.$parent;
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/AmountSet/UpAmountAddress',
              data:{
                ...data
              },
              success(res){
                if(res.data.status){
                  this.$tips('修改成功!')
                }else {
                  this.$warning('修改失败,请检查!')
                }
                _that.AddSettings.dialogVisible = false;
                _that.handlerSettings()
              },
              error(err){
                console.log(err)
              }
            });
          }
        }
    }
</script>

<style scoped>
  @import "../../../../static/css/orderTableStyle.css";
  .tav-column /deep/ .has-gutter th{
    text-align: center  !important;
  }
  /deep/ td{
    text-align: center  !important;
    font-size: 14px  !important;
    color: #4c4c4c  !important;
  }
  /deep/ .warning-row {
    background: #F4F4F4 !important;
  }

  /deep/ .success-row {
    background: #ffffff !important;
  }
</style>
