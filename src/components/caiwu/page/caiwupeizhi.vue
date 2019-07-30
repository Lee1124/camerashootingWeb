<template>
  <div class="clearfloat">
    <div style="width: 50%;float: left;" class="item-bar">
      <div style="margin-right: 20px;margin-bottom: 20px;overflow: hidden auto;height: 380px">
        <p style="font-size: 14px;color: #4C4C4C">报账类型</p>
        <div style="border-bottom: 1px dashed #DDDDDD;margin-bottom: 20px">
          <p style="text-align: left;color: #4c4c4c;font-size: 14px" class="clearfloat">
            <span>[ 业务报账 ]</span>
            <span style="float: right" class="border-arid" @click="handlerAddBao(1)">
                <span class="border-bar">+</span>
                <span class="border-bar-item" >新增</span>
              </span>
          </p>
          <ul class="clearfloat bar-li">
            <li v-for="(item,index) in Business"  style="position: relative;" @mouseenter="handleroverShow(index,Business)" @mouseleave="handleroutHide()" :key="index">
              <span @click="handlerBusinessEdit( item )">{{ item.Name }}</span>
              <i v-if="item.state" class="detels-icon" @click="handlerDetelById(item)">

              </i>
            </li>
          </ul>
        </div>
        <div>
          <p style="text-align: left;color: #4c4c4c;font-size: 14px">
            <span>[ 行政报账 ]</span>
            <span style="float: right" class="border-arid" @click="handlerAddBao(2)">
                <span class="border-bar">+</span>
                <span class="border-bar-item" >新增</span>
              </span>
          </p>
          <ul class="clearfloat bar-li">
            <li v-for="(item,index) in Administrative" @mouseenter="handleroverShow(index,Administrative)" @mouseleave="handleroutHide()" style="position: relative;"  :key="index">
              <span @click="handlerBusinessEdit( item )">{{ item.Name }}</span>
              <i v-if="item.state" @click="handlerDetelById(item)" class="detels-icon"></i>
            </li>
          </ul>
        </div>
      </div>
      <div style="margin-right: 20px;position: relative;">
        <p style="font-size: 14px;color: #4C4C4C">审核人员 <span style="color: #999999;font-size: 13px;font-weight: initial;">(最多可存在四个审核人员)</span></p>
        <ul class="items-shenghe">
          <li v-for="(item,index) in AuditData" :key="index">
              <span class="span-before">
                <span style="width: 21px;height: 21px;background: #DDEAFF;border-radius: 50%;position: relative;">
                  <span style="width:9px;height: 9px;background: #5996F8;border-radius: 50%;" class="domposition"></span>
                </span>
              </span>
            <span >
              <span style="font-size: 14px;color: #808080;position: relative;top: -5px;left: 5px;" @mouseenter="handleroverShow(index,AuditData)" @mouseleave="handleroutHide()">
                 <span v-if="index == 0">第一步 : </span>
                 <span v-if="index == 1">第二步 : </span>
                 <span v-if="index == 2">第三步 : </span>
                 <span v-if="index == 3">第四步 : </span>
                  <span  @click="handlerAudit_All(item,index)" class="items-shenghe-item">
                    {{ item.username }}{{ item.index == 0? `(审核金额:不限)`:`(审核金额:${item.index}以上)` }}
                  </span>

                <i v-if="item.state" style="cursor: pointer" @click="handlerDetelByAudit(item)" class="detels-icon"></i>
              </span>
            </span>
          </li>
          <li v-if="AuditData.length < 4">
              <span class="span-before">
                <span style="width: 21px;height: 21px;background: #DDEAFF;border-radius: 50%;position: relative;">
                  <span style="width:9px;height: 9px;background: #5996F8;border-radius: 50%;" class="domposition"></span>
                </span>
              </span>
            <span>
              <span style="float: right" class="border-arid" @click="handlerAuditData()">
                <span class="border-bar">+</span>
                <span class="border-bar-item" >新增</span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div style="width: 50%;float: left;" class="item-bar">
      <div style="margin-bottom: 20px" class="clearfloat">
        <p style="font-size: 14px;color: #4C4C4C">
          <span>账号设置</span>
          <span style="float: right" class="border-arid" @click="handlerASettings()">
            <span class="border-bar">+</span>
            <span class="border-bar-item" >新增</span>
          </span>
        </p>
        <ZH_TABLE ref="acount" :acount="acount"></ZH_TABLE>
      </div>
      <div style="height: 520px;margin-bottom: 40px">
        <p style="font-size: 14px;color: #4C4C4C">
          <span>支付对象</span>
          <span style="float: right" class="border-arid" @click="handlerAddByObject()">
            <span class="border-bar">+</span>
            <span class="border-bar-item" >新增</span>
          </span>
        </p>
        <ZFObject_Table ref="ZFObject"></ZFObject_Table>
      </div>
    </div>
    <!--DiaLog-->
    <AddDiaLog :AddDiaLog="AddDiaLog" ref="AddDiaLog" v-if="AddDiaLog.dialogVisible"></AddDiaLog>
    <tip width="500px" :tip="tip" :width="'350px'" v-if="tip.dialogVisible">
      <p>{{ tip.bodyTitle }}</p>
    </tip>
    <AddSettings :AddSettings="AddSettings" ref="AddSetting"  v-if="AddSettings.dialogVisible"></AddSettings>
    <AddAudit :showPersonSelectDiaLog="showPersonSelectDiaLog"></AddAudit>
    <AddObject :Addplay="Addplay" v-if="Addplay.Visible" ref="Addplays"></AddObject>
    <EditShengHeUser v-if="EditUserDiaLog.dialogVisible" :EditUserDiaLog="EditUserDiaLog"></EditShengHeUser>
  </div>
</template>

<script>

    import AddDiaLog from '../CaiWuPeiZhi/AddBaoZhangLeiXing';     //添加报账类型
    import AddSettings from '../CaiWuPeiZhi/AddZhangHao';         //添加账号
    import tip from '../../tool/DetelTips'     //提示框
    import ZH_TABLE from '../CaiWuPeiZhi/ZhanHuSheZhiTable';        //账户设置表格
    import AddAudit from '../../orderManage/diaLog/personSelectDiaLog';       //添加审核人员
    import ZFObject_Table from '../../caiwu/CaiWuPeiZhi/ZhiFuDuiXiangTable';            //支付对象表格
    import AddObject from '../wodebaozhangshenqing/AddPayOject'      //添加对象
    import EditShengHeUser from '../CaiWuPeiZhi/EditShengHeUser'   //编辑审核人员
    export default {
        name: "caiwupeizhi",
        components:{AddDiaLog,tip,AddSettings,ZH_TABLE,AddAudit,ZFObject_Table,AddObject,EditShengHeUser},
        data(){
          return{
            Business:[],      //业务报账
            Administrative:[],     //行政报账
            AuditData:[],             //审核人员
            AddDiaLog:{
              dialogVisible:false
            },             //添加报账类型
            tip:{
              dialogVisible:false,
              primary:this.handlerPrimary,
              title:'删除报账',
              footer:['取消','确认删除'],
              bodyTitle:null,
            },
            AddSettings:{
              dialogVisible:false,
            },         //添加账号弹框
            Addplay:{
              Visible:false,
              title:'编辑支付对象',
              callback:this.handlerAddObject
            }, //添加支付对象
            row:{},           //当前信息
            userid:getkevalue().userid,
            acount:{
              CallbackDelete:this.handlerDeleteByUser,
              CallbackEdit:this.handlerEditByuser
            },
            EditUserDiaLog:{
              dialogVisible:false
            },      //编辑审核人员
            showPersonSelectDiaLog:false                   //新增审核人员
          }
        },
      methods:{
        //  设置审核人员
        handlerAudit_All( row , index ){
          let _that = this
          this.EditUserDiaLog = {
            dialogVisible:true,
            title:'设置审核金额',
            data:row,
            callblack( a , b ){
              let formdata = {
                userid:a.UserId,
                username:a.userName,
                id:row.ID,
                money:Number(b)
              }
              _that.handlerAudit_Alls( formdata )
            }
          }
          console.log( row , index )
        },
        //确认编辑
        handlerAudit_Alls( data ){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/UpdataCheckFlow',
            data:{
              ...data
            },
            success(res){
              if(res.data){
                this.$tips('设置成功')
              }else {
                this.$warning('设置失败')
              }
              this.EditUserDiaLog.dialogVisible = false
              this.handlerAuditUser()
            },
            error(err){
              console.log(err)
            }
          });
        },
        //  报账类型修改
        handlerBusinessEdit( data ){
          this.AddDiaLog.title = '编辑报账'
          this.AddDiaLog.dialogVisible = true
          this.AddDiaLog.callblack = this.handlerAddDiaLogEdit
          this.$nextTick(()=>{
            this.$refs.AddDiaLog.FROM_DATA = {
                BAOZHANG:data.pid,      //报账类型
                TYPEYWU:data.Name,       //业务类型
                SHYOMING:data.Remark,      //业务说明
                ID:data.id
            }
          })

        },
        //确认编辑
        handlerAddDiaLogEdit( data ){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/UpdateAmountType',
            data:{
              pid:data.BAOZHANG,
              name:data.TYPEYWU,
              remark:data.SHYOMING,
              id:data.ID
            },
            success(res){
              if(res.data.status){
                this.$tips('修改成功')
                this.handlerRefresh()
                this.AddDiaLog.dialogVisible = false
              }else{
                this.$warning('修改失败')
              }

            },
            error(err){
              console.log(err)
            }
          });
        },
        //报账类型查询
        handlerInit(type){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/GetAmountTypes',
            data:{
              pid:type,
            },
            success(res){
              let data = res.data.map(res => {
                return {
                  id:res.ID,
                  Name:res.Name,
                  state:false,
                  Remark:res.Remark
                }
              })
              if(type == 1){
                this.Business = data.map( res => ( {...res,pid:type} ))
              }else{
                this.Administrative = data.map( res => ( {...res,pid:type} ))
              }
            },
            error(err){
              console.log(err)
            }
          });
        },
        //账号设置数据获取
        handlerSettings(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/GetAmountAddressList',
            success(res){
              if(typeof res.data == 'object' && res.data.length >= 0){
                this.$refs.acount.handlerInData(res.data)
              }else{
                this.$warning('账户设置数据获取失败!')
              }

            },
            error(err){
              console.log(err)
            }
          });
        },
        //审核人员数据获取
        handlerAuditUser(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/GetCheckFlowList',
            success(res){
              this.AuditData = res.data.map(r => {
                r.state = false
                return r
              })
            },
            error(err){
              console.log(err)
            }
          });
        },
        //鼠标移入 业务报账
        handleroverShow(index,data){
          data.forEach((res,i) => {
            if(index == i){
              res.state = true
            }else{
              res.state = false
            }
          })
        },
        //鼠标移除    业务报账 or 行政报账
        handleroutHide(){
          let arr = ['Business','Administrative','AuditData']
          arr.forEach(res =>{
            this[res].forEach(r => {
              r.state = false
            })
          })
        },
        //添加报账
        handlerAddBao(sum){
          this.AddDiaLog.dialogVisible = true
          this.AddDiaLog.callblack = this.handlerAddDiaLog
          this.AddDiaLog.index = sum
          this.AddDiaLog.title = '添加'
        },
        //  确认添加报账回调
        handlerAddDiaLog(data){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/InsAmountType',
            data:{
              pid:data.BAOZHANG,
              name:data.TYPEYWU,
              remark:data.SHYOMING
            },
            success(res){
              if(res.data.status){
                this.$tips(res.data.msg)
                this.handlerRefresh()
                this.AddDiaLog.dialogVisible = false
              }else{
                this.$warning(res.data.msg)
              }
            },
            error(err){
              console.log(err)
            }
          });
        },
        //刷新报账数据
        handlerRefresh(){
          this.handlerInit(1);      //业务报账
          this.handlerInit(2);      //行政报账
        },
      //  删除报账类型
        handlerDetelById( row ){
          this.row = row;
          this.tip.dialogVisible = true
          this.tip.bodyTitle = '确定删除该报账类型?'
          this.tip.title = '删除报账'
          this.tip.primary = this.handlerPrimary
        },
        //确定删除
        handlerPrimary(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/DelAmountType',
            data:{
              id:this.row.id
            },
            success(res){
              if(res){
                this.$tips('删除报账成功!')
              }else{
                this.$warning('删除报账失败!')
              }
              this.handlerRefresh()
              this.tip.dialogVisible = false
            },
            error(err){
              console.log(err)
            }
          });
        },
        //  新增账号设置
        handlerASettings(){
          this.AddSettings.dialogVisible = true;
          this.AddSettings.callback = this.handlerSettingByOk
          this.AddSettings.title='新增账号'
        },
        //  确认新增账号
        handlerSettingByOk(data){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/InsAmountAddress',
            data:{
              title:data.M_C,
              no:data.Z_H,
              username:data.K_H_M,
              address:data.K_H_H,
              isout:data.z_c_z_h,
              isin:data.s_r_z_h,
              isDefout:data.m_r_z_h,
              stime:data.Q_S_S_J,
              remark:data.S_M
            },
            success(res){
              if(res.data.status){
                this.$tips('添加成功')
                this.handlerSettings()
                this.AddSettings.dialogVisible = false
              }else{
                this.$warning('添加失败')
              }
            },
            error(err){
              console.log(err)
            }
          });
        },
      // 是否 删除账号设置
        handlerDeleteByUser(row){
          this.row = row;
          this.tip.dialogVisible = true
          this.tip.bodyTitle = '确定删除该账户设置?'
          this.tip.title = '删除账户'
          this.tip.primary = this.handlerDeleteZhHu
        },
        //确认删除
        handlerDeleteZhHu(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/DelAmountAddress',
            data:{
              id:this.row.ID
            },
            success(res){
              if(res.data){
                this.$tips('删除成功!')
              }else{
                this.$warning('删除失败!')
              }
              this.tip.dialogVisible = false
              this.handlerSettings()
            },
            error(err){
              console.log(err)
            }
          });
        },
      //  新增审核
        handlerAuditData(){
          this.showPersonSelectDiaLog = true
        },
        //  删除审核人员
        handlerDetelByAudit( row ){
          this.row = row;
          this.tip.dialogVisible = true
          this.tip.bodyTitle = '确定删除该审核人员?'
          this.tip.title = '删除审核人员'
          this.tip.primary = this.handlerAudit
        },
        //确定删除审核人员
        handlerAudit(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/DelCheckFlow',
            data:{
              id:this.row.ID
            },
            success(res){
              if(res.data){
                this.$tips('删除成功!')
              }else{
                this.$warning('删除失败!')
              }
              this.tip.dialogVisible = false
              this.handlerAuditUser()
            },
            error(err){
              console.log(err)
            }
          });
        },
        //已选择审核人员
        getSelectedNews(data){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/InsCheckFlow',
            data:{
              userid:data.UserId,
              username:data.userName
            },
            success(res){
              if(res.data){
                this.$tips('添加成功!')
                this.showPersonSelectDiaLog = false
                this.handlerAuditUser()
              }else{
                this.$warning('添加失败!')
              }

            },
            error(err){
              console.log(err)
            }
          });
        },
      //  添加支付对象
        handlerAddByObject(){
          this.Addplay.Visible = true;
          this.Addplay.title = '添加支付对象'
          this.Addplay.callback = this.handlerOk // 添加成功回调
        },
      // 添加成功
        handlerOk(){
          this.$refs.ZFObject.handlerInit_DATA();
          this.$refs.ZFObject.currentPge = 1
        },
      //  确定添加
        handlerAddObject(data){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountSet/InsSupplier',
            data:{
              ...data
            },
            success(res){
              if(res.data.status){
                this.$tips('添加成功!')
                this.$refs.ZFObject.FORM_DATA.page = 1
                this.$refs.ZFObject.handlerInit_DATA()
              }else{
                this.$warning('添加失败!')
              }
              this.AddObject.dialogVisible = false
            },
            error(err){
              console.log(err)
            }
          });
        },
        closeDialog(){
          this.showPersonSelectDiaLog = false
        }
      },
      created(){
        this.handlerRefresh();
        this.handlerSettings();
        this.handlerAuditUser();
      }
    }
</script>

<style scoped>
  /deep/ .el-dialog__wrapper{
    position: fixed !important;
  }
  .detels-icon{
    background: url("../../../../static/img/order/smallClose.png") no-repeat center;
  }
  .span-before{
    position: relative;
  }
  .span-before:before{
    content: '';
    width: 1px;
    height: 50px;
    display: inline-block;
    position: absolute;
    border-right: 1px dashed #DDDDDD;
    left: 10px;
    top: -13px;
  }
  .items-shenghe li span{
    display: inline-block;
  }
  .items-shenghe{
    width: 100%;
    height: max-content;
    box-sizing: border-box;
    padding: 30px 45px;
  }
  .items-shenghe li{
    height: 50px;
    width: 100%;
    text-align: left;
  }
  .el-dialog__wrapper{
    position: fixed !important;
  }
  .items-shenghe-item{
    cursor: pointer;
  }
  .items-shenghe-item:hover{
    color: #5996F8;
    border-color: #5996F8;
    border-bottom: 1px solid #5996F8;

  }
  .border-arid:hover span{
    color: #5996F8;
    border-color: #5996F8;
  }
  .border-bar-item{
    color: #999999;
    font-size: 14px;
    cursor: pointer;
  }
  .border-bar{
    background: #fff;
    border:1px solid #BBBBBB;
    display: inline-block;
    width: 17px;
    height: 17px;
    text-align: center;
    line-height: 16px;
    color: #BBBBBB;
    border-radius: 50%;
    cursor: pointer;
  }
  i{
    font-style: normal;
    font-weight: 100;
    width: 15px;
    height: 15px;
    display: inline-block;
    background: #5996F8;
    color: #fff;
    line-height: 13px;
    text-align: center;
    border-radius: 50%;
    position: absolute;
    right: -10px;
    top: -5px;
  }
  .bar-li{
    min-height: 100px;
    box-sizing: border-box;
    padding: 10px 30px;
  }
  .bar-li li{
    float: left;
    margin-bottom: 25px;
    margin-right: 50px;
    color: #4c4c4c;
    font-size: 14px;
    cursor: pointer;
  }
  .bar-li li:hover{
    color: #5996F8;
    border-bottom: 1px solid #5996F8;
  }
  .item-bar > div{
    min-height: 350px;
    background: #fff;
    box-shadow:0px 0px 21px 0px rgba(0, 0, 0, 0.17);
    box-sizing: border-box;
    padding: 20px;
  }
  .item-bar > div > p{
    text-align: left;
    padding: 10px 0;
    box-sizing: border-box;
    font-weight: bold;
  }
</style>
