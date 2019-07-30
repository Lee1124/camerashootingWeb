<template>
  <div class="user-content" @click="hideAll">
    <div class="div-search">
      <el-input placeholder="搜索人员" size="small" v-model="searchStr"></el-input>
      <div>
        <el-button @click="getMyBranchUserList">查询</el-button>
        <el-button class="button-add" @click="addMoadl">新增</el-button>
      </div>
    </div>
    <div class="div-tree commonScrollStyle" v-loading="devIsLodding">
      <el-tree
        :data="data"
        node-key="id"
        :expand-on-click-node="true"
        :default-expanded-keys="['root']"
        :indent="40"
        @node-expand="nodeExpand"
        @node-click="hideAll"
        @node-collapse="nodeCollapse"
        visible-arrow="false"
      >
        <div slot-scope="{ node,data }">
          <div v-if="data.isStaff" class="user-children">
            <div class="user-info" @click="addMoadl">
              <img src="static\img\setting\user.png" />
              <span>{{node.label}}</span>
            </div>
            <div class="user-info" v-for="staff in data.otherStaff">
              <el-popover
                placement="right-start"
                width="102"
                trigger="manual"
                popper-class="operate-popover"
                v-model="staff.showOperate"
              >
                <div class="popover-main noSelect">
                  <span @click="editMoadl">编辑资料</span>
                  <span @click="powerMoadl">权限设置</span>
                  <span @click="deleteMoadl">删除人员</span>
                  <span @click="deleteMoadl1">重置密码</span>
                </div>
                <div slot="reference" @click.stop="selectStaff(staff,data)">
                  <img :src="staff.HeadImgSrc" />
                  <div>
                    <span class="staff-post">{{staff.DutyName}}</span>
                    <span v-show="staff.DutyName&&staff.DutyName!=''">•</span>
                    <span :class="{'staff-bold':staff.IsAdmin}">{{staff.UserRealName}}</span>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
          <div v-else>
            <span :class="data.isRoot?'rootNode':'department-name'">{{ node.label }}</span>
            <span
              :class="data.isRoot?'rootNode':'department-name'"
            >({{data.children[0]?(data.children[0].otherStaff?data.children[0].otherStaff.length:staffCount):''}})</span>
            <span
              :class="name.IsAdmin?'staffName-list staff-bold':'staffName-list'"
              v-if="!data.isExpand"
              v-for="name in  data.children[0]?(data.children[0].otherStaff):[]"
            >{{ name.UserRealName}}</span>
          </div>
        </div>
      </el-tree>
    </div>

    <!--新增、编辑人员弹窗-->
    <el-dialog
      :title="editTitle"
      :modal="false"
      top="0"
      :visible.sync="showAddDig"
      width="652px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="add-dialog"
    >
      <div class="addDig-main">
        <div class="staff-img">
          <input
            type="file"
            id="file"
            accept="image/*"
            style="opacity: 0;width: 0;height: 0;"
            @change="AppendPicture"
          />
          <img
            :src="curStaff.ImgSrc"
            alt="头像"
            :title="curStaff.ImgSrc==''?'请上传图片':'剪裁'"
            @click="urlTobase64"
          />
          <p style="display:none">{{msg}}</p>
          <span class="img-tip" @click="changeIcon">{{isUpload?'点击上传头像':'正在上传...'}}</span>
        </div>
        <div class="staff-form">
          <div class="form-item">
            <el-input
              size="medium"
              v-model="curStaff.RealName"
              @blur="convertPinyin"
              placeholder="员工姓名"
            ></el-input>
            <el-input
              size="medium"
              :disabled="true"
              v-model="curStaff.UserName"
              placeholder="自动生成用户名"
            ></el-input>
          </div>
          <div class="form-item">
            <el-input size="medium" v-model="curStaff.Phone" placeholder="手机号码"></el-input>
            <el-date-picker
              size="medium"
              v-model="curStaff.AddTime"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择入职日期"
            ></el-date-picker>
          </div>
          <div class="form-item">
            <el-select size="medium" v-model="curStaff.DepartmentId" placeholder="请选择部门">
              <el-option
                v-for="depart in departList"
                :key="depart.DepartmentId"
                :label="depart.DepartmentName"
                :value="depart.DepartmentId"
              ></el-option>
            </el-select>
            <el-select size="medium" v-model="curStaff.DutyId" placeholder="请选择职务">
              <el-option
                v-for="duty in dutyList"
                :key="duty.DutyId"
                :label="duty.DutyName"
                :value="duty.DutyId"
              ></el-option>
            </el-select>
          </div>
          <div class="form-item">
            <el-select size="medium" v-model="curStaff.IsAdmin" placeholder="是否管理层">
              <el-option label="管理层" :value="true"></el-option>
              <el-option label="非管理层" :value="false"></el-option>
            </el-select>
          </div>
        </div>
        <div class="staff-button">
          <el-button type="text" class="btn-cancel" @click="showAddDig=false">取消</el-button>
          <el-button class="btn-save" @click="addBranchUser">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <!--裁剪操作弹窗-->
    <tailoringDig
      :showTailoringDig="showTailoringDig"
      :curStaff="userInfo"
      :isNewImg="isNewImg"
      @closeDig="showTailoringDig=false"
      @uploadCallback="uploadCallback"
    ></tailoringDig>

    <!--删除弹窗-->
    <el-dialog
      title="删除提示"
      :modal="false"
      top="0"
      :visible.sync="showDeletwDig"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="delete-dialog"
    >
      <div class="delete-main">
        <div class="delete-tip">
          <span class="delete-tip1">是否确定删除该账号？</span>
          <span class="delete-tip2">•"{{curStaff.UserRealName}}"账号删除后如遇到问题，请及时联系管理员</span>
        </div>
        <div class="delete-bottom">
          <el-button type="text" class="btn-cancel" @click="showDeletwDig=false">取消</el-button>
          <el-button class="btn-save" @click="deleteMyUserInfo">确认删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!--删除弹窗-->
    <el-dialog
      title="操作确认"
      :modal="false"
      top="0"
      :visible.sync="showDeletwDig1"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      custom-class="delete-dialog"
    >
      <div class="delete-main">
        <div class="delete-tip">
          <span class="delete-tip1">是否确定重置该账号密码？</span>
          <span class="delete-tip2">•确定重置后,"{{curStaff.UserRealName}}"账号密码将初始化</span>
        </div>
        <div class="delete-bottom">
          <el-button type="text" class="btn-cancel" @click="showDeletwDig1=false">取消</el-button>
          <el-button class="btn-save" @click="userResetPassword">确认重置</el-button>
        </div>
      </div>
    </el-dialog>

    <!--权限弹窗-->
    <el-dialog
      :title="curStaff.DepartmentName+' '+curStaff.UserRealName+' 权限设置'"
      :modal="false"
      :visible.sync="showAutDig"
      width="882px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :center="true"
      top="0"
      custom-class="authority-dialog"
    >
      <div class="authority-main commonScrollStyle">
        <div class="authority-list" v-for="auth in authList">
          <span class="authority-title">{{auth.ParentPermissionName}}</span>
          <el-checkbox
            label="全选"
            v-if="false"
            :key="auth.ParentPermissionId"
            :indeterminate="false"
            v-model="auth.checkAll"
            @change="handleCheckAllChange(auth)"
          ></el-checkbox>
          <el-checkbox-group
            v-model="checkList"
            class="authority-item"
            @change="handleCheckedCitiesChange(auth)"
          >
            <el-checkbox
              v-for="authChild in auth.ChildPermissionModelList"
              @change="updateBranchUserPermission(authChild)"
              :label="authChild.ChildPermissionId"
              :key="authChild.ChildPermissionId"
            >{{authChild.ChildPermissionName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="authority-list" style="margin-bottom: 20px;">
          <span class="authority-title">其他</span>
          <el-checkbox-group v-model="otherAuth" class="authority-item">
            <el-checkbox
              @change="updateBranchUserUpdateBasicInfoPermission"
              label="Basic"
              key="Basic"
            >编辑基本信息</el-checkbox>
            <el-checkbox
              @change="updateBranchUserUpdateBasicInfoPermission"
              label="Amount"
              key="Amount"
            >修改金额</el-checkbox>
            <el-checkbox
              @change="updateBranchUserUpdateBasicInfoPermission"
              label="Equip"
              key="Equip"
            >编辑设备</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tailoringDig from "./components/tailoringDig"; //裁剪图片弹窗
let id = 1000;
//定义一个放图片信息的数组
var imgArr = [];
export default {
  components: { tailoringDig },
  data() {
    return {
      data: [
        {
          id: "root",
          label: "全部人员",
          isRoot: true,
          children: []
        } //本店员工列表
      ],
      msg: 1, //强制刷新页面使用
      searchStr: "", //搜索字符串
      curStaff: {
        UserId: "",
        UserName: "",
        HeadImgUrl: "static/img/setting/user.png",
        ImgSrc: "static/img/setting/user.png",
        RealName: "",
        Phone: "",
        AddTime: "",
        DepartmentId: "",
        DepartmentName: "",
        IsAdmin: false,
        DutyId: ""
      }, //当前选择的员工
      showOperate: false, //弹出框是否显示
      iconStr: "iconStr", //树形展开收起时的自定义类名
      showAddDig: false, //新增、编辑员工弹窗是否显示
      showDeletwDig: false, //删除提示是否显示
      showDeletwDig1: false, //密码重置提示是否显示
      showAutDig: false, //权限编辑弹窗是否显示
      checkList: [], //选择的权限列表
      userAuthList: [], //用户的权限
      authList: [], //所有权限列表
      departList: [], //部门列表
      editTitle: "新增员工", //新增、编辑员工弹窗标题
      dutyList: [], //职务列表
      isUpload: true, //是否上传完成
      devIsLodding: true,
      userPrefix: "", //用户名前缀
      showTailoringDig: false, //是否显示裁剪弹窗
      userInfo: {}, //员工信息用于裁剪头像
      isNewImg: false, //是否为选择的图片
      isIndeterminate: true,
      checkAll: false,
      otherAuth: [] //其他权限
    };
  },
  computed: {
    staffCount: function() {
      let count = 0;
      this.data[0].children.forEach(element => {
        if (element.children[0].otherStaff) {
          count += element.children[0].otherStaff.length;
        }
      });
      return count;
    }
  },
  mounted() {
    this.getMyBranchUserList();
    this.getMyBranchDepartmentList();
    this.getBranchDutyList();
  },
  methods: {
    //上传图片获得图像的url地址(二进制源码)
    AppendPicture() {
      var imgNum = document.getElementById("file").files.length; //图片数量
      //判断是否选择了图片
      if (imgNum > 0) {
        for (var i = 0; i < imgNum; i++) {
          var imgNews = document.getElementById("file").files[i];
          imgArr.push(imgNews);
        }
        var reader = new FileReader();
        let that = this;
        reader.readAsDataURL(imgArr[0]); //发起异步请求
        reader.onload = function() {
          that.isNewImg = true;
          that.userInfo.ImgSrc = this.result;
          that.showTailoringDig = true;
        };
        // //上传
        // this.isUpload = false;
        // this.$UpImgFile({
        //   file: imgArr,
        //   path: "Camera/HeadImg",
        //   callback: (that, res) => {
        //     this.curStaff.ImgUrl = that.key.substring(1);
        //     this.curStaff.ImgSrc = cosIp + "/" + that.key;
        //     this.msg += 1;
        //     this.isUpload = true;
        //     console.log("上传成功", this.curStaff.ImgSrc);
        //   }
        // });
      }
    },
    /**
     * 裁剪页面上传成功回调函数
     */
    uploadCallback(that) {
      this.curStaff.ImgUrl = that.key.substring(1);
      this.curStaff.ImgSrc = cosIp + this.curStaff.ImgUrl;
      this.isUpload = true;
      console.log("上传成功", this.curStaff.ImgSrc);
    },
    /**
     * 汉字转拼音
     */
    convertPinyin() {
      if (this.curStaff.UserId && this.curStaff.UserId != "") {
        return;
      }
      this.getCameraBranchRemark().then(res => {
        this.curStaff.UserName =
          this.userPrefix + pinyin.getFullChars(this.curStaff.RealName);
      });
    },

    handleCheckAllChange(val) {
      val.checkList = val.checkAll ? val.ChildPermissionModelList : [];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.ChildPermissionModelList.filter(m =>
        this.checkList.find(c => c == m.ChildPermissionId)
      ).length;
      value.checkAll = checkedCount == value.ChildPermissionModelList.length;
    },
    /**
     * 节点被展开时触发的事件
     */
    nodeExpand(data) {
      data.isExpand = true;
    },
    /**
     * 节点被关闭时触发的事件
     */
    nodeCollapse(data) {
      data.isExpand = false;
      this.hideAll();
    },
    /**
     * 修改头像
     */
    changeIcon() {
      if (this.isUpload) {
        $("#file").trigger("click");
        imgArr = [];
      } else {
        this.$message({
          message: "头像真在上传中,请稍后……",
          type: "warning"
        });
      }
    },
    /**
     * 网络图片转base64 并显示裁剪弹窗
     */
    urlTobase64() {
      if (this.curStaff.ImgSrc == "static/img/setting/user.png") {
        this.changeIcon();
      }
      let that = this;
      let src = this.curStaff.ImgSrc;
      this.$Axios({
        method: "get",
        url: `${
          getkevalue().apiurl
        }/xlapi/Mini/Ins/Img/getbase64?imgurl=${src}`,
        data: {},
        success(res) {
          let type = src.split(".").pop();
          let database64 = "data:image/" + type + ";base64," + res.data;
          this.userInfo.ImgSrc = database64;
          this.isNewImg = false;
          this.showTailoringDig = true;
        },
        error(err) {
          console.log(err);
        }
      });
    },
    /**
     * 选择某个员工
     */
    selectStaff(staff, data) {
      this.hideAll();
      staff.showOperate = true;
      this.curStaff = staff;
      // let staffList = {};

      // this.data[0].children.forEach(d => {
      //   if (d.children[0].id == data.id) {
      //     staffList = d.children[0];
      //   }
      // });
      // if (staffList) {
      //   let staffInfo = staffList.otherStaff.find(
      //     s => s.UserId == staff.UserId
      //   );
      //   if (staffInfo) {
      //     if (!staffInfo.showOperate) {
      //       this.hideAll();
      //       this.curStaff = staffInfo;
      //     }
      //     staffInfo.showOperate = !staffInfo.showOperate;
      //   }
      // }
    },
    /**
     * 隐藏所有弹出框
     */
    hideAll() {
      let data = this.data[0];
      data.children.forEach(department => {
        department.children[0].otherStaff.forEach(staff => {
          staff.showOperate = false;
        });
      });
    },
    /**
     * 显示编辑资料弹窗
     */
    editMoadl() {
      this.hideAll();
      this.editTitle = "编辑员工";
      this.getMyUserInfoDetail().then(() => {
        this.showAddDig = true;
      });
    },
    /**
     * 显示新增资料弹窗
     */
    addMoadl() {
      this.hideAll();
      this.curStaff = {
        UserId: "",
        UserName: "",
        HeadImgUrl: "static/img/setting/user.png",
        ImgSrc: "static/img/setting/user.png",
        RealName: "",
        Phone: "",
        AddTime: "",
        DepartmentId: "",
        DepartmentName: "",
        DutyId: "",
        IsAdmin: false
      };
      this.userInfo = clone(this.curStaff);
      this.editTitle = "新增员工";
      this.showAddDig = true;
    },
    /**
     * 显示权限弹窗
     */
    powerMoadl() {
      this.hideAll();
      this.getBranchPermission();
      this.checkList = []; //获取当前选择用户权限列表
      this.userAuthList = [];
      this.getBranchUserPermission();
      this.getBranchUserUpdateBasicInfoPermission();
      this.showAutDig = true;
    },
    /**
     * 显示删除人员弹窗
     */
    deleteMoadl() {
      this.hideAll();
      this.showDeletwDig = true;
    },
    /**
     * 显示密码重置确认弹窗
     */
    deleteMoadl1() {
      this.hideAll();
      this.showDeletwDig1 = true;
    },
    /**
     * 关闭弹窗
     */
    handleClose(done) {
      done();
    },
    /**
     * 重置密码
     */
    userResetPassword() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/UserResetPassword`,
        data: { SearchUserId: this.curStaff.UserId },
        success(res) {
          if (res.data.status) {
            this.showDeletwDig1 = false;
            this.$message.success(res.data.msg);
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
     * 获取用户信息列表
     */
    getMyBranchUserList() {
      this.devIsLodding = true;
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetMyBranchUserList`,
        data: {
          UserId: getkevalue().userid,
          BranchId: getkevalue().branchid,
          SearchUserName: this.searchStr
        },
        success(res) {
          that.devIsLodding = false;
          if (res.data.status) {
            let userList = [];
            let nodeId = "";
            res.data.data.DepartmentList.forEach(d => {
              nodeId += "n";
              let user = {
                id: nodeId,
                label: "新员工",
                isStaff: true,
                otherStaff: []
              };
              let depart = {
                id: d.UserDepartmentName,
                label: d.UserDepartmentName,
                isStaff: false,
                isExpand: false, //是否展开
                children: [user]
              };
              d.UserList.forEach(u => {
                let staff = {
                  UserId: u.UserId,
                  UserRealName: u.UserRealName,
                  UserName: u.UserName,
                  DutyName: u.DutyName,
                  IsAdmin: u.IsAdmin,
                  DepartmentName: d.UserDepartmentName,
                  showOperate: false,
                  HeadImgSrc: u.UserHeadImgUrl
                };
                staff.HeadImgSrc = cosIp + staff.HeadImgSrc;
                user.otherStaff.push(staff);
              });
              userList.push(depart);
            });
            that.data[0].children = userList;
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
     * 获取选择用户详细信息
     */
    getMyUserInfoDetail() {
      let that = this;
      return new Promise(function(resolve, reject) {
        that.$Axios({
          method: "POST",
          url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetMyUserInfoDetail`,
          data: { UserId: that.curStaff.UserId },
          success(res) {
            if (res.data.status) {
              that.curStaff = res.data.data;
              this.curStaff.ImgSrc = cosIp + that.curStaff.ImgUrl;
              this.userInfo = clone(this.curStaff);
              resolve(res);
            } else {
              reject(res);
              this.$message.error(res.data.msg);
            }
          },
          error(err) {
            this.$message.error(res.data.msg);
            reject(err);
          }
        });
      });
    },
    /**
     * 获取选择用户名前缀
     */
    getCameraBranchRemark() {
      let that = this;
      return new Promise(function(resolve, reject) {
        that.$Axios({
          method: "POST",
          url: `/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraBranchRemark`,
          data: {},
          success(res) {
            if (res.data.status) {
              that.userPrefix = res.data.data;
              resolve(res);
            } else {
              reject(res);
              this.$message.error(res.data.msg);
            }
          },
          error(err) {
            this.$message.error(res.data.msg);
            reject(err);
          }
        });
      });
    },
    /**
     * 查询部门信息列表
     */
    getMyBranchDepartmentList() {
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchDepartmentList`,
        data: { BranchId: getkevalue().branchid },
        success(res) {
          if (res.data.status) {
            that.departList = res.data.data;
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
     * 获取职务列表
     */
    getBranchDutyList() {
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchDutyList`,
        data: { BranchId: getkevalue().branchid },
        success(res) {
          if (res.data.status) {
            that.dutyList = res.data.data;
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
     * 新增、编辑员工
     */
    addBranchUser() {
      if (!this.isUpload) {
        this.$message({
          message: "头像真在上传中,请稍后……",
          type: "warning"
        });
        return;
      }
      //数据验证

      let that = this;
      if (!this.curStaff.ImgUrl || this.curStaff.ImgUrl == "") {
        that.$message({
          message: "请先上传头像",
          type: "warning"
        });
        return;
      }
      if (!this.curStaff.RealName || this.curStaff.RealName == "") {
        that.$message({
          message: "请填写正确的真实姓名",
          type: "warning"
        });
        return;
      }
      if (!this.curStaff.UserName || this.curStaff.UserName == "") {
        that.$message({
          message: "请填写正确用户名",
          type: "warning"
        });
        return;
      }
      if (!this.curStaff.Phone || !checkPhone(this.curStaff.Phone)) {
        that.$message({
          message: "请填写正确的电话号码",
          type: "warning"
        });
        return;
      }
      if (!this.curStaff.AddTime || this.curStaff.AddTime == "") {
        that.$message({
          message: "请填写入职时间",
          type: "warning"
        });
        return;
      }
      if (!this.curStaff.DepartmentId || this.curStaff.DepartmentId == "") {
        that.$message({
          message: "请选择所属部门",
          type: "warning"
        });
        return;
      }
      // if (!this.curStaff.DutyId || this.curStaff.DutyId == "") {
      //   this.$message({
      //     message: "请选择职务",
      //     type: "warning"
      //   });
      //   return;
      // }

      let type = "add";
      if (this.curStaff.UserId && this.curStaff.UserId != "") {
        type = "update";
      }
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/AddBranchUser`,
        data: {
          UserName: this.curStaff.UserName,
          HeadImgUrl: this.curStaff.ImgUrl,
          UserRealName: this.curStaff.RealName,
          Phone: this.curStaff.Phone,
          RZTime: this.curStaff.AddTime,
          DepartmentId: this.curStaff.DepartmentId,
          DutyId: this.curStaff.DutyId,
          IsAdmin: this.curStaff.IsAdmin,
          Type: type,
          SearchUserId: this.curStaff.UserId,
          BranchId: getkevalue().branchid
        },
        success(res) {
          if (res.data.status) {
            that.getMyBranchUserList();
            that.showAddDig = false;
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
     * 删除员工
     */
    deleteMyUserInfo() {
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/DeleteMyUserInfo`,
        data: {
          UserId: this.curStaff.UserId
        },
        success(res) {
          if (res.data.status) {
            that.getMyBranchUserList();
            that.showDeletwDig = false;
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
     * 获取当前店铺的权限列表
     */
    getBranchPermission() {
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchPermission`,
        data: { BranchId: getkevalue().branchid },
        success(res) {
          if (res.data.status) {
            this.authList = res.data.data;
            this.authList.forEach(auth => {
              auth.checkAll = false;
              auth.checkList = [];
            });
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
          SearchUserId: this.curStaff.UserId
        },
        success(res) {
          if (res.data.status) {
            that.checkList = [];
            that.userAuthList = res.data.data;
            if (res.data.data && res.data.data.length > 0) {
              res.data.data.forEach(auth => {
                that.checkList.push(auth.MenuId);
              });
              this.authList.forEach(auth => {
                auth.checkList = auth.ChildPermissionModelList.filter(p =>
                  this.userAuthList.find(ua => p.ChildPermissionId == ua.MenuId)
                ).map(m => {
                  return m.ChildPermissionId;
                });
                console.log("111", auth.checkList);
                auth.checkAll =
                  auth.checkList.length == auth.ChildPermissionModelList.length;
              });
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
     * 新增或者移除菜单权限
     */
    updateBranchUserPermission(auth) {
      let isChecked = false;
      let UserMenuId = "";
      if (this.userAuthList.find(ua => ua.MenuId == auth.ChildPermissionId)) {
        UserMenuId = this.userAuthList.find(
          ua => ua.MenuId == auth.ChildPermissionId
        ).UserMenuId;
      }
      if (this.checkList.find(a => a == auth.ChildPermissionId)) {
        isChecked = true;
      }
      let that = this;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/UpdateBranchUserPermission`,
        data: {
          BranchId: getkevalue().branchid,
          SearchUserId: this.curStaff.UserId,
          Type: isChecked ? "add" : "delete",
          ChildPermissionId: auth.ChildPermissionId,
          UserMenuId: UserMenuId
        },
        success(res) {
          if (res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            that.getBranchUserPermission();
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
     * 获取新增编辑基本信息修改金额权限
     */
    getBranchUserUpdateBasicInfoPermission() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchUserUpdateBasicInfoPermission`,
        data: {
          SearchUserId: this.curStaff.UserId
        },
        success(res) {
          if (res.data.status) {
            this.otherAuth = [];
            if (res.data.data.IsCanUpdateBasicInfo) {
              this.otherAuth.push("Basic");
            }
            if (res.data.data.IsCanUpdateAmountInfo) {
              this.otherAuth.push("Amount");
            }
             if (res.data.data.IsCanUpdateEquipment) {
              this.otherAuth.push("Equip");
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
     * 新增编辑基本信息修改金额权限
     */
    updateBranchUserUpdateBasicInfoPermission() {
      let isCanUpdateBasicInfo =
        this.otherAuth.findIndex(a => a == "Basic") > -1;
      let isCanUpdateAmountInfo =
        this.otherAuth.findIndex(a => a == "Amount") > -1;
      let isCanUpdateEquipment =
        this.otherAuth.findIndex(a => a == "Equip") > -1;
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/UpdateBranchUserUpdateBasicInfoPermission`,
        data: {
          SearchUserId: this.curStaff.UserId,
          IsCanUpdateBasicInfo: isCanUpdateBasicInfo,
          IsCanUpdateAmountInfo: isCanUpdateAmountInfo,
          IsCanUpdateEquipment: isCanUpdateEquipment
        },
        success(res) {
          if (res.data.status) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getBranchUserUpdateBasicInfoPermission();
          } else {
            this.$message.error(res.data.msg);
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
.user-content {
  height: 90%;
  margin: 5px 48px 20px 48px;
}
.div-search {
  width: 415px;
  height: 12.97%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

>>> .div-search .el-input__inner {
  width: 200px;
  height: 32px;
  line-height: 32px;
  padding-left: 11px;
  border: 1px solid rgba(221, 221, 221, 1);
  font-size: 15px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  border-radius: 4px;
}

.div-search .el-input {
  width: 200px;
}

>>> .div-search .el-button {
  width: 64px !important;
  height: 32px;
  padding: 0;
  margin: auto;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  background: rgba(89, 150, 248, 1);
  border-radius: 5px;
}

.button-add {
  background: transparent !important;
  color: #5996f8 !important;
  margin-left: 66px !important;
  border: 1px solid rgba(89, 150, 248, 1);
}
/*树形控件相关*/
.div-tree {
  max-height: 87%;
  overflow-y: auto;
}

.department-name {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: rgba(76, 76, 76, 1);
  line-height: 26px;
}

.staffName-list {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #222222;
  line-height: 26px;
  margin-left: 30px;
}

.rootNode {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: rgba(76, 76, 76, 1);
  line-height: 30px;
}
.user-children {
  display: flex;
}
.user-info {
  width: 70px;
  margin-right: 54px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.user-info span {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(34, 34, 34, 1);
  line-height: 28px;
}

.staff-post {
  color: #ff0000 !important;
}

.staff-bold {
  font-weight: bold !important;
  color: #5996f8 !important;
}

.user-info img {
  max-width: 70px;
  max-height: 70px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

/*弹出框样式*/
.popover-main {
  padding: 15px 0;
  border: 1px solid rgba(154, 182, 228, 1);
  border-radius: 5px;
}

.popover-main span {
  width: 96px;
  height: 38px;
  display: inline-block;
  background: transparent;
  color: #4c4c4c;
  margin-left: 2px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
}

.popover-main span:hover {
  background: #ebf1fb;
  color: #5996f8;
}

/*弹出窗 新增用户*/
.addDig-main {
  width: 445px;
  margin: 50px auto 0;
}
.staff-img {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.staff-img img {
  border-radius: 50%;
  max-width: 90px;
  max-height: 90px;
  width: 90px;
  height: 90px;
  cursor: pointer;
}

.img-tip {
  font-size: 14px;
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-top: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  cursor: pointer;
}

.staff-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px;
  margin-top: 40px;
}

.form-item {
  display: flex;
  justify-content: space-between;
}

.user-content .el-button {
  width: 96px;
  height: 34px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
  margin: 0 auto;
}

.staff-button {
  height: 85px;
  display: flex;
  align-items: flex-end;
  float: right;
}

.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}

/*删除弹窗*/
.delete-tip {
  margin-left: 88px;
  margin-top: 35px;
}

.delete-tip1 {
  width: 100%;
  display: inline-block;
  font-size: 22px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(76, 76, 76, 1);
}
.delete-tip2 {
  width: 380px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
  margin-top: 28px;
}

.delete-bottom {
  margin-top: 39px;
  margin-right: 62px;
  float: right;
}

/*权限弹窗*/
.authority-main {
  width: 740px;
  max-height: 525px;
  min-height: 200px;
  margin: 45px auto;
  overflow-y: auto;
}

.authority-title {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: rgba(76, 76, 76, 1);
}
.authority-list {
  margin-bottom: 59px;
}

.authority-main > div:last-child {
  margin-bottom: 0px;
}
>>> .el-popover,
>>> .el-popper {
  margin: 0 !important;
  padding: 0 !important;
  min-width: 102px !important;
}
>>> .popover-main + .popper__arrow {
  border-right-color: rgba(154, 182, 228, 1) !important;
}
/*新增用户 弹窗input*/
>>> .form-item .el-input__inner,
>>> .form-item .el-input {
  width: 200px;
}
</style>

<!--无scoped 覆盖框架默认样式-->
<style lang="scss">
.user-content .el-tree-node__content {
  height: auto !important;
  background: transparent !important;
  padding: 13px 20px 13px 45px;
}
.operate-popover {
  margin: 0 !important;
  padding: 0 !important;
  min-width: 102px !important;
}
.popover-main + .popper__arrow {
  border-right-color: rgba(154, 182, 228, 1) !important;
}
.iconStr {
  background-image: url("/static/img/setting/tree1.png");
}
.iconStr2 {
  background-image: url("/static/img/setting/tree2.png");
}

/*弹窗样式*/
.add-dialog {
  width: 652px;
  height: 595px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

/*删除提示弹窗*/
.delete-dialog {
  width: 500px;
  height: 300px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

/*权限弹窗*/
.authority-dialog {
  width: 882px;
  height: 660px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

/*弹窗公共样式*/
.add-dialog .el-dialog__header,
.delete-dialog .el-dialog__header,
.authority-dialog .el-dialog__header {
  padding-top: 35px;
}
.add-dialog .el-dialog__title,
.delete-dialog .el-dialog__title,
.authority-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.add-dialog .el-dialog__body {
  padding: 0px !important;
  height: 495px;
}
.delete-dialog .el-dialog__body,
.authority-dialog .el-dialog__body {
  padding: 0px !important;
}

.add-dialog .el-dialog__headerbtn,
.authority-dialog .el-dialog__headerbtn,
.delete-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*权限弹窗 复选样式*/
.authority-item {
  margin-left: 30px;
}

.authority-list .el-checkbox {
  margin: 0px 0 0 30px;
  width: 145px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}
.authority-item .el-checkbox {
  margin: 30px 0 0 30px;
  width: 145px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}

.authority-list .el-checkbox__inner {
  width: 21px;
  height: 21px;
  border-radius: 50%;
}

.authority-dialog .el-checkbox__inner::after {
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  content: "";
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 11px;
  left: 5px;
  position: absolute;
  top: 1px;
  -webkit-transform: rotate(45deg) scaleY(0);
  transform: rotate(45deg) scaleY(0);
  width: 6px;
  transform-origin: center;
}

/*设置页面弹窗居中*/
.user-content > .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>

