<!--报账申请 报账审核 报账支付-->
<template>
  <div style="position: relative">
    <noData msg="暂无数据" v-if="dataSet.list.length == 0"></noData>
    <el-table
      :data="dataSet.list"
      style="width: 100%"
      class="tav-column"
      height="430px"
      :header-row-class-name="headerClassName"
      @expand-change="handlerExpand"
      :row-class-name="handlertableRowClassName"
      show-summary
      :summary-method="handlergetSummaries"
      v-loading="loading"
    >
      <el-table-column type="expand" prop="index" width="102" style="border: 1px solid" >
        <template slot-scope="props">
          <el-table
            :data="props.row.childrenData"
            border
            :ref="'mu'+props.$index"
            style="width: 100%"
            :row-class-name="handlertableRowClassNames"
            lazy>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="props">
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleEnLook(props.row)">详情</span>
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              prop="name">
            </el-table-column>
            <el-table-column
              label="订单"
              prop="orderremark" width="250">
            </el-table-column>
            <el-table-column
              label="支付对象"
              prop="palyename">
            </el-table-column>
            <el-table-column
              label="金额(元)"
              prop="amount">
            </el-table-column>
            <el-table-column
              label="类型"
              prop="typename">
            </el-table-column>
            <el-table-column
              label="是否摊销"
              prop="otherstae"
            width="200">
            </el-table-column>
            <el-table-column
              label="附件">
              <template slot-scope="props">
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer" v-if="props.row.filelist.length > 0"  @click="handleEnFileLook(props.row)">点击查看</span>
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer" v-else>暂无附件</span>
              </template>
            </el-table-column>
            <el-table-column
              label="说明"
              prop="remark">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        prop="id"
        width="80">
      </el-table-column>
      <el-table-column
        label="编号"
        prop="No">
      </el-table-column>
      <el-table-column
        label="标题"
        prop="Title">
      </el-table-column>
      <el-table-column
        label="金额(元)"
        prop="amount">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="props">
        <span v-if="props.row.state == '待提交'" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '待测试审核'" style="color: #EF7A4B;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '待支付'" style="color: #5996F8;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '已支付'" style="color: #4c4c4c;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '退回'" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == ''" style="color: #FF0000;cursor: pointer" >
          已支付
        </span>
          <span v-if="
          props.row.state != '待提交' && props.row.state != '待测试审核'
          &&
           props.row.state != '待支付' && props.row.state != '已支付'
           &&  props.row.state != '退回'
" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
        </template>
      </el-table-column>
      <el-table-column
        label="提交人"
        prop="RealName">
      </el-table-column>
      <el-table-column
        label="添加时间">
        <template slot-scope="props">
          <span>{{ props.row.addtime.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="props">
          <span style="text-decoration: underline;color: #B73CF0;cursor: pointer" @click="handleLookNode(props.$index, props.row)">查看</span>
          <span v-if="props.row.state != '退回' && props.row.state != ''" style="text-decoration: underline;color: #1BC000;cursor: pointer" @click="handleReturn(props.$index, props.row)">退回</span>
          <span v-if="props.row.state == '待支付'" style="text-decoration: underline;color: #5996F8;cursor: pointer" @click="handlePayment(props.$index, props.row)">支付</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div  v-if="total > 8" style="position: absolute;bottom: 0px;left: 0px;right: 0;" class="clearfloat">
      <span style="position: absolute;
      left: 350px;
      right: 0;
      bottom: 8px;
      width: max-content;font-size: 14px;color: #4c4c4c;">共{{ dataSet.list.length        }}条内容</span>
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
    <!--Dialog-->
    <tip width="550px" :tip="tip" v-if="tip.dialogVisible">
      <textarea v-if="Statr_Index == 1" name="" style="width: 100%;background: #F6F6F6;resize: none;border-radius: 5px;box-sizing: border-box;padding: 10px;" v-model="TuiText" placeholder="请输入退回原因" id="" cols="30" rows="10"></textarea>
      <div v-if="Statr_Index == 2" class="statr">
        <div class="clearfloat">
          <span style="float: left; padding-left: 55px;">标题 :</span>
          <el-input style="width: 190px;float: left;margin-left: 10px; " v-model="From.title" placeholder="请输入内容"></el-input>
        </div>
        <div class="clearfloat">
          <span style="float: left; padding-left: 27px;">应付金额 :</span>
          <el-input :disabled="true" type="number" style="width: 190px;float: left;margin-left: 10px;" v-model="From.YinFu"></el-input>
        </div>
        <div class="clearfloat" style="position: relative">
          <span style="float: left; padding-left: 27px;">实际支付 :</span>
          <el-input type="number" style="width: 190px;float: left;margin-left: 10px;" v-model="From.ShiJi" placeholder="请输入内容"></el-input>
          <span style="position: absolute;color: #bbb;left: 264px;">元</span>
        </div>
        <div class="clearfloat">
          <span style="float: left; padding-left: 55px;">账号 :</span>
          <el-select style="float: left;width:190px;
height:32px;margin-left: 10px;" v-model="From.user" placeholder="">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="position: relative;height: max-content;
    margin: 0 0 35px 0px;width: 100px" class="checkboxs">
          <el-checkbox style="position: absolute;left: 0px;top: 0;" v-model="From.checked">全部支付完成 :</el-checkbox>
        </div>
        <div style="margin: 10px 0 " class="clearfloat">
          <span style="float: left;padding-left: 55px">说明 :</span>
          <el-input  v-model="From.Remint"  type="textarea" style="margin-left: 10px;resize: none;float: right;width: 75%;float: left;" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </tip>
    <DiaLog ref="DiaLogs" v-if="DiaLog.centerDialogVisible" :DiaLog="DiaLog"></DiaLog>
    <!--查看附件-->
    <DiaTip :DiaTip="DiaTip" v-if="DiaTip.dialogVisible">
      <div style="    box-sizing: border-box;
    padding: 10px 25px;">
        <div style="font-size:22px;color: #4C4C4C;text-align: left">支付成功！是否需要上传凭证？</div>
        <ul style="padding-bottom: 10px;
    border-bottom: 1px solid #DDDDDD;">
          <li style="text-align: left;margin: 13px 0"> • {{ DiaTip.title }}</li>
          <li style="text-align: left;margin: 13px 0"> • 实际支付:{{ DiaTip.SHj}}</li>
        </ul>
        <p style="margin: 10px 0;
    text-align: left;">凭证</p>
        <input type="file" ref="Files" multiple @change="handlerImgChange()" style="display: none;">
        <div style="height: 150px;overflow: hidden;overflow-y: auto;display: flex;flex-wrap: wrap;box-sizing: border-box;
    padding: 12px 0px;" class="commonScroll">
          <div  style=";margin-right: 20px;width:126px; height:90px;margin-bottom: 20px">
            <img style="cursor: pointer" title="上传图片" @click="handlerImgUpdete()" src="../../../static/img/caiwu/defultUpImg.png" width="126" height="90" alt="">
          </div>
          <div v-for="(item,index) in imgRight" :key="index" style=";margin-right: 20px;width:126px; height:90px;margin-bottom: 20px;position: relative;">
            <img style="cursor: pointer;max-width: 126px;max-height: 90px" title="上传图片" @click="handlerImgUpdete()" :src="item.path" alt="">
            <i class="detel" @click.sync="handlerDetel(item)"  title="删除图片">
              <img src="../../../static/img/caiwu/detel.png" style="width: 12px;position: relative;
    left: -1px;" alt="">
            </i>
          </div>
        </div>
      </div>
    </DiaTip>

    <!--图片预览-->
    <img_viewer :option="option" ref="img_viewer"></img_viewer>

  </div>
</template>

<script>
  import tip from '../tool/DetelTips';
  import DiaLog from '../../components/caiwu/wodebaozhangshenqing/AddReimbursement';
  import DiaTip from '../../components/caiwu/baozhangzhifu/pinzhengDig'
  import img_viewer from '../img-viewer/Img-viewer'

  export default {
    name: "BaoZhangZhiFuTable",
    components:{tip,DiaLog,DiaTip,img_viewer},
    data(){
      return{
        cosIp:cosIp,
        dataSet:{
          list:[]
        },
        childrenData:[],
        currentPge:1,
        total:0,
        //误操作提示框
        tip:{
          dialogVisible:false,
          primary:this.handlerPrimary,
          title:'退回提示',
          footer:['取消','退回'],
          bodyTitle:null,
        },
        row:{},                             //当前列信息
        TuiText:'',                           //退回原因
        Statr_Index:1,                              //退回 or 通过
        DiaLog:{
          centerDialogVisible:false
        },
        list:[],
        From:{
          title:'',                               //标题
          YinFu:'',                               //应付金额
          ShiJi:'',                                //实际金额
          Remint:'',                               //说明
          user:'',                                   //账号
          checked:false,                                    //是否全部支付完成
          id:'',                                      //报账支付明细id
          ZFstate:false,                            //是否可以支付
        },
        options:[],                             //支付账号
        DiaTip:{
          dialogVisible:false,
          title:'',
          SHj:''
        },
        imgRight:[],                    //页面显示图片
        File_Arry:[],                     //所有文件
        sum:0,
        loading:true,
        option:{} //配置参数
      }
    },
    methods:{
      //确定上传
      handlerUpImg(){
        if(this.File_Arry.length == 0){
          this.DiaTip.dialogVisible = false
          return
        }
        this.$UpImgFile({
          path: getkevalue().branchid+'/'+'amouent' + '/'+ this.DiaTip.id,
          file:this.File_Arry,
          callback(res){
            this.handlderuloadImg(res)
          },
          callbackall(){
            this.this.File_Arry = []
            this.imgRight = []
          }
        })
      },
      //图片路径存储到数据库
      handlderuloadImg(res){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/addprojectfile',
          data:{
            applyid:this.DiaTip.ids,
            filepath:res.ysKey
          },
          success(res){
            if(res.data.state){
              this.$tips(res.data.msg)
            }else{
              this.$warning(res.data.msg)
            }
            this.DiaTip.dialogVisible = false

          },
          error(err){
            console.log(err)
          }
        });
      },
      //删除图片
      handlerDetel(data){
        this.File_Arry.forEach((res,i) => {
          if(i == data.index){
            this.File_Arry.splice(i,1)
          }
        });
          this.imgRight = [];
          this.$ImgFileBase64({
            list:this.File_Arry,
            callback(res){
              this.imgRight.push(res)
            }
          })

      },
      //上传图片
      handlerImgUpdete(){
        this.$refs.Files.click()
      },
      //获取当前已选文件
      handlerImgChange(){
        let file = event.target.files;
        // this.imgRight = []
        for(let i = 0; i < file.length;i++){
          this.File_Arry.push(file[i])
        }
        this.$ImgFileBase64({
          list:this.File_Arry,
          callback(res){
            this.imgRight.push(res)
          }
        })
      },
      //vue-preview
      destroyHandler(){
        this.list = []
      },
      closeHandler(){
        this.list = []
      },
      //状态框关闭
      handlerTipColose(){
        this.handlderUpdate(this.From)
      },
      //当前列详情
      handleEnLook(data){
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/Amount/getprojectmodel',
          data:{
            strid:data.id,
          },
          success(res){
            this.DiaLog.centerDialogVisible = true;
            this.DiaLog.applayId = data.id;
            this.DiaLog.IsEeditState = false
            this.handleEditSell(res.data)
          },
          error(err){
            console.log(err)
          }
        });
      },
      //附件查看
      handleEnFileLook(data){
        this.list = data.filelist.map(res => {
          return {
            src:this.cosIp + res.fpaht
          }
        })
        this.option.list = this.list
        this.$refs.img_viewer.handlerImgshow()

      },
      //当前列详情 v2
      handleEditSell(data){
        this.$nextTick(()=>{
          let arr = data.filsit.map(res => {
            let url = this.cosIp + res.path
            return {
              path:url,
              id:res.id,
              Byid:1
            }
          })
          this.$refs.DiaLogs.imgRight = arr
          this.$refs.DiaLogs.optiona.options = [{
            value:data.OrderID,
            label:data.OrderRemark
          }]
          this.$refs.DiaLogs.FromData = {
            title:data.Name,
            Amount: data.Amoumt,
            type1:data.pid,
            type2:data.Type,
            actiontype:'edit',
            id:data.ID,
            orderid:data.OrderID,
            orderremark:data.OrderRemark,
            remark:data.Reamrk,
            applyid:data.ApplyID,
            orderid:data.OrderID,
            chackdate:data.checkdatae,
            date:data.checkdatae,
            dates:[data.amortizationStartDate,data.amortizationEndDate],
            begintime:data.amortizationStartDate,
            endtime:data.amortizationEndDate,
            costtype:data.costType,
            play:data.PlayID,
            Explain:data.Reamrk
          };
          if(data.costType == 1){
            this.$refs.DiaLogs.Reimbur[1].start = true
            this.$refs.DiaLogs.Reimbur[0].start = false
          }else if(data.costType == 2){
            this.$refs.DiaLogs.Reimbur[0].start = true
            this.$refs.DiaLogs.Reimbur[1].start = false
          }
          this.$refs.DiaLogs.$refs.childInputSearch_hotel.inputValue = data.playname
          this.$refs.DiaLogs.$refs.childInputSearch_hotel.isSelectedItemObj[{id:data.PlayID}]
          this.$refs.DiaLogs.handlerOptions()
          this.$refs.DiaLogs.FromData.type2 = data.Type
          this.$refs.DiaLogs.optiona.value = data.OrderID
        })
      },
      //批量支付 -1
      handlderAddNoderPayment(){
        let _that = this.$refs
        let srt = ''
        this.$nextTick(() => {
          Object.keys(_that).map(res => {
            if(_that[res]){
              if(_that[res].selection){
                if(_that[res].selection.length > 0){
                  _that[res].selection.forEach(res =>{
                    srt = res.id +',' + srt
                  })
                }
              }
            }
          })
          srt=(srt.substring(srt.length-1)==',')?srt.substring(0,srt.length-1):srt;
          this.handlderYinFuJe(srt)
          this.From.id = srt
        })
        //

        this.handlderByUserId()
        this.Statr_Index = 2
        this.tip = {
          dialogVisible:true,
          primary:this.handleAdoptsNoder,
          title:'提示',
          footer:['取消','确定'],
          bodyTitle:null,
          Yclose:this.handlerTipColose
        }
      },
      //批量支付 - 2
      handleAdoptsNoder(){
        if(this.From.ZFstate){
          this.handleAdoptsPayment()
        }else{
          this.$warning('存在未审核报账不允许支付')
        }

      },
      //获取应付金额
      handlderYinFuJe(ids){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/getplayamount',
          data:{ids},
          success(res){
              if(res.data.state){
                this.From.YinFu = res.data.amount
                this.From.ZFstate = res.data.state
              }else{
                this.tip.dialogVisible = false
                this.$warning(res.data.msg)
              }

          },
          error(err){
            console.log(err)
          }
        });
      },
      //当前页
      handleSizeChange(index){
        this.$ThisParent({
          variable:'PAGE_INDEX',
          callblack(res){
            res.switchSet.menulist[res.PAGE_INDEX].page = index;
            res.handlderInitAjax()
          }
        })
      },
      //查看
      handleLookNode( index,row ){
        this.$ThisParent({
          variable:'SHOW_PAGE',
          callblack(_that){
            _that.SHOW_PAGE = 1;
            _that.ISaddBaoZhang.is = true;
            _that.ISaddBaoZhang.ROWEdit = row;
            _that.ISaddBaoZhang.IsEedIt = false
          }
        })
      },
      //退回
      handleReturn( index,row ){
        this.Statr_Index = 1
        this.row = row
        this.tip = {
          dialogVisible:true,
          primary:this.handlerPrimary,
          title:'退回提示',
          footer:['取消','退回'],
          bodyTitle:null,
        }
      },
      //确认退回
      handlerPrimary(){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/backapply',
          data:{
            id:this.row.ID,
            remark:this.TuiText
          },
          success(res){
            this.$tips(res.data.msg)
            this.tip.dialogVisible = false
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
          },
          error(err){
            console.log(err)
          }
        });
      },
      //报账单个支付
      handlePayment(index,row){
        this.handlderByUserId();
        this.handlderByZhiFuId(row,0)
        this.From.YinFu = row.palyamount;
        this.row = row;
        this.Statr_Index = 2;
        this.tip = {
          dialogVisible:true,
          primary:this.handleAdoptsPayment,
          title:'报账支付',
          footer:['取消','保存'],
          bodyTitle:null,
          Yclose:this.handlerYclose
        }
      },
      //报账确定单个支付
      handleAdoptsPayment(){
        let _that = this.From
        if(_that.title == ''){
          this.$warning('请输入标题!')
          return
        }
        if(_that.ShiJi == ''){
          this.$warning('请输入实际金额!')
          return
        }
        if(_that.Remint == ''){
          this.$warning('请输入支付说明!')
          return
        }
        if(_that.user == ''){
          this.$warning('请选择支付账号!')
          return
        }
        //保存支付信息
        if(this.From.ZFstate){
          this.handlderPlayNode()
        }else{
          this.$warning('存在未审核报账不允许支付')
        }

      },
      //保存支付信息
      handlderPlayNode(){
        let _that = this.From
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/playapply',
          data:{
            title:_that.title,
            address:_that.user,
            isallpaly:Number(_that.checked), //
            ids:_that.id ,
            remark:_that.Remint,
            playamount:Number(_that.ShiJi)
          },
          success(res){
            if(res.data.state){
              this.$tips(res.data.msg)
              this.handlervVoucher(res.data)
            }else{
              this.$warning(res.data.msg)
            }
            _that.id = ''
            this.tip.dialogVisible = false;
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
            this.handlderUpdate(this.From)
          },
          error(err){
            console.log(err)
          }
        });
      },
      //当前支付凭证
      handlervVoucher(data){
        this.DiaTip.dialogVisible = true
        this.DiaTip.title = data.title;
        this.DiaTip.SHj = data.amounr
        this.DiaTip.callback = this.handlerUpImg
        this.DiaTip.id = this.row.nowcheckid
        this.DiaTip.ids = data.id
      },
      //获取当前支付明细id
      handlderByZhiFuId(row,type){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/getprojectlist',
          data:{
            applyid:row.ID,
            stae:row.state
          },
          success(res){
            if(type == 0){
              res.data.forEach(res => {
                this.From.id = res.id +',' + this.From.id
              })
              this.From.id=(this.From.id.substring(this.From.id.length-1)==',')?this.From.id.substring(0,this.From.id.length-1):this.From.id;
              this.handlderYinFuJe(this.From.id)
            }
            else{
              this.From.id = res.id
            }
          },
          error(err){
            console.log(err)
          }
        });
      },
      //获取支付账号
      handlderByUserId(){
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/Amount/getoutaddress',
          success(res){
            this.options = res.data.map(res => {
              return {
                value: res.id,
                label: res.name
              }
            })
          },
          error(err){
            console.log(err)
          }
        });
      },
      //确定通过
      handleAdopts(){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/checkupdate',
          data:{
            ids:this.row.ID,
          },
          success(res){
            this.$tips(res.data.msg)
            this.tip.dialogVisible = false
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
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
      //初始化数据
      handlerInit(data,FromData,total,sum){
        this.dataSet.list = data
        this.loading = false
        this.currentPge = FromData.page;
        this.total = total
        this.sum = sum
      },
      //获取当前列报账详情
      handlerExpand(row,a){
        if(a.length == 0){
          return
        }
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/getprojectlist',
          data:{
            applyid:row.ID,
            stae:row.state
          },
          success(res){
            this.dataSet.list[row.index].childrenData = res.data
          },
          error(err){
            console.log(err)
          }
        });
      },
      //  清除数据
      handlderUpdate(data){
        Object.keys(data).forEach(res =>{
          data[res] = ''
        })
      },
    //  关闭弹框事件清除数据
      handlerYclose(){
        this.handlderUpdate(this.From)
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
      //  内层
      handlertableRowClassNames({row, rowIndex}){
        //奇数行
        if(rowIndex % 2 == 1){
          return 'warning-rows'
        }else{
          return 'success-rows'
        }
      },
      //合计
      handlergetSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          if(index === 4){
            sums[index] = this.sum;
            return;
          }
        })
        return sums
      },
    },
  }
</script>

<style scoped>
  @import "../../../static/css/orderTableStyle.css";
  /deep/ .el-table__body-wrapper{
    overflow: scroll !important;
  }
  /deep/ .el-table__body-wrapper .el-table__body{
    width: 100% !important;
  }
  /deep/ .el-table--border td{
    border-right: 1px solid #DDDDDD;
  }
  /deep/ .el-table__footer td:nth-child(1){
    color: red !important;
  }
  /deep/ .el-table__footer td:nth-child(5){
    color: red !important;
  }
  /deep/  .warning-rows {
    background: #F7F7F7 !important;
  }

  /deep/ .success-rows {
    background: #F2F2F2 !important;
  }

  /deep/.warning-row {
    background: #FFFFFF !important;
  }

  /deep/ .success-row {
    background: #F7F7F7 !important;
  }
  .detel{
    width: 23px;
    height: 23px;
    position: absolute;
    right: -5.555555px;
    top: -11.55555px;
    border-radius: 50%;
    background-color: #5996F8;
    cursor: pointer;
    text-align: center;
    line-height: 23px
  }
  .checkboxs /deep/ .el-checkbox__label{
    position: absolute  !important;
    left: -60px  !important;
  }
  .checkboxs /deep/ .el-checkbox__input{
    position: absolute  !important;
    left: 52px  !important;
    top: 4px  !important;
  }
  .checkboxs /deep/ .el-checkbox{
    position: relative  !important;
  }
  /deep/ .el-input__icon{
    line-height: 32px  !important;
  }
  .statr > div{
    margin: 20px 0px;
  }
  .statr > div > span{
    line-height: 32px;
  }
  /deep/ .el-input__inner{
    height: 32px  !important;
  }
  /deep/ .el-textarea__inner{
    resize: none  !important;
    height: 112px !important;
  }
  /deep/ .el-dialog__wrapper{
    position: fixed !important;
  }
  /deep/ .el-table__expand-icon>.el-icon{
    transition: all .5s  !important;
    transform: rotateZ(90deg) !important;
  }
  /deep/ .el-table__expand-icon--expanded{
    transition: all .5s  !important;
    transform: rotate(180deg) !important;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center  !important;
  }
  /deep/ td{
    text-align: center !important;
    font-size: 14px  !important;
    color: #4c4c4c  !important;
  }
  /deep/ .el-table__expanded-cell{
    padding: 0  !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #5996F8  !important;
    color: #fff !important;
  }
  /deep/ .el-pagination.is-background .el-pager li{
    color: #999999  !important;
  }
  /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .btn-prev{
    background: #EAEAEA  !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover{
    color: #BB9860  !important;
  }
  .tav-column /deep/ tbody .el-table__expand-column{
    border-right: 1px solid #EBEEF5  !important;
  }
  .tav-column /deep/ .el-table__expand-icon--expanded{
    color: #5996F8 !important;
  }
  /deep/ .el-button--default {
    border: none  !important;
  }
</style>
