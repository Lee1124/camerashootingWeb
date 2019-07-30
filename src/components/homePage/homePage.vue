<template>
  <div id="homePage">
    <el-container>
      <el-aside width="14.2%" class="commonScrollStyle">
        <sideNav></sideNav>
      </el-aside>
      <el-container>
        <el-header>
          <div class="hdContent">
            <div class="user">
              <i class="icon"></i>
              <p v-text="userObj.RealName"></p>
            </div>
            <span class="line">|</span>
            <div class="signOut" @click="signOut">
              <i class="icon"></i>
              <p>退出</p>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view ref="routerView"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import sideNav from '../common/sideNav/sideNav'
  /*方法*/
  let myMethods = {
    /*退出系统*/
    signOut() {
      sessionStorage.removeItem('userInfo');
      // this.$closeWebSocket();//关闭websocket
      this.$router.push({path: '/login'});
    },
    /*获取用户信息*/
    getUserNews() {
      let url = '/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetMyUserInfoDetail';
      let data = {
        UserId: getkevalue().userid
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.userObj = res.data.data;
            this.$store.commit('keepBranchLog', cosIp + res.data.branchLog);
          }
        }
      })
    }
  };
  export default {
    name: "homePage",
    data() {
      return {
        userObj: {}
      };
    },
    methods: myMethods,
    created() {
      this.$store.commit('keepIsShowOrderDetailsPage',false);
      this.$store.commit('keepShowOrderDetailsDiaLog',false);
      document.title = '管理中心';
      this.$nextTick(() => {
        if (this.$route.query.no == 1&&this.$route.query.reload==undefined) {
          this.$router.push({path: '/homePage/Calender?no=1&&reload=true'})
        }
      })
    },
    mounted() {
      this.getUserNews();
      if (this.$route.query.no == 1&&this.$route.query.reload==undefined) {
        this.$router.push({path: '/homePage/Calender?no=1&&reload=true'})
      }
    },
    components: {
      sideNav: sideNav
    },
    watch: {
      $route(to) {
        if (this.$route.query.no == 1&&this.$route.query.reload==undefined) {
          this.$router.push({path: '/homePage/Calender?no=1&&reload=true'})
          this.$store.commit('keepIsShowOrderDetailsPage',false);
          this.$store.commit('keepShowOrderDetailsDiaLog',false);
        }
      }
    }
  }
</script>

<style scoped>
  #homePage {
    height: 100%;
  }

  >>> .el-header {
    height: 8.5% !important;

  }

  .el-header {
    background-color: #F6F6F6;
    color: #333;
    text-align: center;
    /*line-height: 8.5%;*/
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    min-height: 55px;
    z-index: 2999;
    position: relative;
  }



  .el-aside {
    background-color: #1D213E;
    color: #fff;
    text-align: center;
    min-width: 200px;
  }

  .el-main {
    background-color: #F6F6F6;
    color: #333;
    text-align: center;
    /*padding: 3.5% 7%;*/
    padding: 0;
    position: relative;
    overflow: hidden;
    /*min-width: 1150px;*/
    height: 100%;
  }

  >>> .el-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }



  .hdContent {
    display: flex;
    align-items: center;
    position: absolute;
    right: 90px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .hdContent .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  .hdContent .user .icon {
    background: url("../../../static/img/common/userIcon.png") no-repeat center center;
  }

  .hdContent .signOut .icon {
    background: url("../../../static/img/common/signOut.png") no-repeat center center;
  }

  .hdContent .user,
  .hdContent .signOut {
    display: inline-block;
    cursor: pointer;
  }

  .hdContent p {
    color: #82868F;
    font-size: 14px;
  }

  .hdContent .line {
    margin: 0 25px;
    color: #C2C5CB;
  }

</style>
