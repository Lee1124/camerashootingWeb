<template>
  <div style="position: relative;height: 100%">
    <div v-show="SHOW_PAGE == 0">
      <div>
        <v-switch :switchSet="switchSet" ></v-switch>
        <div v-show="PAGE_STRT" :id="switchSet.menulist.length">
          <StateSwitch :Switch="Switch" v-if="PAGE_INDEX != 4 && PAGE_INDEX != 5 && PAGE_INDEX != 1 && PAGE_INDEX != 7 && PAGE_INDEX != 6"></StateSwitch>
          <StateSwitch :Switch="SwitchSk" v-if="PAGE_INDEX == 5 && switchSet.menulist.length > 0 || PAGE_INDEX == 1 "></StateSwitch>
        </div>

      <div v-show="PAGE_STRT">
        <!--出纳账目详情-->
        <div v-show="PAGE_INDEX == 4" style="width: 100%;height: max-content;background: #fff;text-align: left;box-sizing: border-box;padding: 15px 67px;font-size: 14px">
          <span><span style="font-weight: bold;color: #4c4c4c">截止到 {{ ISEditChuna.title }} 账户余额 : </span><span style="color: red;font-weight: bold;"> 合计({{ ISEditChuna.sumamount }})</span></span>
          <span style="text-decoration: underline;font-size: 14px;color: #4c4c4c;margin-left: 15px;cursor: pointer" class="chuna-detils" title="查看详情" @click="handlerDetails()">详情</span>
        </div>
        <InputS v-if="PAGE_INDEX == 0" ref="PageIndex" :InputS="InputS"></InputS>
        <InputS v-if="PAGE_INDEX == 1" ref="PageIndex" :InputS="JkInputS"></InputS>
        <InputS v-if="PAGE_INDEX == 2" ref="PageIndex" :InputS="SheHeInputS"></InputS>
        <InputS v-if="PAGE_INDEX == 3" ref="PageIndex" :InputS="ZhiFuInputS"></InputS>
        <InputS v-if="PAGE_INDEX == 4" ref="PageIndex" :InputS="chunaiInputS"></InputS>
        <InputS v-if="PAGE_INDEX == 5" ref="PageIndex" :InputS="ShouKuan"></InputS>
      </div>
      </div>
      <!--白色遮罩层-->
      <div v-if="PAGE_INDEX == 6 && PAGE_STRT || PAGE_INDEX == 7 && PAGE_STRT" style="width: 100%;height: 30px;background: #fff"></div>
      <!--页面集合-->
      <div style="height:calc(100% - 195px);overflow: hidden;overflow-y: auto;height: calc(100% - 195px);
    overflow: hidden auto;
    position: absolute;
    left: 0;
    bottom: -15px;
    right: 0;box-sizing: border-box;
    padding: 34px 50px;top: 220px;" class="commonScroll" v-if="PAGE_INDEX != 7">

          <A v-if="PAGE_NAME == '我的报账申请'" ref="PAGE0" :data="switchSet.menulist[0]"></A>

          <B v-if="PAGE_NAME == '我的交款'" ref="PAGE1" :data="switchSet.menulist[1]"></B>

          <C v-if="PAGE_NAME == '报账审核'" ref="PAGE2" :data="switchSet.menulist[2]"></C>

          <D v-if="PAGE_NAME == '报账支付'" ref="PAGE3" :data="switchSet.menulist[3]"></D>

          <E v-if="PAGE_NAME == '出纳账目'" ref="PAGE4" :data="switchSet.menulist[4]"></E>

          <F v-if="PAGE_NAME == '收款审核'" ref="PAGE5" :data="switchSet.menulist[5]"></F>
      </div>

      <div style="    height: calc(100% - 90px);
    overflow: hidden auto;
    box-sizing: border-box;
    padding: 20px 70px;
    position: absolute;
    width: 100%;
    margin-bottom: 50px;" class="commonScroll" v-if="PAGE_INDEX == 7 || PAGE_INDEX == 6">

          <Gs v-if="PAGE_NAME == '账号转存'" ref="PAGE6" :data="switchSet.menulist[6]"></Gs>
          <h v-if="PAGE_NAME == '财务配置'" ref="PAGE7" :data="switchSet.menulist[7]"></h>

      </div>

    </div>
    <addBaozhang ref="addBaozhang" v-if="SHOW_PAGE == 1"></addBaozhang>
  </div>
</template>

<script>
  import switching from '../tool/MenuSwitching'; //菜单
  import StateSwitch from '../tool/StateSwitch';    //状态选择
  import InputS from '../tool/InputSearch';       //搜索
  import addBaozhang from '../caiwu/wodebaozhangshenqing/addbaozhang' //添加报账
  import A from './page/baozhangshengqing';  //我的报账申请
  import B from './page/wodejiaokuan';  //我的交款
  import C from './page/baozhangshenhe';  //报账审核
  import D from './page/baozhangzhifu';  //报账支付
  import E from './page/cunazhangmu';  //出纳账目
  import F from './page/shoukuanshenghe';  //收款审核
  import Gs from './page/zhanghaozhuancun';  //账号转存
  import h from './page/caiwupeizhi';  //账号转存
    export default {
        name: "caiwu",
        components:{
          'v-switch':switching,
          A,B,C,D,E,F,Gs,h,
          StateSwitch,InputS,addBaozhang,
        },
      data() {
        return {
          SHOW_PAGE:0,                        // 当前功能页
          PAGE_INDEX:0,                             //当前菜单
          PAGE_NAME:'',                         //当前菜单名称
          PAGE_STRT:true,                         //是否存在空权限
          switchSet:{
            menulist:[
              {name:"我的报账申请",start:true,page:1,id:0,show:false},
              {name:"我的交款",start:false,page:1,id:1,show:false},
              {name:"报账审核",start:false,page:1,id:2,show:false},
              {name:"报账支付",start:false,page:1,id:3,show:false},
              {name:"出纳账目",start:false,page:1,id:4,show:false},
              {name:"收款审核",start:false,page:1,id:5,show:false},
              {name:"账号转存",start:false,page:1,id:6,show:false},
              {name:"财务配置",start:false,page:1,id:7,show:false},
            ],      //菜单列表
            callback:this.handlercallback,      //传递方法 执行回调
          },
          //我的报账申请搜索
          Switch:{
            switchlist:[
              {name:'全部状态',start:false,val:''},
              {name:'待提交',start:true,val:1},
              {name:'待审核',start:false,val:2},
              {name:'待支付',start:false,val:3},
              {name:'已支付',start:false,val:-1},
              {name:'退回',start:false,val:5}
            ],
            callback:this.handlerswitch,      //传递方法 执行回调
          },
          //收款审核
          SwitchSk:{
            switchlist:[
              {name:'全部状态',start:false,val:''},
              {name:'待审核',start:false,val:1},
              {name:'已审核',start:false,val:2},
              {name:'退回',start:false,val:0}
            ],
            callback:this.handlerswitch,      //传递方法 执行回调
          },
          //我的报账申请
          InputS:{
            InputList:[
              {placeholder:'编号',val:''},
              {placeholder:'支付对象',val:''},
              {placeholder:'标题',val:''}
            ],
            handlerSearch:this.handlerSearchs
          },
          //我的交款
          JkInputS:{
            InputList:[
              {placeholder:'编号',val:''},
              {placeholder:'订单',val:''}
            ],
            handlerSearch:this.handlerSearchs
          },
          //报账审核搜索
          SheHeInputS:{
            InputList:[
              {placeholder:'编号',val:''},
              {placeholder:'支付对象',val:''},
              {placeholder:'标题',val:''},
              {placeholder:'提交人',val:''}
            ],
            handlerSearch:this.handlerSearchs,      //传递方法 执行回调
          },
          //报账支付
          ZhiFuInputS:{
            InputList:[
              {placeholder:'编号',val:''},
              {placeholder:'支付对象',val:''},
              {placeholder:'标题',val:''},
              {placeholder:'提交人',val:''}
            ],
            handlerSearch:this.handlerSearchs,      //传递方法 执行回调
          },
          //出纳
          chunaiInputS:{
            InputList:[
              {placeholder:'搜索标题',val:''},
            ],
            handlerSearch:this.handlerSearchs,      //传递方法 执行回调
          },
          //收款审核
          ShouKuan:{
            InputList:[
              {placeholder:'编号',val:''},
              {placeholder:'订单',val:''},
              {placeholder:'添加人',val:''},
            ],
            handlerSearch:this.handlerSearchs,      //传递方法 执行回调
          },
          //添加申请报账是否可操作
          ISaddBaoZhang:{
            is:false,         //是否显示
            ROWEdit:{},       //参数
            IsEedIt:true,       //是否可编辑
            isAdd:false,        //是否连续添加
          },
          //出纳账目详情
          ISEditChuna:{},
          StateFormData:null,       //搜索数据 额外数据
          StateFormDatas:null     //主菜单默认
        };
      },
      methods: {
        //菜单选择执行回调
        handlercallback(row,index){
          this.PAGE_NAME = row.name;
          this.StateFormData = null;
          this.PAGE_INDEX = index;
          //通过主菜单定位子菜单
          if(index == 0) {
            // 我的报账申请
            this.handlerMenu(this.Switch.switchlist,index+1)
            this.handlerState(this.Switch.switchlist.filter(res=> res.start? res:'')[0])
            this.InputS={
              InputList:[
                {placeholder:'编号',val:''},
                {placeholder:'支付对象',val:''},
                {placeholder:'标题',val:''}
              ],
              handlerSearch:this.handlerSearchs
            }
          }
          //报账审核
          else if(index == 2){
            this.handlerMenu(this.Switch.switchlist,index)
            this.handlerState(this.Switch.switchlist.filter(res=> res.start? res:'')[0])
            this.StateFormDatas = {val:true,placeholder:'只看我审核的报账'}
          }
          else if(index == 1){
            this.handlerMenu(this.SwitchSk.switchlist,index)
            this.handlerState(this.SwitchSk.switchlist.filter(res=> res.start? res:'')[0])
          }
          //报账支付 //出纳账目 //报账审核
          else if(index == 3 || index == 4 ){
            this.handlerMenu(this.Switch.switchlist,index)
            this.handlerState(this.Switch.switchlist.filter(res=> res.start? res:'')[0])
          }
          //收款审核
          else if(index == 5 ){
            this.handlerMenu(this.SwitchSk.switchlist,1)
            this.handlerState(this.SwitchSk.switchlist.filter(res=> res.start? res:'')[0])
          }
          else{
            this.StateFormDatas = null
          }
          this.handlerClearData()
          this.handlderInitAjax();
        },
        //一级菜单清除搜索项
        handlerClearData(){
          let arr = ['InputS','JkInputS','SheHeInputS','ZhiFuInputS','chunaiInputS']
          arr.forEach(res => {
            this[res].InputList.forEach(item => {
              item.val = ''
            })
          })
        },
        //单个一级菜单设置二级
        handlerMenu(data,a){
          data.filter((res,i) => {
            a == i? res.start = true : res.start = false
          })
          this.$nextTick(()=> {
            this.$refs.PageIndex.handlerPageIndex(this.PAGE_INDEX)
          })
        },
        //状态设定
        handlerState(data){
          this.switchSet.menulist[this.PAGE_INDEX].lib =  data;
          this.switchSet.menulist[this.PAGE_INDEX].search = this.InputS;
          this.switchSet.menulist[this.PAGE_INDEX].page = 1
        },
        //  状态选择回调
        handlerswitch(row,index){
          this.handlerState(row)
          this.handlderInitAjax();
        },
        // 查询
        handlerSearchs(data,FROM_DATA){
          if(this.StateFormData){
            this.StateFormDatas = null
          }
          this.StateFormData = FROM_DATA
          this.InputS.InputList = data
          this.handlderInitAjax();
        },
        //  数据请求 入口  (可全局调用刷新当前表格数据)
        handlderInitAjax(){
          if(this.PAGE_INDEX == 1){
            this.handlerReceivables({
              actionetype:'my',
              arr:this.JkInputS.InputList,
              number:8
            })
          }
          else if(this.PAGE_INDEX == 4){
            if(!this.StateFormData){
              this.handlerCashierDetiles()
            }else{
              this.handlerCashierInit()
            }
          }
          else if(this.PAGE_INDEX == 5){
            let data = this.switchSet.menulist[this.PAGE_INDEX]
            this.handlerReceivables({
              actionetype:'check',
              arr:this.ShouKuan.InputList,
              number:8,
              btime:this.StateFormData?this.StateFormData[0].val:'',
              etime:this.StateFormData?this.StateFormData[1].val:'',
            })
          }
          else{
            if(this.switchSet.menulist[this.PAGE_INDEX].lib == undefined){
              return
            }
            var strtype = '',
              state = this.switchSet.menulist[this.PAGE_INDEX].lib.val,
              no = this.InputS.InputList[0]?this.InputS.InputList[0].val:'',
              playname = this.InputS.InputList[1]?this.InputS.InputList[1].val:'',
              title = this.InputS.InputList[2]?this.InputS.InputList[2].val:'',
              addusername = this.InputS.InputList[3]?this.InputS.InputList[3].val:'',
              index = this.switchSet.menulist[this.PAGE_INDEX].page;
            if(this.PAGE_INDEX == 0){
              strtype = 'my';
            }
            if(this.PAGE_INDEX == 2){
              strtype = 'check'
            }
            if(this.PAGE_INDEX == 3){
              strtype = 'play'
            }

            let FORM_DATA = {
              strtype:strtype,
              state:state,
              no:no,
              title:title,
              playname:playname,
              addusername:addusername,
              index:index,
              number:8,
            }
            if(this.PAGE_INDEX  == 2){
              console.log(this.StateFormData)
              if(this.StateFormData){
                if(this.StateFormData.placeholder == "只看我审核的报账"){

                  if(this.StateFormData.val){
                    FORM_DATA.nowcheckid = getkevalue().userid
                  }
                }
              }
              else if(this.StateFormDatas){
                if(this.StateFormDatas.placeholder == "只看我审核的报账"){
                  if(this.StateFormDatas.val){
                    FORM_DATA.nowcheckid = getkevalue().userid
                  }
                }
              }
            }
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/getapplylist',
              data:{
                ...FORM_DATA
              },
              success(res){
                this.switchSet.menulist[this.PAGE_INDEX].data = res.data;
                this.$refs['PAGE'+this.PAGE_INDEX].handlerInit(res.data.count,res.data)
                if(res.data.list.length == 0){
                  if( this.switchSet.menulist[this.PAGE_INDEX].page > 2){
                    this.switchSet.menulist[this.PAGE_INDEX].page--
                    this.handlderInitAjax()
                  }
                }
              },
              error(err){
                console.log(err)
              }
            });
          }
        },
        //  我的交款 or 收款审核 请求参数设置
        handlerReceivables(param){
          let index = this.switchSet.menulist[this.PAGE_INDEX].page,
              state = this.switchSet.menulist[this.PAGE_INDEX].lib.val;
          let FORM_DATA = {
            actionetype:param.actionetype,
            no:param.arr[0].val,
            orderremark:param.arr[1].val,
            btime:param.btime? param.btime:'',
            etime:param.etime? param.etime:'',
            state:state,
            addname:param.arr[2]?param.arr[2].val:'',
            index:index,
            number:param.number
          };
          this.handlerPayment_Audit(FORM_DATA)
        },
        //  我的交款 or 收款审核 数据请求
        handlerPayment_Audit(FORM_DATA){
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/AmountOrder/getapplylist',
            data:{
              ...FORM_DATA
            },
            success(res){
              this.switchSet.menulist[this.PAGE_INDEX].data = res.data.list;
              this.$refs['PAGE'+this.PAGE_INDEX].handlerInit(res.data.count,res.data)
              if(res.data.length == 0){
                if( this.switchSet.menulist[this.PAGE_INDEX].page > 2){
                  this.switchSet.menulist[this.PAGE_INDEX].page--
                  this.handlderInitAjax()
                }
              }
            },
            error(err){
              console.log(err)
            }
          });
        },
        //  出纳账目 点击详情
        handlerDetails(){
          this.$refs.PAGE4.handlerDetails()
        },
        //出纳账目数据请求api
        handlerCashierInit(btimes,endtimes){
          let btime = this.StateFormData? this.StateFormData[0].val : btimes,
              endtime = this.StateFormData? this.StateFormData[1].val : endtimes,
              address = this.StateFormData?this.StateFormData[2].val : '',
              temp = this.StateFormData?this.StateFormData[3].val : '',
              title = this.chunaiInputS.InputList[0].val;
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/AmountManage/Amount/getamountbalancelist',
            data:{
              btime:btime,
              endtime:endtime,
              address,
              temp:Number(temp),
              title
            },
            success(res){
              this.switchSet.menulist[this.PAGE_INDEX].data = res.data.list;
              this.$refs['PAGE'+this.PAGE_INDEX].handlerInit(res.data)
            },
            error(err){
              console.log(err)
            }
          });
        },
        handlerCashierDetiles(){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/Amount/getamountbalance',
            data:{
              strdate:'',
            },
            success(res){
                this.ISEditChuna = res.data
                this.$nextTick(()=> {
                  try {
                    this.$refs.PAGE4.handlerDetile(res.data)
                  }catch (e) {
                    //  允许 报错
                  }
                })
              let a = this.$refs.PageIndex.TIME_FORM
              let b = res.data.btime.split('/')
              let c = res.data.etime.split('/')
              a[0].val = b[0]+'-'+b[1]+'-'+b[2];
              a[1].val = c[0]+'-'+c[1]+'-'+c[2];
              this.handlerCashierInit(res.data.btime,res.data.etime)
            },
            error(err){
              console.log(err)
            }
          });
        },
        //出纳账目数据请求详情getapplylist
        handlerCashierDetile(time,type){
          this.$Axios({
            method:'GET',
            url:'/xlapi/CameraManage/AmountManage/Amount/getamountbalance',
            data:{
              strdate:time || '',
            },
            success(res){
              if(!time){
                this.ISEditChuna = res.data
                this.$nextTick(()=> {
                  try {
                    this.$refs.PAGE4.handlerDetile(res.data)
                  }catch (e) {
                  //  允许 报错
                  }
                })
              }else{
                this.ISEditChuna = res.data
                this.$refs.PAGE4.Data_Detile = res.data;
                if(type){
                  this.$refs.PAGE4.dialogVisible = true
                }
              }
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
.chuna-detils:hover{
  color: #5996F8 !important;
}
</style>
