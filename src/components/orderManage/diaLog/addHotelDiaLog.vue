<!--新增酒店-->
<template>
  <div id="addHotel">
    <el-dialog
      title="新增酒店"
      :visible.sync="showAddHotelDiaLog"
      custom-class="commonDiaLog addHotelDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--新增酒店-->
      <ul class="addNewHotelBox">
        <li>
          <label>城市：</label>
          <div class="commonBox">
            <inputSearch :listData="cityData" @inputFocus="getCityNews" ref="childInputSearch"
                         inputSearchPlaceholder="请选择城市"></inputSearch>
          </div>
        </li>
        <li>
          <label>酒店：</label>
          <div class="commonBox">
            <commonInput :isReadonly="false" ref="childCommonInput_name" inputPlaceholderText="请输入酒店名称"></commonInput>
          </div>
        </li>
        <li>
          <label>地址：</label>
          <div class="commonBox">
            <commonInput :isReadonly="false" ref="childCommonInput_address"
                         inputPlaceholderText="请输入酒店地址"></commonInput>
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
           <el-button type="primary" @click="confirmAddHotel('add')">确 定</el-button>
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
      this.$parent.closeDialog('addHotel', resObj);
    },
    //清除文本框的文本
    clearFormText() {
      this.$refs.childInputSearch.inputValue = '';
      this.$refs.childCommonInput_address.inputValue = '';
      this.$refs.childTextArea.textAreaText = '';
    },
    //确认新增酒店
    confirmAddHotel(type) {
      let inputSearchValue = this.$refs.childInputSearch.isSelectedItemObj;//获取选择的城市Id
      let inputValue1 = this.$refs.childCommonInput_name.inputValue;//获取添加的名字
      let inputValue2 = this.$refs.childCommonInput_address.inputValue;//获取添加的地址
      let textAreaText = this.$refs.childTextArea.textAreaText;//获取添加说明
      // console.log(inputSearchValue)
      // return
      if (inputSearchValue.length == 0) {
        this.$message({
          message: '请选择城市',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      } else if (inputValue1 == '') {
        this.$message({
          message: '酒店名称不能为空！',
          customClass: 'msgTips',
          type: 'error'
        });
        return false;
      }
      let data;
      if (type == 'add') {
        data = {
          HotelName: inputValue1,
          CityId: inputSearchValue[0].id,
          HotelAddress: inputValue2,
          Remark: textAreaText,
          Type: type,
        };
      } else {
        data = {
          HotelName: inputValue1,
          CityId: inputSearchValue[0].id,
          HotelAddress: inputValue2,
          Remark: textAreaText,
          Type: type,
          HotelId: '',
        };
      }
      this.addHotelRequest(data);
    },
    //增加酒店请求
    addHotelRequest(data) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/AddCameraHotelInfo';
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status == true) {
            // console.log(res)
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
              type: 'success'
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
    openedEvent() {
      this.$refs.childInputSearch.isShowList = false;
      this.$refs.childCommonInput_name.inputValue = this.$parent.hotelInputText;
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
    name: "addHotelDiaLog",
    props: ['showAddHotelDiaLog'],
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
