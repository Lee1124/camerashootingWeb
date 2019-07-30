<template>
  <div id="login">
    <div class="loginForm">
      <form>
        <ul>
          <li>
            <el-input v-model="userName" placeholder="请输入您的账户"></el-input>
            <span class="userName noSelect">
              <img v-show="!focusInput1" src="../../../static/img/user_2.png"/>
              <img v-show="focusInput1" src="../../../static/img/user_1.png"/>
            </span>
          </li>
          <li class="pwd">
            <el-input placeholder="请输入您的密码" v-model="passWord" show-password></el-input>
            <span class="passWord noSelect">
              <img v-show="!focusInput2" src="../../../static/img/pssaw_2.png"/>
              <img v-show="focusInput2" src="../../../static/img/passw_1.png"/>
            </span>
          </li>
          <li class="register noSelect" style="height: 35px;">
            <div v-cloak class="msg" v-if="isShowErr">{{msg}}</div>
            <!--<div v-cloak class="msg" v-if="isShowSuccess" style="color: green;">-->
            <!--<i class="el-icon-loading"></i>登录成功,即将跳转...-->
            <!--</div>-->
          </li>
          <li style="height: 54px;">
            <input type="button" value="登录" @click="loginConfirm"/>
          </li>
        </ul>
        <!--登录提示-->
        <div class="repeat-login-tip" v-if="isShowTip1">
          <div class="title">提示</div>
          <div class="tip-text">
            <p v-cloak>{{tipMsg}}</p>
            <p>{{tipTime}}s后自动登录或手动登录</p>
          </div>
          <button @click="closeTip">登录</button>
        </div>
      </form>
    </div>
    <div class="foot-title noSelect">红牛影像团队管理系统</div>
  </div>
</template>

<script>
  /*方法*/
  let myMethods = {
    keyupEnter() {
      $("body").on("keyup", e => {
        if (e.keyCode == 13 && this.flag) {
          this.flag = false;
          if (!sessionStorage.getItem("userInfo") || sessionStorage.getItem("userInfo") == "") {
            this.loginConfirm();
          }
        }
      });
    },
    //确认登录
    loginConfirm() {
      let url =
        loginApi +
        "/xlapi/CameraManage/CameraUserInfoManage/UserLogin/UserLoginCamera";
      let data = {
        Account: this.userName,
        PassWord: this.passWord
      };
      if (data.Account == "") {
        this.showTips("账号不能为空！");
        return false;
      } else if (data.PassWord == "") {
        this.showTips("密码不能为空！");
        return false;
      }
      this.$Axios({
        method: "POST",
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.isShowSuccess = true;
            /*保存登录信息*/
            this.sessionStorageLose(3); //登录失效倒计时
            setTimeout(() => {
              // this.keepLoginNews(res.data.data,res.data);
              this.isHaveOtherLogin(res.data.data, res.data);
              //获取当前登录用户信息
              this.$getMyUserInfoDetail();
              this.$getUserAuto().then(res => {
                // console.log("权限列表", res);
              });
            });
          } else {
            this.isShowErr = true;
            this.msg = res.data.msg + "!";
            return false;
          }
        }
      });
    },
    /*判断是否有人在线登录*/
    isHaveOtherLogin(resObj, resObj2) {
      let userId = resObj.Authorization.Userid;
      let that = this;
      // this.$myWebSocket(userId).then(res => {
      //   console.log(res);
      //   if (res.messagestatus === 7) {
      //     that.isShowTip1 = true;
      //     that.tipMsg = res.msg.Message;
      //     that.obj1 = resObj;
      //     that.obj2 = resObj2;
      //   } else if (res.messagestatus === 5) {
      //     that.keepLoginNews(resObj, resObj2);
      //   }
      // });//连接websocket
      that.keepLoginNews(resObj, resObj2);
    },
    /*我知道了*/
    closeTip() {
      this.isShowTip1 = false;
      this.isShowTip2 = false;
      this.keepLoginNews(this.obj1, this.obj2);
      clearInterval(this.myTime);
    },
    /*保存用户信息*/
    keepLoginNews(resObj, resObj2) {
      sessionStorage.setItem("userInfo", resObj.AuthorizationStr);
      sessionStorage.setItem("cosIp", resObj2.CosIp);
      cosIp = resObj2.CosIp;
      for (var key in resObj.Authorization) {
        sessionStorage.setItem(key, resObj.Authorization[key]);
      }
      this.reloadApiUrl();
      this.$router.push({path: "/homePage?no=1"});
    },
    /*提示*/
    showTips(msg, type = "error") {
      this.msg = msg;
      if (type == "error") {
        this.isShowErr = true;
        this.isShowSuccess = false;
      } else if (type == "success") {
        this.isShowSuccess = true;
        this.isShowErr = false;
      }
    }
  };
  export default {
    name: "login",
    data() {
      return {
        userName: "", //用户
        passWord: "", //密码
        focusInput1: false,
        focusInput2: false,
        msg: "",
        isShowErr: false,
        isShowSuccess: false,
        isShowTip1: false,
        tipTime: 5,
        obj1: {},
        obj2: {},
        tipMsg: "",
        myTime: Object
      };
    },
    methods: myMethods,
    created() {
      this.userName='';
      this.passWord='';
      this.flag = true;
      this.keyupEnter();
      document.title = "用户登录";
    },
    mounted() {
      this.isShowSuccess = false;
    },

    watch: {
      userName(val) {
        this.userName = val;
        this.flag = true;
        this.msg = "";
        this.isShowErr = false;
        if (val != "") {
          this.focusInput1 = true;
        } else {
          this.focusInput1 = false;
        }
      },
      passWord(val) {
        this.passWord = val;
        this.flag = true;
        this.msg = "";
        this.isShowErr = false;
        if (val != "") {
          this.focusInput2 = true;
        } else {
          this.focusInput2 = false;
        }
      },
      isShowTip1(val) {
        let that = this;
        if (val) {
          this.tipTime = 5;
          this.myTime = setInterval(function () {
            that.tipTime -= 1;
            if (that.tipTime <= 0) {
              that.tipTime = 0;
              clearInterval(this.myTime);
              that.closeTip();
            }
          }, 1000);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  /*变量*/
  $color: red;

  #login {
    height: 100%;
    background: url("../../../static/img/login_bg.png") no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    min-width: 1250px;
  }

  /*右侧*/
  .loginForm {
    width: 510px;
    height: 335px;
    padding: 55px 80px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    position: absolute;
    top: 48%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .loginForm form {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .repeat-login-tip {
    position: absolute;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 5px;
    text-align: center;
    padding: 30px 75px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .repeat-login-tip .title {
    color: #9db3d7;
    font-size: 16px;
  }

  .repeat-login-tip .tip-text {
    color: #222222;
    font-size: 14px;
    margin: 30px 0;
  }

  .repeat-login-tip .tip-text p:first-of-type {
    margin-bottom: 6px;
  }

  .repeat-login-tip button {
    width: 90px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
    border: 0;
    outline: none;
    cursor: pointer;
  }

  .loginForm ul {
    height: 100%;
  }

  .loginForm ul {
    position: relative;
  }

  .loginForm ul li {
    height: 50px;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
  }

  .loginForm ul li.pwd {
    margin-bottom: 0;
  }

  .loginForm ul li.register {
    margin-bottom: 0;
    width: 100%;
    padding-right: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    color: #ffae00;
    font-size: 15px;
    position: relative;
  }

  .loginForm ul li.register .msg {
    position: absolute;
    left: 5px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .loginForm ul li.register a {
    cursor: pointer;
    color: #3b4355;
    font-size: 16px;
    text-decoration: underline;
  }

  .loginForm ul li:last-of-type {
    margin-bottom: 0;
    position: absolute;
    bottom: 0;
  }

  .loginForm ul li input {
    width: 100%;
    height: 100%;
  }

  .loginForm ul li span {
    width: 60px;
    height: 63%;
    position: absolute;
    border-right: 1px solid #515766;
    left: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .loginForm ul li span img {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .loginForm ul li input[type="button"] {
    cursor: pointer;
    border: 0;
    font-size: 17px;
    background: #1d213e;
    color: #fff;
    transition: all 0.2s;
    border-radius: 5px;
  }

  .loginForm ul li input[type="button"]:hover {
    border: 0;
    background: rgba(29, 33, 62, 0.9);
  }

  .foot-title {
    font-size: 20px;
    color: #fff;
    text-align: center;
    position: absolute;
    bottom: 80px;
    width: 100%;
    opacity: 0.5;
  }
</style>

<style>
  .loginForm ul li .el-input {
    height: 100%;
  }

  .loginForm ul li .el-input__inner {
    background: rgba(255, 255, 255, 1);
    border: 1px solid #bbb;
    font-size: 16px;
    padding: 0 85px;
    height: 100%;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 5px;
  }

  .loginForm ul li .el-input__inner:focus {
    border-color: #3a3e46;
  }

  .loginForm ul li .el-input__inner::-webkit-input-placeholder {
    color: #b2b2b2;
    font-size: 17px;
  }

  .loginForm ul li .el-input .el-input__clear {
    font-size: 17px;
    margin-right: 15px;
    padding-top: 3px;
  }
</style>
