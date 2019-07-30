<!--订单中---设备详情弹框-->
<template>
  <div id="sheBeiDetailsDiaLog">
    <el-dialog
      title="查看设备详情"
      :visible.sync="showSheBeiDetailsDiaLog"
      custom-class="commonDiaLog sheBeiDetailsDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="closeDialog"></i>
      <div class="content" v-loading="isShowLoading">
        <ul class="form">
          <li class="form-inner">
            <div class="formLeft">
              <label>设备类型：</label>
              <div class="commonBox">
                <dropSelect1 :isReadonly="false" :options="typeOptions" ref="dropSelectChild_type"
                             dropSelect1Placeholder="设备类型"></dropSelect1>
              </div>
            </div>
            <div class="formRight">
              <label>设备编号：</label>
              <div class="commonBox">
                <commonInput :isReadonly="true" ref="childCommonInput_no" inputPlaceholderText="设备编号"></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>设备名称：</label>
              <div class="commonBox">
                <commonInput :isReadonly="true" ref="childCommonInput_name" inputPlaceholderText="设备名称 "></commonInput>
              </div>
            </div>
            <div class="formRight">
              <label>购买日期：</label>
              <div class="commonBox">
                <commonInput :isReadonly="true" ref="childCommonInput_time" inputPlaceholderText="购买日期 "></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>使用价格：</label>
              <div class="commonBox">
                <commonInput :isReadonly="true" ref="childCommonInput_price" inputPlaceholderText="使用价格"></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner" :class="{showImg:imgArr.length>0}">
            <div class="formLeft">
              <label>图 <i style="display: inline-block;width: 25px;"></i>片：</label>
              <div class="commonBox">
                <div class="imgBox commonScrollStyle" v-if="imgArr.length>0">
                  <template v-for="(items,index) in imgArr">
                    <div class="img" title="点开查大图">
                      <img :src="items.filepath" preview="0">
                    </div>
                  </template>
                </div>
                <span v-if="imgArr.length==0" style="position: absolute;top: 50%;left: 16px;transform: translateY(-50%);">无</span>
              </div>
            </div>
          </li>
          <li class="form-inner textAreaLi addNewOrderNextTextAreaLi">
            <label>说<i style="display: inline-block;width: 29px;"></i>明：</label>
            <div class="textAreaBox">
              <textArea :isReadonly="true" ref="childtextArea" textAreaPlaceholderText="请输入客户要求..."></textArea>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    /*类型数据*/
    typeOptions: [],
    /*详情*/
    detailsRowObj: {},
    /*图片集合*/
    imgArr: [],
    isShowLoading:false,
  };
  /*方法*/
  let myMethods = {
    closeDialog() {
      this.$parent.showSheBeiDetailsDiaLog = false;
    },
    /*打开时*/
    openEvent() {
      this.detailsRowObj = this.$parent.keepRowObj;//保存父级的
      this.isShowLoading=true;
    },
    /*打开后*/
    openedEvent() {
      this.getMenuList1();
      this.getRowNews();
      this.getImg();
    },
    /*获取左边列表最外层数据*/
    getMenuList1() {
      this.typeOptions=[];
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/GetEquiBaseList';
      this.$Axios({
        method: 'GET',
        url: url,
        success(res) {
          // console.log(res);
          if (res.status == 200) {
            res.data.forEach((item, index, arr) => {
              this.getMenuList2(arr[index],'');
            });
            this.menuList1 = res.data;
          }
        }
      })
    },
    /*获取左边列表里层数据*/
    getMenuList2(itemObj,searchText) {
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/EquiTypeList';
      let data = {
        baseid: itemObj.id,
        like: searchText
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            res.data.forEach((item,index,arr)=>{
              arr[index].label=arr[index].name;
              arr[index].value=arr[index].id;
            });
            let concatArr=this.typeOptions.concat(res.data)
            this.typeOptions=concatArr;
          }
        }
      })
    },
    //获取详情
    getRowNews() {
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/GetEquiInfo';
      let data = {
        id: this.detailsRowObj.Equid
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            this.setDefaultData(res.data);
          }
        }
      })
    },
    //获取图片
    getImg() {
      let url = '/xlapi/CameraManage/EquiManage/EquiBase/GetEquiImgs';
      let data = {
        eid: this.detailsRowObj.Equid
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            res.data.forEach((item, index, arr) => {
              arr[index].filepath = cosIp + arr[index].filepath;
            });
            this.imgArr = res.data;
            this.isShowLoading=false;
          }
        }
      })
    },

    //设置查看默认值
    setDefaultData(obj) {
      this.$refs.childCommonInput_no.inputValue = obj.code;
      this.$refs.childCommonInput_name.inputValue = obj.name;
      this.$refs.childCommonInput_time.inputValue = obj.buytime.split('T')[0];
      this.$refs.childCommonInput_price.inputValue = obj.useprice;
      this.$refs.childtextArea.textAreaText = obj.remark;
      this.$refs.dropSelectChild_type.dropSelectValue = obj.equitype;
    }
  };
  export default {
    name: "sheBeiDetailsDiaLog",
    props: ['showSheBeiDetailsDiaLog', 'showType'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {

    },

  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .sheBeiDetailsDiaLog {
    width: 720px;
    height: 580px;
    padding: 0 50px 40px;
  }

  label {
    color: #B2B2B2;
  }

  >>> .sheBeiDetailsDiaLog .closeIcon {
    right: 50px;
    top: 25px;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__body {
    padding: 0 30px;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__footer {
    bottom: 40px;
    position: absolute;
    right: 55px;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .sheBeiDetailsDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  /*弹框内容样式*/
  .content .form li {
    height: 32px;
    display: flex;
    margin-top: 25px;
    justify-content: space-between;
    align-items: center;
  }

  .content .form li.showImg {
    height: 90px;
  }

  .content .form li.showImg .commonBox {
    height: auto;
    width: 485px;
  }

  .content .form li.showImg label {
    margin-top: -70px;
  }

  .content .form li:last-of-type {
    justify-content: flex-start;
    height: auto;
  }

  .content .form li:first-of-type {
    margin-top: 40px;
  }

  .content .form li:last-of-type label {
    margin-top: -60px;
  }

  .formLeft, .formRight {
    display: flex;
    align-items: center;
  }

  .commonBox {
    display: inline-block;
    width: 170px;
    height: 32px;
    position: relative;
  }

  .textAreaBox {
    width: 85%;
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

  .imgBox {
    width: auto;
    height: 98px;
    overflow-x: auto;
    white-space: nowrap;
    text-align: left;
    padding: 0 10px;
  }

  .imgBox .img {
    display: inline-block;
    height: 90px;
    max-width: 126px;
    margin-right: 20px;
    background-size: cover!important;
    cursor: pointer;
  }
  .imgBox .img img  {
    max-height: 90px;
    max-width: 126px;
  }

  >>> .sheBeiDetailsDiaLog .el-input.is-disabled .el-input__inner {
    border: 0;
    color: #4c4c4c;
  }

  >>> .sheBeiDetailsDiaLog .el-input__suffix {
    display: none;
  }

  >>> .sheBeiDetailsDiaLog .el-input__inner {
    border: 0;
  }

  >>> .sheBeiDetailsDiaLog .textArea {
    border: 0;
  }

  >>> .sheBeiDetailsDiaLog .el-input__inner:focus {
    border: 0;
  }

</style>
