<!--报账添加搜索及支付-->
<template>
  <div style="height: 70px;min-width: 1500px;background: #fff;box-sizing: border-box;padding: 5px 70px;" class="clearfloat">
    <div style="width: 420px;float: left;margin-top: 5px;margin-right: 5px" v-if="PAGE_INDEXs == 4 || PAGE_INDEXs == 5">
      <el-date-picker
        v-model="TIME_FORM[0].val"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="审核开始时间"
      style="float: left;width: 190px">
      </el-date-picker>
      <span style="float: left;margin: 0 10px;line-height: 26px">-</span>
      <el-date-picker
        v-model="TIME_FORM[1].val"
        value-format="yyyy-MM-dd"
        type="date"
        style="float: left;width: 190px"
        placeholder="截止审核时间"
        @change="handleRetime()">
      </el-date-picker>
    </div>
    <div style="width: 160px;height: 32px;float: left;margin-right: 25px;    margin-top: 5px;" v-for="(item,index) in InputS.InputList" :key="index">
      <el-input
        :placeholder="item.placeholder"
        v-model="item.val"
        clearable>
      </el-input>
    </div>
    <!--出纳账目-->
    <div style="float: left;margin-top: 5px;margin-right: 10px">
      <el-select v-model="TIME_FORM[2].val" style="width: 190px" placeholder="请选择账号" v-if="PAGE_INDEXs == 4">
        <el-option
          v-for="item in AccountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div  style="float: left;    height: 100%;
    text-align: center;
    line-height: 40px;
    margin: 0 10px;cursor: pointer" @click="handlerInputs()" v-if="PAGE_INDEXs == 4">
      <img style="    position: relative;
    top: 5px;" v-if="TIME_FORM[3].val" src="../../../static/img/caiwu/1.png" alt="">
      <img style="    position: relative;
    top: 5px;" v-else src="../../../static/img/caiwu/0.png" alt="">
      <span>显示转存</span>
    </div>
    <!--<div style="float: left;margin-top: 5px;margin-right: 10px">-->
      <!--<el-select v-model="value" style="width: 190px" placeholder="请选择" v-if="PAGE_INDEXs == 4">-->
        <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
    <!--</div>-->
    <!--报账审核-->
    <div v-if="PAGE_INDEXs == 2" style="float: left;    height: 100%;
    text-align: center;
    line-height: 40px;
    margin: 0 10px;cursor: pointer" @click="handlerInput()">
      <img style="    position: relative;
    top: 5px;" v-if="Input_Start" src="../../../static/img/caiwu/1.png" alt="">
      <img style="    position: relative;
    top: 5px;" v-else src="../../../static/img/caiwu/0.png" alt="">
      <span>只看我审核的报账</span>
    </div>
    <!--通用 查询-->
    <div style="width:64px;
height:32px;
background:rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 5px;text-align: center;color: #FFFFFF;line-height: 32px;font-size:14px;cursor: pointer" @click="handlerSearchall()">
      查询
    </div>
    <!--添加 出纳账目-->
    <div style="width:64px;
height:32px;
border:1px solid rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 3px;left: 20px;line-height: 32px;color: rgba(89,150,248,1);font-size:14px;cursor: pointer" @click="handlerAddDu()" v-if="PAGE_INDEXs == 4">
      导出
    </div>
    <!--报账审核通过-->
    <div style="width:64px;
height:32px;
border:1px solid rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 4px;left: 40px;line-height: 32px;color: rgba(89,150,248,1);font-size:14px;cursor: pointer" @click="handlerAddAppNode()" v-if="PAGE_INDEXs == 2" >
     批量通过
    </div>
    <!--保障支付-->
    <div style="width:64px;
height:32px;
border:1px solid rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 4px;left: 40px;line-height: 32px;color: rgba(89,150,248,1);font-size:14px;cursor: pointer" @click="handlerPayment()" v-if="PAGE_INDEXs == 3" >
      批量支付
    </div>
    <!--添加 我的报账申请-->
    <div style="width:64px;
height:32px;
border:1px solid rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 4px;left: 70px;line-height: 32px;color: rgba(89,150,248,1);font-size:14px;cursor: pointer" @click="handlerAddData()" v-if="PAGE_INDEXs == 0">
      添加
    </div>
    <!--添加 我的交款-->
    <div style="width:64px;
height:32px;
border:1px solid rgba(89,150,248,1);
border-radius:5px;float: left;position: relative;
    top: 4px;left: 20px;line-height: 32px;color: rgba(89,150,248,1);font-size:14px;cursor: pointer" @click="handlerAddJk()" v-if="PAGE_INDEXs == 1">
      添加
    </div>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
    export default {
        name: "InputSearch",
        props:{
          InputS:{
            type:Object,
            default:function(){
              return {}
            }
          }
        },
      data(){
          return {
            Input_Start:true,
            PAGE_INDEXs:null,
            value:'',
            AccountOptions:[],
            TIME_FORM:[
              {val:'',placeholder:'开始审核时间'},
              {val:'',placeholder:'截止审核时间'},
              {val:'',placeholder:'账户'},
              {val:true,placeholder:'是否显示转存'},
              ]
          }
      },
      methods:{
        //  数据清除
        handlerClearData(data){
          data = data.map(res => {
            res.val = ''
          })
        },
        //报账审核 -- 只看我审核的报账
        handlerInput(){
          this.Input_Start = !this.Input_Start
        },
        //出纳账目 >>> 是否显示转存
        handlerInputs(){
          this.TIME_FORM[3].val = !this.TIME_FORM[3].val
        },
        //添加
        handlerAddData(){
          this.$ThisParent({
            variable:'ISaddBaoZhang',
            callblack(res){
              if(res.PAGE_INDEX == 0){
                res.SHOW_PAGE = 1;
                res.ISaddBaoZhang.is = false
                res.ISaddBaoZhang.IsEedIt = true
              }
            }
          })
        },

        //回调查询
        handlerSearchall(){
          if(this.PAGE_INDEXs == 2){
            this.InputS.handlerSearch(this.InputS.InputList,{val:this.Input_Start,placeholder:'只看我审核的报账'})
          }
          else if(this.PAGE_INDEXs == 5 || this.PAGE_INDEXs == 4){
            this.InputS.handlerSearch(this.InputS.InputList,this.TIME_FORM)
          }
          else{
            this.InputS.handlerSearch(this.InputS.InputList,null)
          }

        },
        //当前以一级菜单
        handlerPageIndex(index){
          this.handlerClearData(this.TIME_FORM)
          this.PAGE_INDEXs = index;
          if(this.PAGE_INDEXs == 4){
            this.handlerAccountSell()
          }
          if(this.PAGE_INDEXs == 2) {
            this.Input_Start = true
          }
        },
        //审批通过
        handlerAddAppNode(){
          this.$ThisParent({
            variable:'PAGE_INDEX',
            callblack(_that){
              //调用子页面批量通过 (三层)
              _that.$refs.PAGE2.$refs.DataInit.handlderAddNoderSell()
            }
          })
        },
        //报账支付
        handlerPayment(){
          this.$ThisParent({
            variable:'PAGE_INDEX',
            callblack(_that){
              //调用子页面批量通过 (三层)
              _that.$refs.PAGE3.$refs.DataInit.handlderAddNoderPayment()
            }
          })
        },
        //  添加 我的交款
        handlerAddJk(){
          this.$ThisParent({
            variable:'PAGE_INDEX',
            callblack(_that){
              if(_that.PAGE_INDEX == 1){
                _that.$refs['PAGE' + _that.PAGE_INDEX].handlerWoAdd()
              }
            }
          })
        },
        //  出纳账目获取账户
        handlerAccountSell(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/Amount/getamountaddress',
            data:{
              strtype:3,
            },
            success(res){
              this.AccountOptions = res.data.map(res => {
                return {
                  value: res.id,
                  label: res.name
                }
              })
              console.log(res)
            },
            error(err){
              console.log(err)
            }
          });
        },
      //  出纳账目表格导出
        handlerAddDu(){
          this.$nextTick(() => {
            this.handlerExportExcel()
          })
        },
        //出纳账目审核截止时间
        handleRetime(){
          let a = this.TIME_FORM[1].val
          this.$ThisParent({
            variable:'SHOW_PAGE',
            callblack(_that){
              //更新数据请求
              _that.handlerCashierDetile(a)
            }
          })
        },
        //导出表格
        handlerExportExcel(){
          /* generate workbook object from table */
          //表名
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable'))
          /* get binary string as output */
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'order.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
        }
      },
      created(){
        this.PAGE_INDEXs = this.$parent.PAGE_INDEX
      }
    }
</script>

<style scoped>
  /deep/ .el-input__icon{
    line-height: 26px !important;
  }
  /deep/ .el-date-editor .el-range-separator{
    line-height: 26px !important;
  }
/deep/ .el-input__inner{
  height: 32px !important;
  line-height: 32px !important;
}
</style>
