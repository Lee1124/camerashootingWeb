<!--账号转存-->
<template>
  <div>
    <ul class="item-ul">
      <li class="clearfloat">
        <span style="float: left">转出账号 : </span>
        <el-select v-model="FORM_DATA.ZC_Account"  placeholder="请选择" @change="handlerBalances()">
          <el-option
            v-for="item in a_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span> 余额 : {{ FORM_DATA.ZC_Balance }}</span>
      </li>
      <li class="clearfloat">
        <span style="float: left">转入账号 : </span>
        <el-select v-model="FORM_DATA.ZR_Account"  @change="handlerBalanceSell()"  placeholder="请选择">
          <el-option
            v-for="item in b_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span> 余额 : {{ FORM_DATA.ZC_Balances }}</span>
      </li>
      <li class="clearfloat">
        <span style="float: left">转出金额 : </span>
        <el-input type="number" v-model="FORM_DATA.ZR_Money" style="float: left;width: 190px;height: 32px;" placeholder="请输入转出金额"></el-input>
      </li>
      <li class="clearfloat">
        <span style="float: left">转入说明 : </span>
        <el-input
          style="float: left;width: 450px;"
          type="textarea"
          :rows="3"
          v-model="FORM_DATA.ZR_Explain"
          placeholder="请输入支付对象说明...">
        </el-input>
      </li>
    </ul>
    <div class="baocun" @click="handlerBaCun()">保存</div>
  </div>
</template>

<script>
    export default {
        name: "zhanghaozhuancun",
        data(){
          return {
            a_options:[],
            b_options:[],
            FORM_DATA:{
              ZC_Account:'',       //转出账号
              ZR_Account:'',        //转入账号
              ZR_Money:'',        //转入金额
              ZR_Explain:'',       //转入说明
              ZC_Balance:'',         //转出账号余额
              ZC_Balances:'',     //转入账号余额
            },       //参数
          }
        },
      watch:{
          'FORM_DATA.ZR_Money':function (a,b) {
            if(this.FORM_DATA.ZR_Money < 0){
              this.$warning('金额必须大于0')
              this.FORM_DATA.ZR_Money = ''
            }
          }
      },
      methods:{
          //获取支出账号
          handlerBalance(strtype){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getamountaddress',
              data:{
                strtype
              },
              success(res){
                let str = null
                strtype == 1? str = 'a_options'  : str = 'b_options'
                this[str] = res.data.map(res => {
                  return {
                    label:res.name,
                    value:res.id,
                    amount:res.amount
                  }
                })
              },
              error(err){
                console.log(err)
              }
            });
          },
        //获取支出账号金额
        handlerBalances(){
          this.a_options.filter(res => {
            if(res.value == this.FORM_DATA.ZC_Account){
              this.FORM_DATA.ZC_Balance = res.amount
            }
          })
        },
      //  获取转入金额
        handlerBalanceSell(){
          this.b_options.filter(res => {
            if(res.value == this.FORM_DATA.ZR_Account){
              this.FORM_DATA.ZC_Balances = res.amount
            }
          })
        },
      //  保存设置
        handlerBaCun(){
            let a = this.FORM_DATA
          if(a.ZC_Account == ''){
              this.$warning('请选择转出账号!')
            return
          }
          if(a.ZR_Account == ''){
            this.$warning('请选择转入账号!')
            return
          }
          if(a.ZR_Money == ''){
            this.$warning('请输入转入金额!')
            return
          }
          if(a.ZR_Explain == ''){
            this.$warning('请输入转入说明!')
            return
          }
          if(a.ZR_Account == a.ZC_Account){
            this.$warning('请检查转入或转出账号!')
            return
          }
          this.handlerBaCunByOk()
        },
      //  完成保存
        handlerBaCunByOk(){
          let a = this.FORM_DATA
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/Amount/amouttoother',
            data:{
              outid:a.ZC_Account,
              inid:a.ZR_Account,
              amount:a.ZR_Money,
              remark:a.ZR_Explain,
            },
            success(res){
              if(res.data.state){
                this.$tips('保存成功!')
                this.handlerClearData()
              }else{
                this.$warning('保存失败!')
              }
              this.handlerBalance(1)
              this.handlerBalance(2)
            },
            error(err){
              console.log(err)
            }
          });
        },
      //  清除页面数据
        handlerClearData(){
            Object.keys(this.FORM_DATA).forEach(res =>{
              this.FORM_DATA[res] = ''
            })
        }
      },
      created(){
        this.handlerBalance(1)
        this.handlerBalance(2)
      }
    }
</script>

<style scoped>
  .baocun{
    width:104px;
    height:38px;
    background:rgba(89,150,248,1);
    border-radius:5px;
    text-align: center;
    line-height: 38px;
    color: #ffffff;
    font-size: 15px;
    position: relative;
    left: 220px;
    top: 15px;
    cursor: pointer;
  }
  .item-ul{
    margin-bottom: 53px;
  }
  .item-ul li > span{
    display: inline-block;
    text-align: right;
    margin-right: 5px;
    font-size: 14px;
    color: #808080;
  }
  .item-ul li{
    text-align: left;
    line-height: 50px;
    height: 50px;
    margin: 10px 0;
  }
  /deep/ .el-textarea__inner{
    resize: none !important;
    padding-top: 14px !important;
  }
  /deep/ .el-input__inner{
    height: 32px !important;
    width: 190px !important;
  }
</style>
