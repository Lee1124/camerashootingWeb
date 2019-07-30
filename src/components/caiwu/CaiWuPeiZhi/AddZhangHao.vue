<!--添加银行账号-->
<template>
  <el-dialog
    :title="AddSettings.title"
    :visible.sync="AddSettings.dialogVisible"
    width="540px"
    :before-close="handleClose">
    <ul class="ul-bar">
      <li class="clearfloat">
        <span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称: </span>
        <el-input  style="float: left;width: 190px;height: 32px;" placeholder="请输入名称" v-model="FROM_DATA.M_C"></el-input>
      </li>
      <li class="clearfloat">
        <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
        <el-input type="number" style="float: left;width: 190px;height: 32px;" placeholder="请输入账号" v-model="FROM_DATA.Z_H"></el-input>
      </li>
      <li  class="clearfloat">
        <span>开&nbsp; 户&nbsp;&nbsp;行 : </span>
        <el-input v-model="FROM_DATA.K_H_H" style="float: left;width: 190px;height: 32px;" placeholder="请输入开户行"></el-input>
      </li>
      <li  class="clearfloat">
        <span>开&nbsp; 户&nbsp;&nbsp;名 : </span>
        <el-input v-model="FROM_DATA.K_H_M" style="float: left;width: 190px;height: 32px;" placeholder="请输入开户名"></el-input>
      </li>
      <li  class="clearfloat">
        <span>支出账户 : </span>
        <el-select v-model="FROM_DATA.z_c_z_h" placeholder="请选择支出账户">
          <el-option
            v-for="item in options.Z_C_Z_H"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="clearfloat">
        <span>收入账户 : </span>
        <el-select v-model="FROM_DATA.s_r_z_h" placeholder="请选择收入账户">
          <el-option
            v-for="item in options.S_R_Z_H"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="clearfloat">
        <span>默认账户 : </span>
        <el-select v-model="FROM_DATA.m_r_z_h" placeholder="请选择默认账户">
          <el-option
            v-for="item in options.M_R_Z_H"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="clearfloat">
        <span>起始时间 : </span>
        <el-date-picker
          v-model="FROM_DATA.Q_S_S_J"
          type="date"
          value-format="yyyy-MM-dd"
          style="float: left;width: 190px;height: 32px;"
          placeholder="起始时间">
        </el-date-picker>
      </li>
      <li style="height: auto" class="clearfloat">
        <span>说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明 : </span>
        <el-input
          style="float: left;width: 70%;"
          type="textarea"
          :rows="3"
          v-model="FROM_DATA.S_M"
          placeholder="请输入说明...">
        </el-input>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button  class="btn-1"  style="border: none;"  @click="AddSettings.dialogVisible = false">取 消</el-button>
      <el-button type="primary" style="width: 102px;" @click="handlerAddSettings()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "AddZhangHao",
        props:{
          AddSettings:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            value:'',
            options:{
              Z_C_Z_H:[
                {value:true,label:'是'},
                {value:false,label:'否'}
              ],   //支出账户
              M_R_Z_H:[
                {value:true,label:'是'},
                {value:false,label:'否'}
              ],   //收入账户
              S_R_Z_H:[
                {value:true,label:'是'},
                {value:false,label:'否'}
              ],    //默认账号
            },
            FROM_DATA:{
              Z_H:'',       //账户
              M_C:'',       //名称
              K_H_H:'',     //开户行
              K_H_M:'',     //开户名
              z_c_z_h:null,     //已选支出账户
              m_r_z_h:null,     //已选默认账号
              s_r_z_h:null,     //已选收入账户
              Q_S_S_J:'',   //起始时间
              S_M:''        //说明
            }
          }
        },
        methods:{
          //关闭
          handleClose(){
            this.$parent.AddSettings.dialogVisible = false
          },
        //  确认添加
          handlerAddSettings(){
            this.$nextTick(()=>{
              let a = this.FROM_DATA
              if(a.M_C == ''){
                this.$warning('请输入名称')
                return
              }
              if(a.Z_H == ''){
                this.$warning('请输入账户')
                return
              }
              if(a.K_H_H == ''){
                this.$warning('请输入开户行')
                return
              }
              if(a.K_H_M == ''){
                this.$warning('请输入开户名')
                return
              }
              if(a.z_c_z_h == null){
                this.$warning('是否支出账户')
                return
              }
              if(a.m_r_z_h == null){
                this.$warning('是否默认账号')
                return
              }
              if(a.s_r_z_h == null){
                this.$warning('是否收入账户')
                return
              }
              if(a.Q_S_S_J == ''){
                this.$warning('请选择起始时间')
                return
              }
              if(a.S_M == ''){
                this.$warning('请输入说明')
                return
              }
              this.AddSettings.callback(this.FROM_DATA)
            })
          }
        }
    }
</script>

<style scoped>
  .ul-bar li > span{
    display: inline-block;
    width: 80px;
    text-align: right;
    float: left;
    margin-right: 5px;
  }
  .el-select{
    float: left;
    width: 190px;
  }
  .el-input{
    float: left;
    width: 190px;
  }
  .ul-bar li{
    height: 50px;
    line-height: 50px;
    text-align: left;
  }
  .btn-1:hover{
    background: transparent !important;
    color: #4c4c4c !important;
  }
  /deep/ .el-dialog__body{
    padding: 50px 40px !important;
  }
  /deep/ .el-dialog__title{
    font-size: 17px !important;
    color: #B7C6DD !important;
  }
  /deep/ .el-input__inner{
    height: 32px !important;
  }
  /deep/ .el-textarea__inner{
    resize: none !important;
    padding-top: 14px !important;
  }

</style>
