<!--添加交款记录弹框-->
<template>
  <div id="addPaymentRecordDiaLog">
    <el-dialog
      :title="myTitle"
      :visible.sync="showAddPaymentRecordDiaLog"
      custom-class="commonDiaLog addPaymentRecordDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="closeDialog"></i>
      <div class="shadow" v-if="!showType"></div>
      <div class="content" v-loading="isShowLoading">
        <ul class="form">
          <li class="form-inner">
            <div class="formLeft">
              <label>订单：</label>
              <div class="commonBox">
                <commonInput :isReadonly="true" ref="childCommonInput_orderTitle" inputPlaceholderText=""></commonInput>
              </div>
            </div>
            <div class="formRight">
              <label>编号：</label>
              <div class="commonBox">
                <commonInput :isReadonly="false" ref="childCommonInput_no" inputPlaceholderText="请输入编号"></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>类型：</label>
              <div class="commonBox">
                <dropSelect1 :options="typeOptions" ref="dropSelectChild_type"
                             dropSelect1Placeholder="请选择"></dropSelect1>
              </div>
            </div>
            <div class="formRight">
              <label>账号：</label>
              <div class="commonBox">
                <dropSelect1 :options="addressnameOptions" ref="dropSelectChild_addressname"
                             dropSelect1Placeholder="请选择"></dropSelect1>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>金额：</label>
              <div class="commonBox">
                <commonInput ref="childCommonInput_price" inputPlaceholderText="请输入金额"></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner textAreaLi addNewOrderNextTextAreaLi">
            <label>说明：</label>
            <div class="textAreaBox">
              <textArea ref="childtextArea" textAreaPlaceholderText="请输入说明内容..."></textArea>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer" v-if="showType">
           <el-button @click="closeDialog">取 消</el-button>
           <el-button type="primary" @click="confirmAddPayment('add')">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    /*api等信息*/
    api: getkevalue().apiurl,
    /*类型数据*/
    typeOptions:[{value:0,label:'hahahah'}],
    /*账号数据*/
    addressnameOptions:[],
    /*订单ID*/
    orderId:'',
    /*订单标题*/
    orderTitle:'',
    myTitle:'添加交款记录',
    priceRowObj:{},
    isShowLoading:false,
  };
  /*方法*/
  let myMethods = {
    closeDialog(){
      this.$parent.showAddPaymentRecordDiaLog=false;
    },
    //获取信息
    getRowNews(){
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/getamountlog';
      let data={
        id:this.priceRowObj.id
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          if (res.status==200) {
            // console.log(res)
            if (res.data.Remark==''){
              res.data.Remark='无';
            }
            this.isShowLoading=false;
            this.setDefaultValue(res.data);
          }
        }
      })
    },
    /*设置默认值*/
    setDefaultValue(data){
      // console.log(data)
      this.$refs.childCommonInput_no.inputValue=data.NO;//编号
      this.$refs.childCommonInput_price.inputValue=data.amount;//金额
      this.$refs.childtextArea.textAreaText=data.Remark;//说明
      this.$refs.dropSelectChild_type.dropSelectValue=data.Type;//交款类型
      this.$refs.dropSelectChild_addressname.dropSelectValue=data.ToAddress;//账号
    },
    /*打开时*/
    openEvent() {
      this.isShowLoading=true;
      this.orderId = this.$parent.orderId;
      this.orderTitle = this.$parent.orderTitle2;
      this.priceRowObj=this.$parent.priceRowObj;
    },
    //清除所有缓存数据
    clearOldData(){
     this.$refs.dropSelectChild_type.dropSelectValue='';//交款类型
     this.$refs.dropSelectChild_addressname.dropSelectValue='';//账号
     this.$refs.childCommonInput_price.inputValue='';//金额
     this.$refs.childCommonInput_no.inputValue='';//编号
     this.$refs.childtextArea.textAreaText='';//说明
    },
    /*打开后*/
    openedEvent() {
      this.$refs.childCommonInput_orderTitle.inputValue=this.$parent.orderTitle2;
      this.getType();
      this.getTNo();
      if (this.$store.state.priceIsAdd){
        this.clearOldData();//清除所有缓存数据
      }else {
        this.getRowNews();
      }
    },
    //
    /*获取类型*/
    getType(){
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/getamounttype';
      this.$Axios({
        method: 'GET',
        url: url,
        success(res) {
          if (res.status==200) {
            let newRes=res.data.map(items=>{
              return {
                label:items.name,
                value:items.id,
              }
            });
            this.isShowLoading=false;
            this.typeOptions=newRes
          }
        }
      })
    },
    /*获取账号*/
    getTNo(){
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/getamountinaddress';
      this.$Axios({
        method: 'GET',
        url: url,
        success(res) {
          if (res.status==200) {
            let newRes=res.data.map(items=>{
              return {
                label:items.name,
                value:items.id,
              }
            });
            this.isShowLoading=false;
            this.addressnameOptions=newRes
          }
        }
      })
    },
    /*保存添加交款记录*/
    confirmAddPayment(type){
      let actiontype=type;//操作类型 ：add：添加 edit:编辑
      let order=this.orderId;//订单ID
      let orderremark=this.orderTitle;//订单标题
      let payType=this.$refs.dropSelectChild_type.dropSelectValue;//交款类型
      let address=this.$refs.dropSelectChild_addressname.dropSelectValue;//账号
      let amount=this.$refs.childCommonInput_price.inputValue;//金额
      let no=this.$refs.childCommonInput_no.inputValue;//编号
      let remark=this.$refs.childtextArea.textAreaText;//说明
      if (no!=''){
        if (!(/^[0-9a-zA-Z]+$/.test(no))){
          this.$message({
            message: '编号只能包括数字或字母！',
            customClass: 'msgTips',
            type: 'error'
          });
          return false;
        }
      }
      if (payType==''){
        this.$message({
          message: '请选择交款类型！',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      }else if (address==''){
        this.$message({
          message: '请选择账号！',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      } else if (amount==''){
        this.$message({
          message: '请填写金额！',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      }
      if (amount!=''){
        if (!(/^[0-9]+\.?[0-9]+?$/.test(amount)) && !(/^[0-9]+$/.test(amount))) {
          this.$message({
            message: '请输入正确金额！',
            customClass: 'msgTips',
            type: 'error'
          });
          return false;
        }
      }


      let data;
      data={
        actiontype:actiontype,
        order:order,
        orderremark:orderremark,
        amount:amount,
        no:no,
        address:address,
        type:payType,
        remark:remark,
      };
      // console.log(data)
      this.addPaymentRequest(data)
    },
    //保存添加交款记录请求
    addPaymentRequest(data){
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/addorderamount';
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res.data);
          if (res.data.state) {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'success'
            });
            if (this.type=='list'){
              this.$parent.getPriceDetails(this.orderId);
              this.$parent.showAddPaymentRecordDiaLog=false;
            } else if (this.type=='details'){
              this.$parent.getOrderPrice();
              this.$parent.showAddPaymentRecordDiaLog=false;
            }
          }
        }
      })
    }
  };
  export default {
    name: "addPaymentRecordDiaLog",
    props: ['showAddPaymentRecordDiaLog','showType','type'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {

    },
    watch:{
      showType(val){
        if (!val){
          $('.addPaymentRecordDiaLog').height('380px');
          this.myTitle='查看交款记录';
        }else {
          $('.addPaymentRecordDiaLog').height('447px');
          this.myTitle='添加交款记录';
        }
      }
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
   #addPaymentRecordDiaLog  >>> .addPaymentRecordDiaLog {
    width:593px;
    height:487px;
    padding: 0 50px 40px;
    margin-top: 0 !important;
  }
  >>> .addPaymentRecordDiaLog .closeIcon{
    right: 50px;
    top: 25px;
  }

  >>> .addPaymentRecordDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .addPaymentRecordDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .addPaymentRecordDiaLog .el-dialog__footer {
    bottom: 40px;
    position: absolute;
    right: 55px;
  }

  >>> .addPaymentRecordDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .addPaymentRecordDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  /*弹框内容样式*/
  .content .form li {
    height: 32px;
    /*margin: 4% 3%;*/
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
  }
  .content .form li:last-of-type {
    justify-content: flex-start;
    height: auto;
  }
  .content .form li:first-of-type {
    margin-top: 40px;
  }
  .content .form li:last-of-type label {
    margin-top: -62px;
  }
  .formLeft, .formRight {
    display: flex;
    align-items: center;
  }
  .commonBox {
    display: inline-block;
    width: 170px;
    height: 32px;
  }
  .textAreaBox {
    width: 90%;
    height: 100px;
  }

  .shadow {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: transparent;
  }

</style>
