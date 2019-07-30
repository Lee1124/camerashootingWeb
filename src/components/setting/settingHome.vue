<template>
  <div class="setting-content">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-demo noSelect noBorder"
      mode="horizontal"
      :router="true"
      text-color="#1D213E"
      active-text-color="#5996F8"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="auto of userAuthList"
        :key="auto.ChildPermissionId"
        :index="auto.path"
      >{{auto.ChildPermissionName}}</el-menu-item>
      <!-- <el-menu-item index="personal">个人中心</el-menu-item>
      <el-menu-item index="user">用户管理</el-menu-item>
      <el-menu-item index="hotel">酒店管理</el-menu-item>
      <el-menu-item index="wedding">婚庆管理</el-menu-item>
      <el-menu-item index="project">项目管理</el-menu-item>
      <el-menu-item index="depart">部门设置</el-menu-item>
      <el-menu-item index="post">岗位设置</el-menu-item>
      <el-menu-item index="check">考核设置</el-menu-item>
      <el-menu-item index="other">其他参数</el-menu-item>-->
    </el-menu>
    <router-view class="setting-router"></router-view>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      activeItem: "personal",
      defaultActive: "personal",
      authList: [],
      userAuthList: []
    };
  },
  created() {
    this.defaultActive = this.$route.path.split("/")[2];
    this.getBranchPermission();
  },
  watch: {
    $route(to, from) {
      console.log(1111111111);
      //this.getBranchPermission();
      this.defaultActive = this.$route.path.split("/")[2];
      this.activeItem = this.defaultActive;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeItem = keyPath;
    },
    /**
     * 获取当前店铺的权限列表
     */
    getBranchPermission() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchPermission`,
        data: { BranchId: getkevalue().branchid },
        success(res) {
          if (res.data.status) {
            //筛选设置模块权限
            this.authList = res.data.data.find(
              auto => auto.ParentPermissionId == 4
            ).ChildPermissionModelList;
            //添加相应菜单的路由
            this.authList.forEach(menu => {
              switch (menu.ChildPermissionId) {
                case 17:
                  menu.path = "personal";
                  break; //个人中心
                case 18:
                  menu.path = "user";
                  break; //用户管理
                case 19:
                  menu.path = "hotel";
                  break; //酒店管理
                case 20:
                  menu.path = "wedding";
                  break; //婚庆管理
                case 1030:
                  menu.path = "project";
                  break; //项目管理
                case 1031:
                  menu.path = "depart";
                  break; //部门设置
                case 1032:
                  menu.path = "post";
                  break; //岗位设置
                case 1033:
                  menu.path = "check";
                  break; //考核设置
                case 1034:
                  menu.path = "other";
                  break; //其他参数
                case 1035:
                  menu.path = "company";
                  break; //公司信息设置
              }
            });
            this.getBranchUserPermission();
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    },

    /**
     * 查询用户权限菜单信息
     */
    getBranchUserPermission() {
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchUserPermission`,
        data: {
          BranchId: getkevalue().branchid,
          SearchUserId: getkevalue().userid
        },
        success(res) {
          if (res.data.status) {
            that.checkList = [];
            that.userAuthList = res.data.data;
            if (res.data.data && res.data.data.length > 0) {
              res.data.data.forEach(auth => {
                that.checkList.push(auth.MenuId);
              });
              this.getUserAuto();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
    },
    /**
     * 筛选当前用户拥有的权限
     */
    getUserAuto() {
      let that = this;
      let menuList = this.authList.filter(auth =>
        this.checkList.find(ua => ua == auth.ChildPermissionId)
      );
      this.userAuthList = menuList;
    }
  }
};
</script>

<style scoped>
.setting-content {
  width: 100%;
  height: 100%;
  background: #fff;
}

.setting-router {
  width: 100%;
  height: 84%;
}
.noBorder {
  border: none !important;
}
.setting-content .el-menu-item {
  padding: 0px;
  margin: 0 2%;
}

/*设置页面弹窗居中*/
.setting-content .el-dialog__wrapper {
  position: absolute !important;
}
</style>
