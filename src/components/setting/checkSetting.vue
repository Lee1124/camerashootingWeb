<template>
  <div class="check-main">
    <div class="div-row row-odd" v-if="false">
      <span>1. 安排销售人员：</span>
      <div class="person-item">
        <span class="person-span">李某某</span>
        <img class="person-delete" src="static\img\order\smallClose.png" />
      </div>
      <div class="add-img"></div>
    </div>
    <div class="div-row" v-if="false">
      <span>2. 安排拍摄人员：</span>
      <div class="person-list commonScrollStyle">
        <div class="person-item" v-for="(person,index) in personList">
          <span class="person-span">李某某</span>
          <img class="person-delete" src="static\img\order\smallClose.png" />
        </div>
        <div class="add-img"></div>
      </div>
    </div>
    <div class="div-row row-odd" v-if="false">
      <span>3. 安排后台人员：</span>
      <div class="person-item">
        <span class="person-span">李某某</span>
        <img class="person-delete" src="static\img\order\smallClose.png" />
      </div>
      <div class="add-img"></div>
    </div>
    <div class="div-row">
      1. 订单拍摄完成
      <input class="days-input" v-model="tjzpshts" @blur="updateOtherLabelList('tjzpshts')" />
      天内提交作品审核
    </div>
    <div class="div-row row-odd">
      2. 订单拍摄完成
      <input class="days-input" v-model="tjpshk" @blur="updateOtherLabelList('tjpshk')" />天内提交拍摄回馈
    </div>
    <div class="div-row">
      3. 订单拍摄完成
      <input class="days-input" v-model="yjkhzl" @blur="updateOtherLabelList('yjkhzl')" />天内移交客户资料
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tjzpshtsed: 0,
      yjkhzled: 0,
      tjpshked: 0,
      tjzpshts: 0,
      yjkhzl: 0,
      tjpshk: 0,
      personList: ["", "", "", "", "", ""]
    };
  },
  mounted() {
    this.getOtherLabelList();
  },
  methods: {
    /**
     * 获取参数数据
     */
    getOtherLabelList() {
      this.$Axios({
        method: "POST",
        url:
          "/xlapi/CameraManage/CameraOrderInfoManage/CameraOtherLabelInfo/GetOtherLabelList",
        success(res) {
          if (res.status == 200 && res.data.status) {
            let data = res.data.data;
            console.log("111", data.find(spect => spect.Inspect == "tjzpshts"));
            if (data.find(spect => spect.Inspect == "tjzpshts"))
              this.tjzpshts = data.find(
                spect => spect.Inspect == "tjzpshts"
              ).Value;
            if (data.find(spect => spect.Inspect == "yjkhzl"))
              this.yjkhzl = data.find(spect => spect.Inspect == "yjkhzl").Value;
            if (data.find(spect => spect.Inspect == "tjpshk"))
              this.tjpshk = data.find(spect => spect.Inspect == "tjpshk").Value;
          } else {
            this.$message.error("获取考核数据失败");
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    },
    /**
     * 新增或者编辑其他label参数
     */
    updateOtherLabelList(type) {
      let Value = 0;
      switch (type) {
        case "tjzpshts":
          Value = this.tjzpshts;
          break;
        case "yjkhzl":
          Value = this.yjkhzl;
          break;
        case "tjpshk":
          Value = this.tjpshk;
          break;
      }
      this.$Axios({
        method: "POST",
        data: {
          Inspect: type,
          Value: Value
        },
        url:
          "/xlapi/CameraManage/CameraOrderInfoManage/CameraOtherLabelInfo/UpdateOtherLabelList",
        success(res) {
          if (res.status == 200 && res.data.status) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getOtherLabelList();
          } else {
            this.$message.error("修改考核数据失败");
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    }
  }
};
</script>

<style scoped>
.check-main {
  margin: 35px 0 10px 48px;
}
.div-row {
  width: 818px;
  height: 54px;
  display: flex;
  align-items: center;
  background: #f6f6f6;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  padding-left: 19px;
  color: #4c4c4c;
}
.row-odd {
  background: #fff;
}
.person-list {
  max-width: 675px;
  overflow-x: auto;
  white-space: nowrap;
}
.person-span {
  display: inline-block;
  text-align: center;
}
.person-item {
  display: inline-block;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
}
.person-item:hover .person-delete {
  visibility: visible;
}
.person-delete {
  position: relative;
  top: -8px;
  right: 14px;
  visibility: hidden;
}
.add-img {
  width: 17px;
  height: 17px;
  cursor: pointer;
  display: inline-block;
  background: url("../../../static/img/order/add0.png") no-repeat center center;
}
.add-img:hover {
  background: url("../../../static/img/order/add1.png") no-repeat center center !important;
}

.days-input {
  width: 74px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 5px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  background: transparent;
  border: none;
  border-bottom: 1px #cccccc solid;
}
</style>
