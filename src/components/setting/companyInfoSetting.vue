<template>
  <div class="company-content commonScrollStyle">
    <div class="company-info">
      <span class="info-title">公司基本设置</span>
      <div class="info-main">
        <div class="info-logo">
          <div class="img-box">
            <img :src="cosIp+companyInfo.BranchLogoUrl" />
          </div>
          <input
            type="file"
            id="file"
            accept="image/*"
            style="opacity: 0;width: 0;height: 0;position: absolute;"
            @change="AppendPicture"
          />
          <span @click="changeIcon">更换LOGO</span>
        </div>
        <div class="info-text">
          <span class="company-name">{{companyInfo.BranchName}}</span>
          <div>
            <span class="span-title">当前套餐：</span>
            <span class="span-info">{{companyInfo.BranchPeopleCount}}人套餐</span>
          </div>
          <div>
            <span class="span-title">套餐到期：</span>
            <span class="span-info">{{companyInfo.BranchExpireDate}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="company-save">
      <div class="save-top">
        <span class="info-title">系统存储设置</span>
        <div class="div-edit" @click="showEditCompanyDig">
          <div></div>
          <span class="span-edit">编辑</span>
        </div>
      </div>
      <div class="save-main">
        <div>
          <span class="span-title">区域：</span>
          <span class="span-info">{{companyInfo.Region}}</span>
        </div>
        <div>
          <span class="span-title">AppID：</span>
          <span class="span-info">{{companyInfo.AppId}}</span>
        </div>
        <div>
          <span class="span-title">存储桶：</span>
          <span class="span-info">{{companyInfo.Bucket}}</span>
        </div>
        <div>
          <span class="span-title">腾讯云ID：</span>
          <span class="span-info">{{companyInfo.SecretId}}</span>
        </div>
        <div>
          <span class="span-title">腾讯云密钥：</span>
          <span class="span-info">{{companyInfo.SecretKey}}</span>
        </div>
        <div>
          <span class="span-title">腾讯云CDN加速地址：</span>
          <span class="span-info">{{companyInfo.BranchCosCdnUrl}}</span>
        </div>
      </div>
    </div>
    <div class="company-recharge">
      <div class="recharge-top">
        <span class="info-title">充值记录</span>
        <div class="div-add" @click="showAddDig=true">
          <div></div>
          <span class="span-add">新增</span>
        </div>
      </div>
      <div class="table-div" ref="tableBox" v-loading="devIsLodding">
        <noData msg="暂无数据" v-if="rechargeList.length==0"></noData>
        <el-table
          :data="rechargeList"
          stripe
          border
          :max-height="tableHeight"
          header-row-class-name="depart-header"
          row-class-name="depart-row"
          class="commonScrollStyle"
        >
          <el-table-column type="index" label="序号" width="135"></el-table-column>
          <el-table-column prop="PostName" label="时间" min-width="22.5">
            <template slot-scope="scope">
              <span>2019.01.02</span>
            </template>
          </el-table-column>
          <el-table-column prop="LeaderUserName" label="金额" min-width="20.0">200.00</el-table-column>
          <el-table-column prop="DefaultUserIds" label="账号" min-width="23.5">大连银行</el-table-column>
          <el-table-column prop="DefaultUserIds" label="状态" min-width="13.5">
            <template slot-scope="scope">
              <span class="state-span">待确认</span>
              <!--已退回 已确认 橙色-->
            </template>
          </el-table-column>
          <el-table-column prop="DefaultUserIds" label="操作人" min-width="14.5">巫鉴达</el-table-column>
        </el-table>
      </div>
    </div>
    <!--系统储存编辑弹窗-->
    <editSaveDig :showEditDig="showEditDig" :curInfo="curInfo" @closeEditDig="showEditDig=false"></editSaveDig>
    <!--新增充值记录弹窗-->
    <addRechargeDig :showAddDig="showAddDig" @closeAddDeviceDig="showAddDig=false"></addRechargeDig>
  </div>
</template>
<script>
import editSaveDig from "./components/editSaveDig"; //系统储存编辑弹窗
import addRechargeDig from "./components/addRechargeDig"; //新增充值记录弹窗

export default {
  components: { editSaveDig, addRechargeDig },
  data() {
    return {
      tableHeight: "140",
      rechargeList: [],
      devIsLodding: false,
      showEditDig: false,
      showAddDig: false,
      cosIp: cosIp,
      companyInfo: {}, //公司信息
      curInfo: {} //修改的公司信息
    };
  },
  created() {
    this.getNowBranchInfo();
    this.loadResize();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDomHeight();
      }, 1);
    });
  },
  methods: {
    loadResize() {
      let that = this;
      $(window).resize(() => {
        that.getDomHeight();
      });
    },
    /**
     * 模拟点击事件
     */
    changeIcon() {
      $("#file").trigger("click");
    },
    //上传图片获得图像的url地址(二进制源码)
    AppendPicture() {
      let imgArr = [];
      var imgNum = document.getElementById("file").files.length; //图片数量
      for (var i = 0; i < imgNum; i++) {
        var imgNews = document.getElementById("file").files[i];
        imgArr.push(imgNews);
      }
      if (imgNum > 0) {
        //上传
        this.$UpImgFile({
          file: imgArr,
          ys: 1,
          path: `${getkevalue().branchid}/Camera/ComPanyLogo`,
          callback: (that, res) => {
            this.companyInfo.BranchLogoUrl = that.key.substring(1);
            this.$store.commit("keepBranchLog", cosIp + that.key.substring(1));
            this.updateBranchLogo();
          }
        });
      }
    },
    //获取元素高度
    getDomHeight() {
      let tableBoxHeight = $(this.$refs.tableBox).height();
      if (tableBoxHeight) {
        this.tableHeight = tableBoxHeight;
      }
    },
    /**
     * 显示编辑弹窗
     */
    showEditCompanyDig() {
      this.curInfo = clone(this.companyInfo);
      this.showEditDig = true;
    },
    /**
     * 获取店铺信息
     */
    getNowBranchInfo() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraBranchManage/CameraBranch/GetNowBranchInfo`,
        data: {},
        success(res) {
          if (res.data.status) {
            this.companyInfo = res.data.data;
            this.companyInfo.BranchExpireDate = getFormatTime(
              res.data.data.BranchExpireDate,
              "."
            );
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**
     * 修改店铺logo
     */
    updateBranchLogo() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraBranchManage/CameraBranch/UpdateBranchLogo`,
        data: { BranchLogoUrl: this.companyInfo.BranchLogoUrl },
        success(res) {
          if (res.data.status) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
@import "../../../static/css/orderTableStyle.css";
.company-content {
  width: 100%;
  height: 92.7%;
  max-height: 92.7%;
  overflow-y: auto;
  background: #fff;
}
.company-info {
  width: 100%;
  height: 300px;
  text-align: left;
}
.info-title {
  font-size: 15px;
  margin-left: 48px;
  font-weight: bold;
  height: 105px;
  align-items: center;
  display: flex;
  color: #222222;
}
.info-main {
  width: 100%;
  /* height: 210px; */
  display: flex;
  align-items: center;
}
.info-logo {
  width: 115px;
  margin-left: 124px;
  text-align: center;
}
.img-box {
  width: 115px;
  height: 115px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-logo img {
  max-width: 115px;
  max-height: 115px;
}
.info-logo span {
  width: 100%;
  font-weight: 400;
  line-height: 42px;
  text-decoration: underline;
  font-size: 14px;
  color: #5996f8;
  cursor: pointer;
  display: inline-block;
}
.info-text {
  margin-left: 60px;
}
.company-name {
  font-size: 34px;
  font-family: MicrosoftYaHei;
  line-height: 60px;
  margin-bottom: 17px;
  display: inline-block;
  font-weight: bold;
  color: #333333;
}
.state-span {
  color: red;
}
.span-title {
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  font-family: MicrosoftYaHei;
  color: #bbbbbb;
}
.span-info {
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  font-family: MicrosoftYaHei;
  color: #4c4c4c;
}
.company-save {
  width: 100%;
  background: #f9f9f9;
}
.save-top,
.recharge-top {
  text-align: left;
  display: flex;
  align-items: center;
  height: 80px;
}
.div-edit,
.div-add {
  display: inline-block;
  cursor: pointer;
}
.div-add {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.div-edit div {
  width: 14px;
  height: 14px;
  margin-left: 20px;
  display: inline-block;
  background: url("../../../static/img/setting/edit.png") no-repeat center
    center;
}
.div-edit:hover div {
  background: url("../../../static/img/setting/edit1.png") no-repeat center
    center !important;
}
.div-add div {
  width: 17px;
  height: 17px;
  margin-left: 20px;
  display: inline-block;
  background: url("../../../static/img/order/add0.png") no-repeat center center;
}
.div-add:hover div {
  background: url("../../../static/img/order/add1.png") no-repeat center center !important;
}
.div-edit:hover span,
.div-add:hover span {
  color: #5996f8;
}
.span-edit,
.span-add {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  margin-left: 5px;
  color: #999999;
}
.save-main {
  text-align: left;
  padding-left: 123px;
  padding-bottom: 20px;
}
.company-recharge {
  width: 100%;
  height: 250px;
}
.table-div {
  width: 65.2%;
  height: 58%;
  margin-left: 115px;
  position: relative;
}
>>> .depart-header {
  height: 34px;
  background: #bbbbbb !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
>>> .depart-header th {
  background: #bbbbbb !important;
  text-align: center;
  padding: 0px;
}

>>> .depart-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  padding: 0px;
}
>>> .depart-row .cell {
  line-height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*设置页面弹窗居中*/
.company-content .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>
