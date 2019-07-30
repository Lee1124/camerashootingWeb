<!--添加我的交款-->
<template>
  <el-dialog
    :title="diaLog.title"
    :visible.sync="diaLog.dialogVisible"
    width="593px"
    :before-close="handleClose">
    <div class="div-box">
      <div class="clearfloat">
        <div style="float: left" class="clearfloat">
          <span style="float: left">订单 : </span>
          <Rsch style="float: left;width: 190px;padding-left: 10px"  :option="optiona"></Rsch>
        </div>
        <div style="float: right" class="clearfloat">
          <span style="float: left">编号 : </span>
          <el-input style="float: left"  class="input-item" v-model="FOROM_DATA.NO" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="clearfloat">
        <div style="float: left" class="clearfloat">
          <span style="float: left">类型 : </span>
          <el-select placeholder="请选择" v-model="FOROM_DATA.type" class="input-item"  style="float: left">
            <el-option
              v-for="item in optionType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float: right" class="clearfloat">
          <span style="float: left">账号 : </span>
          <el-select placeholder="请选择" v-model="FOROM_DATA.user" class="input-item"  style="float: left">
            <el-option
              v-for="item in optionUser"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="clearfloat">
        <div style="float: left" class="clearfloat">
          <span style="float: left">金额 : </span>
          <el-input  type="number" class="input-item"  v-model="FOROM_DATA.amouent" style="float: left" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="clearfloat">
        <span style="float: left">说明 : </span>
        <el-input
          type="textarea"
          style="float: right;
    width: 91.6%;
    height: 112px;
    resize: none;"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
         v-model="FOROM_DATA.beizhu">
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button style="border: none" @click="diaLog.dialogVisible = false">取 消</el-button>
    <el-button style="width:104px;height: 38px;background: #5996F8" type="primary" @click="handlerOKEnd()">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import Rsch from '../../common/RemoteSearch/RemoteSearch';
    export default {
        name: "wodejiaokuan",
        props:{
          diaLog:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
      components:{
        Rsch
      },
      data(){
        return {
          optionType:[],
          optionUser:[],
          FOROM_DATA:{
            order:'',   //订单
            NO:'',      //编号
            type:'',     //类型
            user:'',      //账号
            amouent:'',   //金额
            beizhu:'',      //备注
            id:''
          },
          optiona:{
            value:'',
            options:[],
            callblack:this.handlerOrdera,
            key:'strname',
            url:'/xlapi/CameraManage/AmountManage/Amount/getorertitle'
          },
          actiontype:''
        }
      },
      watch:{
        'FOROM_DATA.NO':{
          //禁止编号中文
          handler(newVal){
            this.FOROM_DATA.NO = newVal.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'');
          },
          deep: true
        },
        'FOROM_DATA.amouent':{
          //禁止编号中文
          handler(newVal){
            if(this.FOROM_DATA.amouent < 0){
              this.FOROM_DATA.amouent = ''
            }

          },
          deep: true
        }
      },
      methods:{
        //  关闭弹框
        handleClose(){
          this.diaLog.dialogVisible = false
        },
      //  获取报账类型
        handlerAccount(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountOrder/getamounttype',
            success(res){
              this.optionType = res.data.map(res => {
                return {
                  value:res.id,
                  label:res.name
                }
              })
            },
            error(err){
              console.log(err)
            }
          })
        },
      //  获取账号类型
        handleruserById(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountOrder/getamountinaddress',
            success(res){
              this.optionUser = res.data.map(res => {
                return {
                  value:res.id,
                  label:res.name
                }
              })
            },
            error(err){
              console.log(err)
            }
          })
        },
        //  订单回调
        handlerOrdera(res){
          this.optiona.options = []
          this.optiona.options = res.data.map( res => {
            return {
              value:res.id,
              label:res.name
            }
          })
        },
        //添加 or 编辑
        handlerOKEnd(){
          let FRON_DATA = {
            actiontype:this.diaLog.actiontype,
            order:this.optiona.value,
            orderremark:this.optiona.label,
            amount:this.FOROM_DATA.amouent,
            no:this.FOROM_DATA.NO,
            address:this.FOROM_DATA.user,
            type:this.FOROM_DATA.type,
            remark:this.FOROM_DATA.beizhu,
            id:this.diaLog.actiontype == 'add'? '':this.FOROM_DATA.id
          };

          if(FRON_DATA.no == ''){
            this.$warning('请输入编号!')
            return
          }

          if(FRON_DATA.order == ''){
            this.$warning('请选择订单!')
            return
          }

          if(FRON_DATA.type == ''){
            this.$warning('请选择类型!')
            return
          }

          if( FRON_DATA.address == ''){
            this.$warning('请选择账号!')
            return
          }
          if( FRON_DATA.amouent == '') {
            this.$warning('请输入金额!')
            return
          }

          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountOrder/addorderamount',
            data:{
              ...FRON_DATA
            },
            success(res){
              if(res.data.state){
                this.$tips(res.data.msg)
                //调用父级方法查询表格数据
                this.$ThisParent({
                  variable:'PAGE_INDEX',
                  callblack(_that){
                    _that.handlderInitAjax()
                  }
                })
                this.diaLog.dialogVisible = false
              }else{
                this.$warning('添加失败!')
              }
            },
            error(err){
              console.log(err)
            }
          })

        }
      },
      created(){
          this.handlerAccount();
          this.handleruserById();
      }
    }
</script>

<style scoped>
  /deep/ .el-dialog__body{
    margin-top: 20px;
  }
/deep/ .el-dialog__header{
  text-align: left;
  font-size: 17px;
  position: relative;
}
  /deep/ .el-dialog__title{
    color: #B7C6DD;
  }
/deep/ .el-dialog__header:before{
  content: '';
  display: inline-block;
  width: 93%;
  height: 1px;
  background: #DDDDDD;
  position: absolute;
  top: 65px;
  left: 20px;
}
  /deep/ .el-input__inner{
    width: 190px;
    height: 32px;
  }
  .input-item{
    width: 190px;
    margin-left: 10px;
  }
  div span{
    line-height: 32px;
  }
  /deep/ .el-textarea__inner{
    resize: none;
    height: 112px !important;
  }
  .div-box > div{
    margin-bottom: 20px;
  }
  /deep/ .el-input__icon{
    line-height: 32px;
  }
</style>
