<!-- 添加报账模态框-->
<template>
  <el-dialog
    :title="DiaLog.name"
    :visible.sync="DiaLog.centerDialogVisible"
    width="730px"
    center
    >
    <div class="option-box" v-if="DiaLog.IsEeditState">
      <input type="file" ref="FileAll" multiple @change="handlerFiles()" style="display: none">
      <div style="height: 40px"  class="clearfloat">
        <span style="float: left" >
          <span class="clearfloat">
            <span style="float: left;line-height: 40px;padding-right: 5px;width: 60px;    text-align: right;">标题 :</span>
            <el-input style="float: left;width:190px;height:32px;" v-model="FromData.title" placeholder="请输入输入标题"></el-input>
          </span>
        </span>
        <span style="float: right;position: relative;    right: 45px;" >
          <span class="clearfloat" >
            <span style="float: left;line-height: 32px;padding-right: 5px;width: 60px;    text-align: right;">金额 :</span>
            <el-input style="float: left;width:190px;
height:32px;" v-model="FromData.Amount" placeholder="请输入输入金额"></el-input>
            <span style="position: absolute;right: 3px;top: 0;bottom: 0;margin: 0 auto;line-height: 32px;color: #BBBBBB">元</span>
          </span>
        </span>
      </div>
      <div style="height: 40px" class="clearfloat">
        <span style="float: left;line-height: 32px;padding-right: 5px;width: 60px;    text-align: right;">类型 :</span>
        <el-select style="float: left;width:190px;
height:32px;margin-right: 20px" v-model="FromData.type1" :placeholder="FromData.leiXin1" @change="handlerOptions()">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="float: left;width:190px;
height:32px;margin-right: 20px" v-model="FromData.type2" :placeholder="FromData.leiXin2">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </div>
      <div style="height: 40px" class="clearfloat" v-if="FromData.type1 == 2">
        <div class="clearfloat" style="float: left">
          <span style="float: left;padding-right: 5px;width: 60px;    text-align: right;    height: 40px;
    line-height: 40px;">报账 :</span>
          <div v-for="(item,index) in Reimbur" style="cursor: pointer;float: left;height: 40px;
    line-height: 50px;" :key="index">
            <div @click="handlerReimbur(index)" style="margin-right: 35px">
              <img v-if="item.start" src="../../../../static/img/caiwu/1.png" alt="">
              <img v-else src="../../../../static/img/caiwu/0.png" alt="">
              <span style="position: relative;top: -5px;">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div style="float: right;
    line-height: 32px;" v-if="!Reimbur[0].start">
          <span style="float: left;    margin-right: 50px;">
            费用时间 :
          </span>
        <el-date-picker
          v-model="FromData.date"
          type="date"
          value-format="yyyy-MM-dd"
          class="date1"
          style="float: right;position: relative;left: -45px;width: 190px;"
          placeholder="选择日期">
        </el-date-picker>
      </div>

        <div style="float: right;
    line-height: 32px;" v-if="Reimbur[0].start">
          <span style="float: left">
            费用时间 :
          </span>
          <el-date-picker
            v-model="FromData.dates"
            type="daterange"
            class="date2"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div style="height: 40px" class="clearfloat" >
        <div v-if="FromData.type1 == 1" >
          <span style="float: left;position: relative;top: 5px;margin-right: 5px;width:60px;    text-align: right;">订单 :</span>
          <Rsch style="float: left;    margin-right: 135px;width: 190px" :option="optiona"></Rsch>
        </div>
        <div style="margin-right: 15px">
          <span style="float: left;position: relative;top: 5px;left: -4px;margin-right: 1px;    text-align: right;">支付对象 :</span>
          <div style="float: left;width:190px;height:32px;">
            <inputSearch2 @inputFocus="handlergetHotelData" @createNewContent="handlercreateNewContent" ref="childInputSearch_hotel" :listData="hotelListData" inputSearchPlaceholder="请选择支付对象"></inputSearch2>
          </div>

        </div>
      </div>
      <div style="height: auto" class="clearfloat">
        <span style="float: left;    text-align: right;width: 60px;">说明 :</span>
        <el-input
          type="textarea"
          style="resize: none;float: left;width: 84%;padding-left: 5px"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="FromData.Explain">
        </el-input>
      </div>
      <div style="height: auto" class="clearfloat">
        <div style="float: left;width: 60px;    text-align: right;padding-top: 6px;">
          图片 :
        </div>
        <div  style="width: 90.6%;height: 150px;overflow: hidden;overflow-y: auto;float: right;" class="commonScroll">
          <div style="padding-top: 10px;display: flex;flex-wrap: wrap;">
            <div  style=";margin-right: 20px;width:126px; height:90px;margin-bottom: 20px">
              <img style="cursor: pointer" title="上传图片" @click="handlerImgUpdete()" src="../../../../static/img/caiwu/defultUpImg.png" width="126" height="90" alt="">
            </div>
            <div v-for="(item,index) in imglist" :key="index" style="width:126px; height:90px;margin-right: 20px;margin-bottom: 20px;position: relative">
              <img style="max-height: 90px;max-width: 126px":src="item.path" alt="">
              <i class="detel" @click="handlerDetel(index,item)"  title="删除图片">
                <img src="../../../../static/img/caiwu/detel.png" style="width: 12px;position: relative;
    left: -1px;" alt="">
              </i>
            </div>

            <div v-for="(item,index) in imgRight" :key="index+'a'" style="width:126px; height:90px;margin-right: 20px;margin-bottom: 20px;position: relative">
              <img style="max-height: 90px;max-width: 126px" :src="item.path" alt="">
              <i class="detel" @click="handlerDetel(index,item)"  title="删除图片">
                <img src="../../../../static/img/caiwu/detel.png" style="width: 12px;position: relative;
    left: -1px;" alt="">
              </i>
            </div>


          </div>
        </div>
      </div>
    </div>
    <div v-else class="items-names">
      <div style="margin-bottom: 20px;height: 40px" class="clearfloat">
        <span style="float: left" >
          <span class="clearfloat">
            <span style="float: left;line-height: 40px;padding-right: 5px;    text-align: right;    width: 60px;">标题 :</span>
            <el-input style="float: left;width:190px;
height:32px;margin-top: 5px;" v-model="FromData.title" :disabled="true" placeholder="请输入输入标题"></el-input>
          </span>
        </span>
        <span style="float: right;position: relative;    right: 45px;" >
          <span class="clearfloat" >
            <span style="float: left;line-height: 32px;padding-right: 5px;    text-align: right;    width: 60px;">金额 :</span>
            <span style="float: left;line-height: 32px;color: #4c4c4c;width: 190px;">{{ FromData.Amount }}元</span>
          </span>
        </span>
      </div>
      <div style="margin-bottom: 20px;height: 40px" class="clearfloat">
        <span style="float: left;line-height: 32px;padding-right: 5px;    text-align: right;    width: 60px;">类型 :</span>
        <el-select style="float: left;width:190px;
height:32px;margin-right: 20px" v-model="FromData.type1" :placeholder="FromData.leiXin1" @change="handlerOptions()" disabled >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div style="float: left">
          <span style="float: left;line-height: 32px;padding-left: 15px;">二级类型 : </span>
          <el-select style="float: left;width:190px;
height:32px;margin-right: 20px;" class="items-names-baer" disabled  v-model=" FromData.type2" :placeholder="FromData.leiXin2">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>


      </div>
      <div style="margin-bottom: 20px;height: 40px" class="clearfloat" v-if="FromData.type1 == 2">
        <div class="clearfloat" style="float: left">
          <span style="float: left;padding-right: 5px;    text-align: right;    width: 60px;">报账 :</span>
          <div v-for="(item,index) in Reimbur" style="cursor: pointer;float: left" :key="index">
            <div style="margin-right: 35px">
              <span v-if="item.start" style="margin-left: 15px;">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div style="float: right;
    line-height: 32px;" v-if="!Reimbur[0].start">
          <span style="float: left;margin-right: 50px;">
            费用时间 :
          </span>
          <el-date-picker
            v-model="FromData.date"
            type="date"
            value-format="yyyy-MM-dd"
            class="dates1"
            disabled
            style="float: right;position: relative;    left: -45px;
    width: 190px;padding: 0"
            placeholder="选择日期">

          </el-date-picker>
        </div>

        <div style="float: right;
    line-height: 32px;" v-if="Reimbur[0].start">
          <span style="float: left">
            费用时间 :
          </span>
          <el-date-picker
            v-model="FromData.dates"
            type="daterange"
            class="date2"
            disabled
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div style="margin-bottom: 20px;height: 40px" class="clearfloat" >
        <div v-if="FromData.type1 == 1" >
          <span style="float: left;position: relative;top: 5px;margin-right: 5px;width: 60px;    text-align: right;">订单 :</span>
          <Rsch style="float: left;    margin-right: 135px;" disabled :option="optiona"></Rsch>
        </div>
        <div style="margin-right: 15px">
          <span style="float: left;position: relative;top: 5px;left: -4px;margin-right: 1px;    text-align: right;">支付对象 :</span>
          <div style="float: left;width:190px;height:32px;">
            <inputSearch2  disabled @inputFocus="handlergetHotelData" @createNewContent="handlercreateNewContent" ref="childInputSearch_hotel" :listData="hotelListData" :isReadonly="false" inputSearchPlaceholder="请选择支付对象"></inputSearch2>
          </div>

        </div>
      </div>
      <div style="margin-bottom: 20px;height: auto" class="clearfloat">
        <span style="float: left;    text-align: right;width: 60px;    padding-top: 6px;">说明 :</span>
        <el-input
          type="textarea"
          style="resize: none;float: right;width: 88.6%"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          disabled
          v-model="FromData.Explain">
        </el-input>
      </div>
      <div style="margin-bottom: 20px;height: auto" v-if="imgRight.length > 0" class="clearfloat">
        <div style="float: left;width: 60px;    text-align: right;    padding-top: 6px;">
          图片 :
        </div>
        <div  style="width:90.6%;height: 150px;overflow: hidden;overflow-y: auto;float: right;" class="commonScroll">
          <div style="padding-top: 10px;display: flex;flex-wrap: wrap;">
            <div v-for="(item,index) in imglist" :key="index" style="width:126px; height:90px;margin-right: 20px;margin-bottom: 20px;position: relative">
              <img style="max-height: 90px;max-width: 126px" :src="item.path" alt="">

            </div>

            <div v-for="(item,index) in imgRight" :key="index+'a'" style="width:126px; height:90px;margin-right: 20px;margin-bottom: 20px;position: relative">
              <img style="max-height: 90px;max-width: 126px" :src="item.path" alt="">
            </div>


          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="DiaLog.IsEeditState">
      <el-button style="border: none;margin-left: 400px;" @click="DiaLog.centerDialogVisible = false">取消</el-button>
      <el-button style="background: #5996F8;    width: 100px;" type="primary" @click="handlerDiaLogCent()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Rsch from '../../common/RemoteSearch/RemoteSearch';
    export default {
        name: "AddReimbursement",
        components:{
          Rsch
        },
        props:{
          DiaLog:{
            type:Object,
            default: function () {
              return new Object()
            }
          },
        },
        data() {
          return {
            cosIp:cosIp,
            options:[],
            Reimbur:[{name:'摊销',start:false},{name:'非摊销',start:true}],
            FromData:{
              title:'',       //标题
              Amount:'',      //金额
              type1:'',       //类型
              type2:'',     //类型
              date:"",      //时间
              Explain:'',     //备注
              dates:'',       //摊销时间
              play:'',
              id:'',
              costtype:1,
              actiontype:'add',
              leiXin1:'请选择类型',
              leiXin2:'请选择类型'
            },
            imglist:[],       //图片渲染列表
            options1:[],   //报账类型 v1
            options2:[],    //报账类型 v2
            optiona:{
              value:'',
              options:[],
              callblack:this.handlerOrdera,
              key:'strname',
              url:'/xlapi/CameraManage/AmountManage/Amount/getorertitle'
            },
            hotelListData:[],
            fileArry:[],                  //图片
            imgRight:[],                  //已上传
          };
        },
      watch:{
          'FromData.Amount':function ( a , b ) {
            if( a < 0 ) {
              this.FromData.Amount = ''
            }
          }
      },
        methods:{
          //删除图片
          handlerDetel(i,row){
            if(row.Byid == 0){
              this.fileArry.forEach((res,i) => {
                if(row.index == i){
                  this.fileArry.splice(i,1)
                }
              })
              this.imglist = []
              this.$ImgFileBase64({
                list:this.fileArry,
                callback(res){
                  this.imglist.push({
                    path:res.path,
                    Byid:0,
                    index:res.index
                  })
                }
              })
            }else{
              let file = [row].map(res => {
                return {
                  id:res.id,
                  key:res.path.split(this.cosIp)[1]
                }
              })
              this.$DetelImg({
                file:file,
                callback(res){
                  if(res){
                    this.$Axios({
                      method:'GET',
                      url:'/xlapi/CameraManage/AmountManage/Amount/dellprojectfile',
                      data:{id:res.id},
                      success(res){
                        this.$tips('删除成功!')
                        this.imgRight.splice(i,1)
                        this.$parent.handlerInit(this.DiaLog.applayId)
                      },
                      error(err){
                        console.log(err)
                      }
                    });
                  }
                }
              })
            }
          },
          //报账类型 v1 ====>  报账类型 v2
          handlerOptions(){
            let id = this.FromData.type1;
            this.FromData.type2 = ''
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getapplytypelist',
              data:{strpid:id},
              success(res){
                this.options2 = res.data.map(res=>{
                  return {
                    label:res.name,
                    value:res.id
                  }
                })
              },
              error(err){
                console.log(err)
              }
            });
          },
          //获取当前已选择文件
          handlerFiles(){
            let fileList = event.target.files;
            for(let i = 0; i < fileList.length;i++){
              this.fileArry.push(fileList[i])
            }
            this.imglist = []
            this.$ImgFileBase64({
              list:this.fileArry,
              callback(res){
                this.imglist.push({
                  path:res.path,
                  Byid:0,
                  index:res.index
                })
              }
            })
          },
          //图片上传
          handlerImgUpdete(){
            this.$refs.FileAll.click()
          },
          //是否摊销
          handlerReimbur(i){
            this.Reimbur.filter((res,index) => { i == index? res.start = true:res.start = false})
            if(i == 0){
              this.FromData.costtype = 2
            }else{
              this.FromData.costtype = 1
            }
            this.FromData.date = '' ;
            this.FromData.dates = ''
          },
          //获取报账类型
          handlerType(){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getapplytypelist',
              data:{strpid:0},
              success(res){
                this.options1 = res.data.map(res => {
                  return {
                    label:res.name,
                    value:res.id
                  }
                })
              },
              error(err){
                console.log(err)
              }
            });
          },
          //保存   - 2
          handlerDiaLogCent(){
            // DiaLog.centerDialogVisible = false
            let _that = this.FromData

            if(_that.title == ''){
              this._handlertips('请输入标题!')
              return
            }

            if(_that.Amount == ''){
              this._handlertips('请输入金额!')
              return
            }
            if(_that.play == ''){
              this._handlertips('请选择支付对象!')
              return
            }
            if(_that.type1 == ''){
              this._handlertips('请选择报账类型!')
              return
            }
            if(_that.type2 == ''){
              this._handlertips('请选择报账费用类型')
              return
            }
            if(_that.type1 == 1){
              if(this.optiona.value == ''){
                this._handlertips('请输入订单!')
                return
              }
            }
            if(_that.type1 == 2){
              if(this.FromData.costtype == 1){
                if(_that.date == ''){
                  this._handlertips('请选择时间!')
                  return
                }
              }else{
                if(_that.dates.length == 0){
                  this._handlertips('请选择时间段!')
                  return
                }
              }
            }
            this.handlerDiaLogCents()
          },
          //保存   - 2
          handlerDiaLogCents(){
              let formData = {
                applyid:this.DiaLog.applayId,
                amount:	this.FromData.Amount,
                intype: this.FromData.type2,
                orderid:'',
                orderremark:'',
                costtype:this.FromData.costtype,
                begintime:'',
                endtime:'',
                chackdate:'',
                title: this.FromData.title,
                remark: this.FromData.Explain,
                actiontype: this.FromData.actiontype,
                id:this.FromData.id,
                play:this.FromData.play
              }
            if(this.FromData.type1 == 1){
              formData.orderid = this.optiona.value
              this.optiona.options.filter(res => {
                if(res.value == this.optiona.value){
                  formData.orderremark = res.label
                }
              })
            }
            if(this.FromData.type1 == 2){
              this.Reimbur.filter(res=>{
                if(res.start == true){
                  if(res.name == '摊销'){
                    formData.begintime = this.FromData.dates[0]
                    formData.endtime = this.FromData.dates[1]
                    formData.costtype = 2
                  }else{
                    formData.chackdate = this.FromData.date
                    formData.costtype = 1
                  }
                }
              })
            }

            this.handlerDiaLogCentss(formData)
          },
          //保存   - 3
          handlerDiaLogCentss(data){
            this.DiaLog.centerDialogVisible = false
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/addprojectinfo',
              data,
              success(res){
                if(res.data.state){
                  this.$tips(res.data.msg)
                  this.FromData.id = res.data.id;

                  this.handleruploadImg()
                  //调用父级方法查询表格数据
                  this.$ThisParent({
                    variable:'PAGE_INDEX',
                    callblack(_that){
                      if(_that.ISaddBaoZhang.isAdd){
                        this.DiaLog.centerDialogVisible = true
                      }
                    }
                  })
                  this.$parent.handlerInit(this.DiaLog.applayId)
                }else{
                  this.$warning(res.data.msg)
                }
              },
              error(err){
                console.log(err)
              }
            });
          },
          //图片上传 腾讯云
          handleruploadImg(){
            if(this.fileArry.length == 0){
              return
            }
            this.$UpImgFile({
              path: getkevalue().branchid+'/'+'amouent' + '/'+ this.FromData.id,
              file:this.fileArry,
              callback(res){
                this.handlderuloadImg(res)

              }
            })
          },
          //图片路径存储到数据库
          handlderuloadImg(res){
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/addprojectfile',
              data:{
                applyid:this.FromData.id,
                filepath:res.key
              },
              success(res){
                //调用父级方法查询表格数据
                this.$ThisParent({
                  variable:'Addplay',
                  callblack(_that){
                    _that.handlerInit(this.DiaLog.applayId)
                  }
                })
                console.log(res)
              },
              error(err){
                console.log(err)
              }
            });
          },
          //提示
          _handlertips(title){
            this.$message({
              message: title,
              type: 'warning'
            });
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
          //创建支付对象
          handlercreateNewContent(){
            this.$ThisParent({
              variable:'Addplay',
              callblack(_that){
                _that.Addplay.Visible = true
              }
            })
          },
          //支付对象数据搜索
          handlergetHotelData(option){
            if(!this.DiaLog.IsEeditState){
              return
            }
            try {
              this.FromData.play = this.$refs.childInputSearch_hotel.isSelectedItemObj[0].id
            }catch (e) {

            }

            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/getsupplerlist',
              data:{
                key:option.val,
                numbe:10
              },
              success(res){
                this.hotelListData = res.data.map(res => {
                  return {
                    name:res.name,
                    id:res.id
                  }
                })
                this.hotelListData.unshift({
                  name:'没有合适的?',
                  id:-1
                })
              },
              error(err){
                console.log(err)
              }
            });
          }
        },
        created(){
          this.handlerType();  //报账类型
        }
    }
</script>

<style scoped>
  .items-names-baer /deep/ .el-input__inner{
    padding-left: 5px !important;
  }
  .items-names /deep/ .dates1 .el-input__inner{
    padding: 0 !important;
  }
  .items-names /deep/ .el-input__prefix{
    display: none !important;
  }
  /deep/ .el-dialog__header{
    padding: 35px 47px 10px !important;
  }
  .items-names{
    box-sizing: border-box;
    padding: 10px 43px;
  }

  .items-names /deep/ .el-input__suffix{
    display: none !important;
  }

  .items-names /deep/ .inputBox .input{
    border: none !important;
    padding: 0 17px !important;
  }
  .items-names /deep/ .el-textarea__inner{
    background: #ffffff  !important;
    border: none  !important;
    color: #4c4c4c  !important;
    padding: 5px 17px !important;
  }
  .items-names /deep/ .el-input__inner{
    border: none  !important;
    background-color: #ffffff  !important;
    color: #4c4c4c  !important;
  }
  /deep/ .el-icon-date:before{
    content: "\E78E" !important;
    font-size: 18px !important;
    margin-right: 15px !important;
  }
  .date2 {
    width: 300px !important;
  }
  .date2 /deep/.el-date-editor .el-range-separator{
    line-height: 24px;
  }
  .date2 /deep/ .el-input__icon{
    line-height: 24px;
  }
  .el-dialog--center .el-dialog__body{
    padding: 45px 50px 30px;
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

  /deep/ .botton-b:focus, .botton-b:hover{
    background: none !important;
    color: #5996F8;
  }
/deep/ .botton-a:focus, .botton-a:hover{
  background: none!important;
  color: #4c4c4c;
}

  .botton-b{
    background: #5996F8;
  }
.botton-a{
  margin-left: 490px;
  border: none;
}
/deep/ .el-textarea__inner{
  resize: none!important;
  height: 112px !important;
}
/deep/ .el-textarea{
  width: 480px !important;
}
/deep/ .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
}
/deep/ .el-input__prefix{
  right: -170px !important;
  width: max-content !important;
  left: 0 !important;
  margin: 0 auto !important;
}
 /deep/ .el-input__icon{
  line-height: 32px !important;
}
/deep/ .el-input__inner{
  height: 32px !important;
}
.option-box > div{
   margin-bottom: 10px;
}
</style>
