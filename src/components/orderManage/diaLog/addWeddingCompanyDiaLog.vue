<!--新增婚庆公司-->
<template>
  <div id="addWeddingCompanyDiaLog">
    <el-dialog
      title="新增婚庆"
      :visible.sync="showAddWeddingCompanyDiaLog"
      custom-class="commonDiaLog addHotelDiaLog"
      :modal="false"
      @open="openEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--新增婚庆-->
      <ul class="addNewHotelBox">
        <li>
          <label>城市：</label>
          <div class="commonBox">
            <inputSearch :listData="cityData" @inputFocus="getCityNews" ref="childInputSearch"
                         inputSearchPlaceholder="请选择城市"></inputSearch>
          </div>
        </li>
        <li>
          <label>婚庆：</label>
          <div class="commonBox">
            <commonInput :isReadonly="false" ref="childCommonInput_name" inputPlaceholderText="请输入婚庆公司名称"></commonInput>
          </div>
        </li>
        <li>
          <label>地址：</label>
          <div class="commonBox">
            <commonInput :isReadonly="false" ref="childCommonInput_address"
                         inputPlaceholderText="请输入婚庆公司地址"></commonInput>
          </div>
        </li>
        <li class="addHotelTextAreaBox">
          <label>说明：</label>
          <div class="textArea">
            <textArea ref="childTextArea" textAreaPlaceholderText="请输入酒店说明..."></textArea>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
           <el-button @click="close">取 消</el-button>
           <el-button type="primary" @click="confirmAddHotel('add')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    /*城市数据*/
    cityData: []
  };
  /*方法*/
  let myMethods = {
    close(resObj) {
      this.$parent.closeDialog('addHQ',resObj);
    },

    //清除文本框的文本
    clearFormText() {
      this.$refs.childInputSearch.inputValue = '';
      this.$refs.childCommonInput_address.inputValue = '';
      this.$refs.childTextArea.textAreaText = '';
      this.$refs.childCommonInput_name.inputValue = this.$parent.HQInputText;
    },
    //确认新增婚庆公司
    confirmAddHotel(type) {
      let inputSearchValue = this.$refs.childInputSearch.isSelectedItemObj;//获取选择的城市Id
      let inputValue1 = this.$refs.childCommonInput_name.inputValue;//获取添加的名字
      let inputValue2 = this.$refs.childCommonInput_address.inputValue;//获取添加的地址
      let textAreaText = this.$refs.childTextArea.textAreaText;//获取添加说明
      if (inputSearchValue.length == 0) {
        this.$message({
          message: '请选择城市',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      } else if (inputValue1 == '') {
        this.$message({
          message: '婚庆公司不能为空！',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      }
      let data;
      if (type == 'add') {
        data = {
          WeedingName: inputValue1,
          CityId: inputSearchValue[0].id,
          WeedingAddress: inputValue2,
          Remark: textAreaText,
          Type: type,
        };
      } else {
        data = {
          WeedingName: inputValue1,
          CityId: inputSearchValue[0].id,
          WeedingAddress: inputValue2,
          Remark: textAreaText,
          Type: type,
          HotelId: '',
        };
      }
      this.addHotelRequest(data);
    },
    //增加婚庆请求
    addHotelRequest(data) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/AddCameraWeedingInfo';
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status == true) {
            this.$message({
              message: '添加成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.close(res.data.data);
          } else {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    //打开回调
    openEvent() {
      this.cityData = [];
      setTimeout(() => {
        this.clearFormText();
      })
    },

    //获取城市信息
    getCityNews(obj) {
      if (obj.type == 'inputFocus') {
        let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCityList';
        this.$Axios({
          method: 'POST',
          url: url,
          success(res) {
            if (res.status == 200) {

              let newRes = res.data.data.map((item) => {
                return {
                  name: item.CityName,
                  id: item.CityId
                }
              });
              this.filterCity(newRes, obj.val);
            }
          },
          error(err) {

          }
        })
      } else if (obj.type == 'searchText') {
        this.filterCity(this.cityData, obj.val)
      }
    },
    //搜索筛选
    filterCity(data, searchVal) {
      let filterData = data.filter(item => {
        if (item.name.indexOf(searchVal) != -1) {
          return item;
        }
      });
      this.cityData = filterData;
    }
  };
  export default {
    name: "addWeddingCompanyDiaLog",
    props: ['showAddWeddingCompanyDiaLog'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
    },
    mounted() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .addHotelDiaLog .closeIcon {
    right: 40px;
    top: 28px;
  }

  /*新增酒店弹框样式*/
  .commonBox {
    display: inline-block;
    width: 200px;
    height: 32px;
  }

  >>> .addHotelDiaLog {
    padding: 0 40px 40px;
    width: 540px;
    height: 470px;
  }

  >>> .addHotelDiaLog .el-dialog__header {
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .addHotelDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .addHotelDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  >>> .addHotelDiaLog .el-dialog__footer button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    color: #FFF;
    padding: 0;
  }

  >>> .addHotelDiaLog .el-dialog__footer button:first-of-type {
    background: transparent;
    border: 0;
    color: #808080;
  }

  ul.addNewHotelBox {
    padding-top: 25px;
  }

  .addNewHotelBox li {
    text-align: left;
    margin: 15px 0;
  }

  .addHotelTextAreaBox label {
    vertical-align: top;
    margin-top: 9px;
    display: inline-block;
  }

  .addHotelTextAreaBox .textArea {
    display: inline-block;
    width: 370px;
    height: 102px;
  }
</style>
