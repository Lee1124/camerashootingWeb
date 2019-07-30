import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from 'axios';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import Print from '../static/lib/print';// 引入附件的js文件
import VueCropper from 'vue-cropper'
import store from './store/store'

Vue.use(VueCropper);//裁剪图片
Vue.use(Print); // 注册
Vue.use(ElementUI);
Vue.use(Viewer);

// Vue.use(md5);
//放大图
Viewer.setDefaults({
  Options:
  {
    "inline": true,
    "button": true,
    "navbar": false,
    "title": true,
    "toolbar": true,
    "tooltip": true,
    "movable": true,
    "zoomable": false,
    "rotatable": true,
    "scalable": true,
    "transition": false,
    "fullscreen": true,
    "keyboard": true,
    "url": "data-source",
    'loop': false,
    'toggleOnDblclick': true
  },
  toolbar: {
    zoomIn: true,
    zoomOut: true,
    play: {
      show: 0,
    },
    rotateLeft: true,
    reset: false,
    rotateRight: false,
    flipHorizontal: false,
    flipVertical: false,
    prev: true,
    next: true
  },
  movable: false
});

// Axios.defaults.baseURL = 'https://xilai99.com/';
// Axios.defaults.baseURL = Vue.prototype.fn ;
Vue.config.productionTip = false;
Vue.prototype.reloadApiUrl = reloadApiUrl;
Vue.prototype.$axios = Axios;
Vue.prototype.$DetelImg = DetelImg;             //删除图片
Vue.prototype.$Axios = request;//封装axios请求
Vue.prototype.sessionStorageLose = sessionStorageLose;//登录计时
Vue.prototype.$ThisParent = ThisParent;         //寻找父级变量
Vue.prototype.$ImgFileBase64 = ImgFileBase64;     //图片转base64
Vue.prototype.$UpImgFile = UpImgFile;           //上传图片
Vue.prototype.$getMyUserInfoDetail = getMyUserInfoDetail;           //获取用户信息(从后台获取)
Vue.prototype.$getLoginInfo = getLoginInfo;           //获取用户信息(从本地获取)
Vue.prototype.$getUserAuto = getUserAuto;           //获取用户权限菜单
Vue.prototype.$UpVideoFile = UpVideoFile;           //上传视频
Vue.prototype.$tips = tips;                       //成功提示
Vue.prototype.$warning = warning;                //警告
Vue.prototype.$DetelImg = DetelImg;             //删除图片
Vue.prototype.$myWebSocket = getMyWebSocket;     //websocket
Vue.prototype.$closeWebSocket = closeWebSocket;     //websocket


//登陆后调用
reloadApiUrl();

/**
 * 当前登录用户信息
 */
var loginInfo = {};

/**
 * 当前店铺的权限列表
 */
var authList = [];

/**
 * 当前用户权限列表(全部)
 */
var checkList = [];

/**
 * 当前用户权限列表(设置)
 */
var userAuthList = [];


function reloadApiUrl() {
  Axios.defaults.baseURL = getkevalue().apiurl;
}


/**
 * 成功提示
 * @method tips
 * @for tips
 * @param {String}
 * */
function tips(msg) {
  this.$message({
    message: msg,
    type: 'success'
  });
}

/**
 * 失败提示
 * @method tips
 * @for tips
 * @param {String}
 * */
function warning(msg) {
  this.$message({
    message: msg,
    type: 'warning'
  });
}

/**
 * 寻找父级变量 并修改
 * @method ThisParent
 * @for ThisParent
 * @param {Object}
 * @return {callblck} 方法回调
 * */
function ThisParent(data) {
  let that = this;
  let parent = this.$parent;

  function f(t) {
    let arr = Object.keys(t.$data);
    if (arr.indexOf(data.variable) == -1) {
      parent = parent.$parent
      f(parent)
    } else {
      data.callblack.call(that, parent)
    }
  }

  f(parent)
}

/**
 * 文件转base64
 * @method ImgFileBase64
 * @for ImgFileBase64
 * @param {Array}
 * @return {callblck} 方法回调
 */
function ImgFileBase64(param) {

  let that = this;

  param.list.forEach((res, i) => {

    var reader = new FileReader();

    reader.readAsDataURL(res);

    reader.onload = function (e) {

      param.callback.call(that, {
        path: reader.result,
        index: i
      })

    }

  })
}

/**
 * 图片及文件上传
 * @method UpImgFile
 * @for UpImgFile
 * @param {Object}
 * @return {callblck} 方法回调
 */
let a = 0

function UpImgFile(param) {

  if (typeof param != "object") {
    return
  }
  //请求接口获取 存储桶名称和区域
  let bucket = "";
  let region = "";
  getBucketRegionByBranchId().then((res) => {
    bucket = res.data.data.Bucket;
    region = res.data.data.Region;
    let arr = new Array;
    let uploader = new XLImageUploader({ prefix: param.path, bucket: bucket, region: region });

    let that = this


    for (let i = 0; i < param.file.length; i++) {
      arr.push(param.file[i])
    }
    //上传
    arr.forEach((res, i) => {
      uploader.upImg({
        ys: 3,
        file: res,
        callback: function (res) {
          GetHash(res.url).then(hash => {
            a++
            //单个图片上传完成
            param.callback.call(that, res)
            //多个上传完成
            if (arr.length == a) {
              a = 0
              param.callbackall && param.callbackall.call(that, arguments)
            }
          })
        }
      });
    })
  });
}

/**
 * 上传视频
 * @method UpImgFile
 * @for UpImgFile
 * @param {Object}
 * @return {callblck} 方法回调
 */
let b = 0;

function UpVideoFile(param) {
  if (typeof param != "object") {
    return;
  }
  //请求接口获取 存储桶名称和区域
  let bucket = "";
  let region = "";
  getBucketRegionByBranchId().then((res) => {
    bucket = res.data.data.Bucket;
    region = res.data.data.Region;
    let arr = new Array;
    let uploader = new XLImageUploader({ prefix: param.path, bucket: bucket, region: region });
    let that = this;
    for (let i = 0; i < param.file.length; i++) {
      arr.push(param.file[i])
    }
    //上传
    arr.forEach((res, i) => {
      uploader.upFile({
        file: res,
        callback: function (res) {
          GetHash(res.url).then(hash => {
            b++;
            //单个图片上传完成
            param.callback.call(that, res)
            //多个上传完成
            if (arr.length == b) {
              b = 0;
              param.callbackall && param.callbackall.call(that, arguments)
              // console.log(param)
            }
          })
        }
      });
    })
  });
}

/**
 * 图片及文件删除
 * @method DetelImg
 * @for DetelImg
 * @param {Object}
 * @return {callblck} 方法回调
 */

let i = 0;

function DetelImg(param) {

  if (typeof param != 'object') {
    throw '该参数不是一个对象!'
    return
  }
  let uploader = new XLImageUploader();
  let that = this;
  let arr = new Array();
  //单个文件
  if (typeof param.file == 'string') {
    arr.push(param.file)
  }
  //多个文件删除
  // if (typeof param.file == 'object' && param.file.length > 0) {
  if (typeof param.file == 'object' && param.file.length > 0) {
    arr = param.file.map(res => res)
  }
  //批量删除
  arr.forEach((r) => {
    uploader.delObject({
      key: r.key,
      callback: res => {
        if (res == 1001) {
          //单个删除成功 方法回调
          i++
          param.callback.call(that, r)
          //全部删除回调
          if (i == arr.length) {
            i = 0
            param.callbackall && param.callbackall.call(that, arguments)
          }
        } else {
          param.callback.call(that, r)
          throw '删除失败!'
        }
      }
    })
  })
}

/**
 * 获取hash值
 * @method GetHashv
 * @for GetHash
 * @param {string}
 */
function GetHash(url) {
  return new Promise((resolve, reject) => {
    $.get("https://xilai99.com/showproject/image.py?path=" + url, res => resolve(res))
  })
}

/**
 * 获取当前店铺的存储桶名称和区域
 */
function getBucketRegionByBranchId() {
  return new Promise((resolve, reject) => {
    vm.$Axios({
      method: "POST",
      url: `xlapi/CameraManage/CameraUploadImgManage/CameraUploadImgManage/GetBucketRegionByBranchId`,
      data: {},
      success(res) {
        if (res.data.status) {
          resolve(res)
        } else {
          reject(res);
        }
      },
      error(err) {
        reject(res);
      }
    });
  });

}
/**
* 获取用户信息
*/
function getLoginInfo() {
  return loginInfo;
}
/**
* 获取用户信息
*/
function getMyUserInfoDetail() {
  return new Promise((resolve, reject) => {
    vm.$Axios({
      method: "POST",
      url: `${getkevalue().apiurl}/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetMyUserInfoDetail`,
      data: { UserId: getkevalue().userid },
      success(res) {
        if (res.data.status) {
          loginInfo = res.data.data;
          resolve(loginInfo);
        }
      },
      error(err) {
        console.log(err);
      }
    });

  });
}

/**
 * 获取当前店铺的权限列表
 */
function getBranchPermission() {
  return new Promise((resolve, reject) => {
    vm.$Axios({
      method: "POST",
      url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchPermission`,
      data: { BranchId: getkevalue().branchid },
      success(res) {
        if (res.data.status) {
          authList = res.data.data;
          resolve();
          //getUserAuto();
        } else {
          //this.$message.error(res.data.msg);
        }
      },
      error(err) {
        //this.$message.error(err);
      }
    });
  });

}

/**
 * 查询用户权限菜单信息
 */
function getBranchUserPermission() {
  return new Promise((resolve, reject) => {
    vm.$Axios({
      method: "POST",
      url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchUserPermission`,
      data: {
        BranchId: getkevalue().branchid,
        SearchUserId: getkevalue().userid
      },
      success(res) {
        if (res.data.status) {
          userAuthList = res.data.data;
          getBranchPermission().then(res => {
            resolve();
          });;
        } else {
          //this.$message.error(res.data.msg);
        }
      },
      error(err) {
        //this.$message.error(err);
      }
    });
  });
}
/**
 * 筛选当前用户拥有的权限
 */
function getUserAuto() {
  return new Promise((resolve, reject) => {
    getBranchUserPermission().then(res => {
      authList.forEach(pMune => {
        var pathList = [];//当前父级菜单的子菜单路由列表
        pMune.ChildPermissionModelList = pMune.ChildPermissionModelList.filter(
          mune =>
            userAuthList.find(
              uMune => uMune.MenuId == mune.ChildPermissionId
            )
        );
        //排除无需判断权限的菜单项(只与是否管理员有关的菜单)
        if (pMune.ParentPermissionId == 2) {
          //设备-设备列表(设备查看,设备管理)

          //设备-设备查看
          var index1 = pMune.ChildPermissionModelList.findIndex(m => m.ChildPermissionId == 9);
          if (index1 >= 0) {
            pMune.ChildPermissionModelList.splice(index1, 1);
          }
          //设备-设备管理
          var index2 = pMune.ChildPermissionModelList.findIndex(m => m.ChildPermissionId == 10);
          if (index2 >= 0) {
            pMune.ChildPermissionModelList.splice(index2, 1);
          }
        }
        //为菜单添加相应路由路径
        if (menuPathList.find(paths => paths.pID == pMune.ParentPermissionId)) {
          pathList = menuPathList.find(paths => paths.pID == pMune.ParentPermissionId).pathList;
        }
        pMune.ChildPermissionModelList.forEach(pm => {
          if (pathList.find(path => path.mID == pm.ChildPermissionId)) {
            pm.path = pathList.find(path => path.mID == pm.ChildPermissionId).path;
            if (pathList.find(path => path.mID == pm.ChildPermissionId).mName && pathList.find(path => path.mID == pm.ChildPermissionId).mName != "") {
              pm.ChildPermissionName = pathList.find(path => path.mID == pm.ChildPermissionId).mName;
            }
          }
          else {
            pm.path = "";
          }
        });
        resolve(authList)
      });
    });
  })

}


//注册全局组件:
import dropSelect2 from './components/calendar/dropSelect2';
import dropSelect1 from './components/common/dropSelect/dropSelect';
import dropMoreSelect from './components/common/dropMoreSelect/dropMoreSelect';
import Input from './components/common/Input/Input';
import textArea from './components/common/textArea/textArea';
import inputSearch from './components/common/inputSearch/inputSearch';
import search from './components/common/search/search';
import inputSearch2 from './components/common/inputSearch2/inputSearch2';
import timeSelect1 from './components/common/timeSelect1/timeSelect1';
import noData from './components/common/noData/noData';

Vue.component('dropSelect2', dropSelect2);//两个
Vue.component('dropSelect1', dropSelect1);//一个
Vue.component('dropMoreSelect', dropMoreSelect);//多选
Vue.component('commonInput', Input);//普通输入框
Vue.component('textArea', textArea);//普通文本域
Vue.component('inputSearch', inputSearch);//输入搜索
Vue.component('search', search);//普通搜索
Vue.component('inputSearch2', inputSearch2);//输入框  支持返回数据后搜索选择(一次性将数据返回完，支持筛选)
Vue.component('timeSelect1', timeSelect1);//时间选择 单个
Vue.component('noData', noData);//无数据


//自定义指令1
Vue.directive('marginRight', {
  bind(el, binding) {
    el.style.marginRight = parseInt(binding.value) + 'px'
  }
});
//自定义指令2
Vue.directive('myHeight', {
  bind(el, binding) {
    el.style.height = parseInt(binding.value) + 'px'
  }
});
//自定义指令3
Vue.directive('focus', {
  inserted(el, ) {
    el.focus();
  }
});

//全局前置导航守卫
router.beforeEach((to, from, next) => { //全局前置守卫按照创建顺序调用
  if (to.path == '/login') {
    next();
  } else {
    if (sessionStorage.getItem('userInfo')) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
});

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  data() {
    return {
      mywebSocket: null
    }
  },
  router,
  store,
  components: { App },
  template: '<App/>',
});

/**
 *sessionStorage失效时间
 * @time 设置失效时间  单位 小时
 */
function sessionStorageLose(hour) {
  setTimeout(() => {
    alert('登录过期，请重新登录！');
    sessionStorage.removeItem('userInfo');
    vm.$router.push({ path: '/login' });
  }, hour * 3600000);
}

/**
 *封装axios
 * @param 传进的method、url、data等对象
 */
function request(param) {
  let _that = this;
  let method = param.method;
  let url = param.url;
  let dataObj = param.data;
  if (method == 'GET' || method == 'get') {
    let dataObjArr = [];
    for (var key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {
        dataObjArr.push(key);
        if (dataObjArr.length == 1) {
          url = url + '?' + key + '=' + dataObj[key];
        } else {
          url = url + '&' + key + '=' + dataObj[key];
        }
      }
    }
    this.$axios({
      method: method,
      url: url,
      headers: { Authorization: sessionStorage.userInfo }
    }).then(res => {
      try {
        param.success.call(_that, res);
      }
      catch (err) {
        console.log(err)
      }
    }).catch(err => {
      param.error.call(_that, err);
    });
  } else if (method == 'POST') {
    this.$axios({
      method: method,
      url: url,
      data: dataObj,
      headers: { Authorization: sessionStorage.userInfo }
    }).then(res => {
      try {
        param.success.call(_that, res);
      }
      catch (err) {
        console.log(err)
      }
    }).catch(err => {
      param.error.call(_that, err);
    });
  }
}

function closeWebSocket() {
  vm.mywebSocket.close();
}
/*websocket*/

/*readyState表示连接有四种状态：
CONNECTING (0)：表示还没建立连接；
OPEN (1)： 已经建立连接，可以进行通讯；
CLOSING (2)：通过关闭握手，正在关闭连接；
CLOSED (3)：连接已经关闭或无法打开；*/
function getMyWebSocket(userId = 1, type) {
  return new Promise((resolve, reject) => {
    class webSocket {
      /*初始化*/
      initWebSocket(userId) {
        let wxUrl = "ws://192.168.1.73:8088/xlapi/CameraManage/CameraUserInfoManage/UserSocket/Connect?User=" + userId + "&Encrypt=PC";
        console.log('socket:', wxUrl);
        vm.mywebSocket = this.ws = new WebSocket(wxUrl);
        this.ws.onopen = this.setOnOpenMessage;//连接
        this.ws.onmessage = this.setOnMssageMsg;//收到数据的回调
        this.ws.onclose = this.setOncloseMessage;//连接关闭时的回调
        this.ws.onerror = this.setErrorMessage;//连接错误时的回调
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onBeforeUnLoad
      }

      /*连接成功*/
      setOnOpenMessage() {
        console.log('连接成功..')
      }

      /*接收数据*/
      setOnMssageMsg(e) {
        const resData = JSON.parse(e.data);
        console.log('收到数据：', resData);
        if (resData.messagestatus === 6) {
          sessionStorage.removeItem('userInfo');
          if (this.readyState === this.OPEN) {
            alert(resData.msg.Message);//提示
            this.close();
            vm.$router.push({ path: '/login' })
          }
        }
        resolve(resData)
      }

      /*关闭*/
      setOncloseMessage(e) {
        console.log('WebSocket关闭，状态码：', e.code);
      }

      /*错误*/
      setErrorMessage() {
        console.log("WebSocket连接发生错误，状态码：" + this.readyState);
      }

      /*窗口销毁时关闭*/
      onBeforeUnLoad() {
        this.closeWebSocket();
      }

      /*关闭websocket*/
      closeWebSocket() {
        console.log('哈哈哈哈', this.readyState)
        this.close()
      }

      /*websocket发送消息*/
      webSocketSend(data) {
        if (this.ws.readyState === this.ws.OPEN) {
          this.send(data)
        }
        // 若是 正在开启状态，则等待300毫秒
        else if (this.ws.readyState === this.ws.CONNECTING) {
          setTimeout(() => {
            this.send(data)
          }, 300);
        }
        // 若未开启 ，则等待500毫秒
        else {
          this.initWebSocket();
          setTimeout(() => {
            this.send(data)
          }, 500);
        }
      }
    }
    const myWebSocket = new webSocket();
    myWebSocket.initWebSocket(userId);
  })
}

if (sessionStorage.getItem('userInfo') != '' && sessionStorage.getItem('userInfo') != null) {//重新连接
  // getMyWebSocket(sessionStorage.getItem('Userid')).then(res => {
  //   console.log(res)
  // });
}
