<template>
  <div class="device-main">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-demo noSelect noBorder"
      mode="horizontal"
      :router="true"
      text-color="#1D213E"
      active-text-color="#5996F8"
    >
      <el-menu-item index="device">设备</el-menu-item>
      <el-menu-item
        v-for="auto of menuList"
        :key="auto.ChildPermissionId"
        :index="auto.path"
      >{{auto.ChildPermissionName}}</el-menu-item>
      <!-- <el-menu-item index="outgoing">出库列表</el-menu-item>
      <el-menu-item index="maintain">报损维护</el-menu-item>
      <el-menu-item index="statistical">统计分析</el-menu-item>-->
    </el-menu>
    <router-view class="device-router"></router-view>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menuList: [],
      defaultActive: "device",
      activeItem: "device"
    };
  },
  methods: {},
  created() {
    this.defaultActive = this.$route.path.split("/")[2];
  },
  mounted() {
    console.log(11111);
    this.$getUserAuto().then(res => {
      this.menuList = res.find(
        pMenu => pMenu.ParentPermissionId == 2
      ).ChildPermissionModelList;
      console.log("111", this.menuList);
    });
  },
  watch: {
    $route(to, from) {
       console.log(222);
      this.defaultActive = this.$route.path.split("/")[2];
      this.activeItem = this.defaultActive;
    }
  }
};
</script>

<style scoped>
.device-main {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
.noBorder {
  border: none !important;
}
.device-main .el-menu-demo {
  padding: 1% 0 2.3% 0;
}
.device-main .el-menu-item {
  padding: 0px;
  margin: 0 3%;
}
.device-router {
  width: 100%;
  height: 84%;
}
</style>
