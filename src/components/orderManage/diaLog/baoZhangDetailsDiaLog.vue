<!--添加交款记录弹框-->
<template>
  <div id="priceOutDetailsDiaLog">
    <el-dialog
      title="查看报账明细"
      :visible.sync="baoZhangObj.showPriceOutDetailsDiaLog"
      custom-class="commonDiaLog priceOutDetailsDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <div class="content" v-loading="isShowLoading" element-loading-text="正在加载...">
        <ul class="form commonScrollStyle">
          <li class="form-inner">
            <div class="formLeft">
              <label>标 <i style="width: 24px;display: inline-block"></i>题： </label>
              <div class="commonBox">
                {{listData.Name}}
              </div>
            </div>
            <div class="formRight">
              <label>金<i style="width: 25px;display: inline-block"></i>额： </label>
              <div class="commonBox">
                {{listData.Amoumt}}元
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>类<i style="width: 28px;display: inline-block"></i>型： </label>
              <div class="commonBox">
                {{FJtype}}
              </div>
            </div>
            <div class="formRight">
              <label>二级类型：</label>
              <div class="commonBox">
                {{listData.typename}}
              </div>
            </div>
          </li>
          <li class="form-inner" v-if="isShowTX">
            <div class="formLeft">
              <label>报<i style="width: 28px;display: inline-block"></i>账： </label>
              <div class="commonBox">
                {{tXName}}
              </div>
            </div>
            <div class="formRight">
              <label>费用时间： </label>
              <div class="commonBox">
                {{listData.checkdatae|priceTime}}
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>支付对象： </label>
              <div class="commonBox">
                {{listData.playname}}
              </div>
            </div>
          </li>
          <li class="form-inner" style="height: auto;">
            <div class="formLeft" style="width: 100%;align-items: flex-start;">
              <label style="width: 17%;">说<i style="width: 28px;display: inline-block"></i>明： </label>
              <div class="commonBox" style="width: 100%;line-height: inherit;height: auto;">
                {{listData.Reamrk}}
              </div>
            </div>
          </li>
          <li class="form-inner " style="height: auto;">
            <div class="formLeft">
              <label style="margin-top: -50px;display: inline-block">图<i style="width: 28px;display: inline-block;"></i>片： </label>
              <div class="imgBox commonScrollStyle">
                <template v-for="(items,index) in listData.filsit">
                  <div class="innerImg" :style="{background:'url('+items.path+') no-repeat',  backgroundSize: 'cover'}">
                    <img :src="items.path" title="点击预览">
                  </div>
                </template>
                <span v-if="listData.filsit.length==0" style="margin-top: 12px;display: inline-block;">无</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
    },
    openEvent() {
      this.isShowLoading=true;
      this.tableRowObj = this.$parent.baoZhangObj.baoZhangRowObj;
    },
    openedEvent() {
      this.getBZNews();
    },
    /*获取父级类型*/
    getParentType(pid) {
      let url = '/xlapi/CameraManage/AmountManage/Amount/getapplytypelist';
      let data = {
        strpid: 0,
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            this.isShowLoading=false;
            res.data.forEach((item, index, arr) => {
              if (arr[index].id == pid) {
                this.FJtype = arr[index].name;
              }
            })
          }else {
            this.isShowLoading=false;
          }
        }
      })
    },
    //获取信息
    getBZNews() {
      let url = '/xlapi/CameraManage/AmountManage/Amount/getprojectmodel';
      let data = {
        strid: this.tableRowObj.id,
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            this.getParentType(res.data.pid);
            if (res.data.costType == 1) {
              this.tXName = '非摊销';
              this.isShowTX = true;
            } else if (res.data.costType == 2) {
              this.tXName = '摊销';
              this.isShowTX = true;
            } else if (res.data.costType == null) {
              this.isShowTX = false;
            }
            res.data.filsit.forEach((item,index,arr)=>{
              if(arr[index].path.substring(0,1)=='/'){
                arr[index].path=cosIp+arr[index].path.substr(1);
              }else {
                arr[index].path=cosIp+arr[index].path;
              }
            });
            this.listData = res.data;
          }
        }
      })
    },
  };
  export default {
    name: "priceOutDetailsDiaLog",
    props: ['baoZhangObj'],
    data() {
      return {
        isShowLoading: false,
        tableRowObj: {},
        listData: {
          filsit:[]
        },
        isShowTX: true,
        tXName: '',
        FJtype: '',
      };
    },
    methods: myMethods,
    created() {

    },
    filters: {
      priceTime(val) {
        if (val == null) {
          return '无'
        } else {
          return val.split('T')[0];
        }

      }
    },
    watch: {}
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  /*.content .form li:last-of-type {*/
  /*justify-content: flex-start;*/
  /*height: auto;*/
  /*}*/

  .content .form li:first-of-type {
    /*margin-top: 40px;*/
  }

  .content .form li:last-of-type label {
    /*margin-top: -75px;*/
  }

  >>> .priceOutDetailsDiaLog {
    width: 700px;
    height: 487px;
    padding: 0 50px 40px;
    margin-top: -90px !important;
  }

  >>> .priceOutDetailsDiaLog .closeIcon {
    right: 50px;
    top: 25px;
  }

  >>> .priceOutDetailsDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .priceOutDetailsDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .priceOutDetailsDiaLog .el-dialog__footer {
    bottom: 40px;
    position: absolute;
    right: 55px;
  }

  >>> .priceOutDetailsDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .priceOutDetailsDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  /*弹框内容样式*/
  .content ul li {
    text-align: left;
    margin: 20px 0;
    padding: 0 50px;
  }

  .formLeft, .formRight {
    display: flex;
    align-items: center;
  }

  .commonBox {
    display: inline-block;
    width: 170px;
    height: 32px;
    line-height: 32px;
  }
  .content {
    padding: 10px 0;
  }
  .content .form {
    max-height: 380px;
    overflow-y: auto;
  }
  .content .form li {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .imgBox {
    max-width: 420px;
    height: 90px;
    overflow-x: auto;
  }
  .innerImg {
    width: 126px;
    height: 80px;
    background: red;
    margin-right: 10px;
    display: inline-block;
    background-size: cover;
    position: relative;
  }

  .innerImg img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    opacity: 0;
    cursor: pointer;
  }
</style>
