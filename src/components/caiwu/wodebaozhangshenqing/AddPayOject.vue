<!--创建支付对象-->
<template>
  <el-dialog
    :title="Addplay.title"
    :visible.sync="Addplay.Visible"
    width="542px"
    left
    append-to-body>
    <div class="addplay">
      <div class="clearfloat">
        <span style="float: left">名称:</span>
        <el-input style="float: left;width:190px;
height:32px;" v-model="FromData.title" placeholder="请输入输入标题"></el-input>
      </div>
      <div class="clearfloat">
        <span style="float: left">负责人:</span>
        <el-input style="float: left;width:190px;
height:32px;" v-model="FromData.userInfo" placeholder="请输入负责人"></el-input>
      </div>
      <div class="clearfloat">
        <span style="float: left">电话:</span>
        <el-input style="float: left;width:190px;
height:32px;" v-model="FromData.phone" type="number" placeholder="请输入电话"></el-input>
      </div>
      <div class="clearfloat">
        <span style="float: left">地   址：</span>
        <el-input style="float: left;width:190px;
height:32px;" v-model="FromData.address" placeholder="请输入地址"></el-input>
      </div>
      <div class="clearfloat">
        <span style="float: left">说   明：</span>
        <el-input type="textarea"
                  style="resize: none;float: right;width: 85%" :autosize="{ minRows: 2, maxRows: 4}" v-model="FromData.Explain" placeholder="请输入说明"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button style="border: none;padding-right: 50px" @click="Addplay.Visible = false">取 消</el-button>
    <el-button style="width:104px;
height:38px;
background:rgba(89,150,248,1);
line-height: 12px;
border-radius:5px;font-size:15px;color: #FFFFFF" type="primary" @click="handlerDetermine()">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "AddPayOject",
        props:{
          Addplay:{
            type:Object,
            default: function () {
              return new Object()
            }
          }
        },
        data(){
          return {
            FromData:{
              title:'',
              userInfo:'',
              phone:'',
              address:'',
              Explain:''
            }
          }
        },
        methods:{
          handlerDetermine(){
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/AmountSet/addsuppler',
              data:{
                title:this.FromData.title,
                username:this.FromData.userInfo,
                phone:this.FromData.phone,
                remark:this.FromData.Explain,
                address:this.FromData.address,
                id:this.FromData.id || ''
              },
              success(res){
                if(res.data.status){
                  this.$tips(res.data.msg)
                  this.$ThisParent({
                    variable:'Addplay',
                    callblack(_that){
                      _that.Addplay.Visible = false
                    }
                  })
                  this.Addplay.callback && this.Addplay.callback()
                }else{
                  this.$warning(res.data.msg)
                }
              },
              error(err){
                console.log(err)
              }
            });
          }
        },
        created(){
            console.log(this)
        }
    }
</script>

<style scoped>
  /deep/.el-button:focus, /deep/.el-button:hover {
    color: #4c4c4c;
    border-color: transparent;
    background-color: transparent;
  }
  /deep/ .el-dialog__footer {
    padding: 10px 55px 20px;
    text-align: right;
    box-sizing: border-box;
  }
  /deep/ .el-textarea__inner{
    resize: none;
    min-height: 102px !important;
  }
  .addplay > div span{
    display: inline-block;
    width: 53px;
    text-align: right;
    margin-right: 11px;
  }
  /deep/.el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .addplay > div{
    margin: 30px 0;
    line-height: 32px;
    text-align: left;
  }
  /deep/ .el-dialog__body {
    padding: 30px 55px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  /deep/ .el-dialog__title{
    font-size: 17px;
    color: #B7C6DD;
  }
/deep/ .el-dialog__header{
  position: relative;
}
/deep/ .el-dialog__header {
  padding: 20px 55px 10px;
}
/deep/ .el-dialog__header:before{
  content: '';
  display: inline-block;
  position: absolute;
  bottom: -10px;
  width: 430px;
  height: 1px;
  left: 55px;
  background: #DDDDDD;
}
</style>
