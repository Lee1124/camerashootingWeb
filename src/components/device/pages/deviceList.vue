<template>
  <div class="device-main">
    <div class="device-search">
      <div class="search-input">
        <el-input placeholder="输入设备查询" size="small" v-model="searchText" class="input-with-select">
          <div class="search-div" slot="append" @click="getAllTypeList">
            <img src="static\img\common\search.png" />
          </div>
        </el-input>
      </div>
      <div class="search-class commonScrollStyle">
        <el-collapse @change="collapseChange">
          <el-collapse-item v-for="(devType,index) in devPTypeList" :key="index" :name="devType.id">
            <template slot="title">
              <i v-if="isOpen(devType)" class="el-icon-arrow-up collapse-icon"></i>
              <i v-else class="el-icon-arrow-down collapse-icon"></i>
              {{devType.name}}
            </template>
            <div
              class="device-item"
              v-for="device in devType.deviceItemList"
              @click="selectDevType(device)"
            >
              <i class="el-icon-edit icon-style" @click="showEditDevType(device)"></i>
              <span
                :class="device.id==curDevType.id?'device-active':''"
              >{{device.name}}({{device.count}})</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-button class="add-btn" @click="showAddDevType">新增设备类型</el-button>
    </div>
    <div class="device-list">
      <div class="list-title">
        <span
          v-if="this.curDevType.id && this.curDevType.id != ''"
          class="devType-name"
        >{{curDevType.name}}({{curDevType.count}})</span>
        <span v-else class="devType-name">请选择设备类型进行筛选</span>
        <el-button class="add-device" @click="showAddDeviceDig">添加</el-button>
      </div>
      <div class="device-table" ref="tableBox" v-loading="devIsLodding">
        <noData msg="暂无数据" v-if="deviceData.length==0"></noData>
        <el-table
          :data="deviceData"
          stripe
          border
          style="width: 100%"
          :max-height="tableHeight"
          :header-row-class-name="headerClassName"
          :row-class-name="rowClassName"
        >
          <el-table-column prop="code" label="编号" min-width="20"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="35"></el-table-column>
          <el-table-column prop="state" label="当前状态" min-width="22">
            <template slot-scope="scope">
              <span :style="scope.row.state=='1'?'color:red':''">{{scope.row.state=='1'?'不可用':'可用'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" min-width="30.5">
            <template slot-scope="scope">
              <span class="table-span span-report" @click="showDamageDeviceDig(scope.row)">报损</span>
              <span class="table-span span-look" @click="showLookDeviceDig(scope.row)">查看</span>
              <span class="table-span span-use" @click="showUseDig(scope.row)">查看使用情况</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div
        v-if="false"
        style="position: relative;bottom: -10px;left: 0px;right: 0;width:100%"
        class="clearfloat"
      >
        <el-pagination
          background
          layout="total,prev, pager, next"
          :hide-on-single-page="true"
          :total="deviceData.length "
          :page-size="10"
          @current-change="selectDevType(curDevType)"
          :current-page="currentPge"
        ></el-pagination>
      </div>
    </div>
    <!--删除提示弹窗-->
    <deleleDig
      :showDeleteDig="showDeleteDig"
      :dataClass="deleteTypeName"
      :dataName="deleteName"
      :tipText="tipText"
      @closeDeleteDig="closeDeleteDig"
      @confirmDelete="confirmDelete"
    ></deleleDig>

    <!--添加编辑设备类型弹窗-->
    <addDevTypeDig
      :showAddDig="showAddDig"
      :curDevType="newDevType"
      :isEdit="isEdit"
      @closeAddDevTypeDig="showAddDig=false"
      @saveDevType="saveDevType"
      @deleteDevType="showDeteleDevType"
    ></addDevTypeDig>

    <!--添加编辑设备弹窗-->
    <addDeviceDig
      :showAddDig="showAddDevDig"
      :curDevice="curDevice"
      :isEdit="isEdit"
      :devTypeList="devTypeList"
      @closeAddDeviceDig="cancelEditDevice"
      @saveDevice="saveDevice"
      @deleteDevice="showDeteleDevice"
    ></addDeviceDig>

    <!--查看设备弹窗-->
    <lookDeviceDig
      :showLookDevDig="showLookDevDig"
      :curDevice="lookDevice"
      :devTypeList="devTypeList"
      @closeLookDeviceDig="showLookDevDig=false"
      @showDeviceDig="showEditDeviceDig(curDevice)"
    ></lookDeviceDig>

    <!--设备报损-->
    <damageDeviceDig
      :showDamageDig="showDamageDig"
      :curDamage="curDamage"
      @closeDamageDeviceDig="showDamageDig=false"
    ></damageDeviceDig>

    <!--设备使用清单-->
    <useListDig
      :showUseListDig="showUseListDig"
      :curDevice="curDevice"
      @closeUseListDelDig="showUseListDig=false"
    ></useListDig>
  </div>
</template>

<script>
import deleleDig from "../components/deleteTipDig"; //删除提示弹框
import addDevTypeDig from "../components/addDevTypeDig"; //添加、编辑设备类型弹框
import addDeviceDig from "../components/addDeviceDig"; //添加、编辑设备弹框
import lookDeviceDig from "../components/lookDeviceDig"; //查看设备弹框
import damageDeviceDig from "../components/damageDeviceDig"; //查看设备弹框
import useListDig from "../components/useListDig"; //设备使用清单
export default {
  components: {
    deleleDig,
    addDevTypeDig,
    addDeviceDig,
    lookDeviceDig,
    damageDeviceDig,
    useListDig
  },
  data() {
    return {
      searchText: "",
      devPTypeList: [], //设备基类列表
      devTypeList: [], //设备类型列表
      openDevType: [], //打开的设备基类型
      deviceData: [], //设备列表
      showDeleteDig: false,
      showAddDig: false,
      showAddDevDig: false, //是否显示新增、编辑设备弹窗
      showLookDevDig: false, //是否显示查看设备弹窗
      showDamageDig: false, //是否显示设备报损弹窗
      showUseListDig: false, //是否显示使用清单弹窗
      devIsLodding: true, //数据是否加载中
      curDamage: { devName: "", orderCode: "", damageRemark: "" },
      curDevType: {
        pid: "",
        name: "",
        remark: ""
      },
      newDevType: {}, //新增、编辑弹窗使用
      curDevice: {},
      lookDevice: {},
      isEdit: false,
      deleteType: "devType", //devType(设备类型) device(设备) 删除的对象类型
      deleteTypeName: "",
      deleteName: "删除",
      tipText: "",
      tableHeight: "530",
      tableBoxHeight: "",
      currentPge: 1 //当前页码
    };
  },
  created() {
    this.loadResize();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDomHeight();
      }, 1);
    });
  },
  mounted() {
    this.getAllTypeList();
  },
  watch: {
    searchText(val) {
      if (val == "") {
        this.getAllTypeList();
      }
    }
  },
  methods: {
    loadResize() {
      let that = this;
      $(window).resize(() => {
        that.getDomHeight();
      });
    },
    //获取元素高度
    getDomHeight() {
      this.tableBoxHeight = $(this.$refs.tableBox).height();
      this.tableHeight = this.tableBoxHeight;
    },
    /**
     * 展开的设备类型
     */
    collapseChange(openArray) {
      this.openDevType = openArray;
    },
    /**
     * 列表是否展开
     */
    isOpen(type) {
      let devType = this.openDevType.find(dev => dev == type.id);
      if (devType) {
        return true;
      }
      return false;
    },
    /**
     * 表格自定义样式
     */
    headerClassName({ row, rowIndex }) {
      return "hotel-header";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) {
        return "hotel-row hotel-row2";
      } else {
        return "hotel-row hotel-row1";
      }
    },
    /**
     * 确认保存设备类型
     */
    saveDevType() {
      if (this.isEdit) {
        this.equiTypeUpdate();
      } else {
        this.insertEquiType();
      }
    },
    /**
     * 确认保存设备
     */
    saveDevice(deleteImgList) {
      if (!this.curDevice.equitype || this.curDevice.equitype == "") {
        this.$message({
          message: "设备类型不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.curDevice.name || this.curDevice.name == "") {
        this.$message({
          message: "设备名称不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.curDevice.code || this.curDevice.code == "") {
        this.$message({
          message: "设备编号不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.curDevice.buytime || this.curDevice.buytime == "") {
        this.$message({
          message: "购买日期不能为空",
          type: "warning"
        });
        return;
      }
      // if (!this.curDevice.useprice || this.curDevice.useprice == "") {
      //   this.$message({
      //     message: "使用价格不能为空",
      //     type: "warning"
      //   });
      //   return;
      // }
      if (!this.validateMoney(this.curDevice.useprice, true)) {
        this.$message({
          message: "使用价格格式不正确",
          type: "warning"
        });
        return;
      }

      // if (!this.curDevice.remark || this.curDevice.remark == "") {
      //   this.$message({
      //     message: "设备说明不能为空",
      //     type: "warning"
      //   });
      //   return;
      // }
      if (this.isEdit) {
        this.updateEquiInfo(deleteImgList);
      } else {
        this.insEquiInfo();
      }
    },
    /**
     * 取消编辑设备
     */
    cancelEditDevice() {
      this.deleteImgList = [];
      this.showAddDevDig = false;
      if (this.isEdit) {
        this.showLookDevDig = true;
      }
    },
    /**
     * 确认删除操作
     */
    confirmDelete() {
      if (this.deleteType == "device") {
        //删除设备操作
        this.delEquiInfo();
      } else if (this.deleteType == "devType") {
        //删除设备类型操作
        this.deleteEquiType();
      }
    },
    /**
     * 取消删除操作
     */
    closeDeleteDig() {
      this.showDeleteDig = false;
      if (this.deleteType == "device") {
        //取消删除设备操作
        this.showAddDevDig = true;
      } else if (this.deleteType == "devType") {
        //删除设备类型操作
        this.showAddDig = true;
      }
    },
    /**
     * 选择设备类型
     */
    selectDevType(devType) {
      this.curDevType = clone(devType);
      this.getEquiInfoList();
    },

    // ****************弹窗相关操作****************

    /**
     * 关闭弹窗(所有)
     */
    handleClose(done) {
      done();
    },
    /**
     * 打开新增设备类型弹窗
     */
    showAddDevType() {
      this.getBranchUserUpdateBasicInfoPermission().then(res => {
        if (!res) {
          this.$message({
            message: "您没有权限操作,请联系管理员",
            type: "warning"
          });
          return;
        }
        this.isEdit = false;
        this.newDevType = {};
        this.showAddDig = true;
      });
    },
    /**
     * 打开编辑设备类型弹窗
     */
    showEditDevType(device) {
      this.getBranchUserUpdateBasicInfoPermission().then(res => {
        if (!res) {
          this.$message({
            message: "您没有权限操作,请联系管理员",
            type: "warning"
          });
          return;
        }
        this.isEdit = true;
        this.newDevType = clone(device);
        this.showAddDig = true;
      });
    },
    /**
     * 打开删除设备类型提示弹窗
     *
     */
    showDeteleDevType() {
      this.deleteTypeName = "是否确定删除该设备类型";
      this.deleteType = "devType";
      this.tipText = `包含"${this.curDevType.name}"里的所有设备`;
      this.showAddDig = false;
      this.showDeleteDig = true;
    },
    /**
     * 打开新增设备弹窗
     */
    showAddDeviceDig() {
      this.getBranchUserUpdateBasicInfoPermission().then(res => {
        if (!res) {
          this.$message({
            message: "您没有权限操作,请联系管理员",
            type: "warning"
          });
          return;
        }
        this.isEdit = false;
        this.curDevice = {};
        if (this.curDevType.id && this.curDevType.id != "") {
          this.curDevice.equitype = this.curDevType.id;
        }
        this.curDevice.imgList = [];
        this.showAddDevDig = true;
      });
    },
    /**
     * 打开编辑设备弹窗
     */
    showEditDeviceDig(device) {
      this.getBranchUserUpdateBasicInfoPermission().then(res => {
        if (!res) {
          this.$message({
            message: "您没有权限操作,请联系管理员",
            type: "warning"
          });
          return;
        }
        this.getEquiImgs(device.id).then(res => {
          this.isEdit = true;
          this.curDevice = clone(device);
          this.curDevice.imgList = res.data;
          this.showLookDevDig = false;
          this.showAddDevDig = true;
        });
      });
    },
    /**
     * 打开删除设备提示弹窗
     *
     */
    showDeteleDevice() {
      this.deleteTypeName = "是否确定删除该设备";
      this.deleteType = "device";
      this.tipText = `"${this.curDevice.name}"设备删除后如遇到问题，请及时联系管理员`;
      this.showAddDevDig = false;
      this.showDeleteDig = true;
    },
    /**
     * 显示查看设备弹窗
     */
    showLookDeviceDig(device) {
      this.getEquiImgs(device.id).then(res => {
        this.curDevice = clone(device);
        this.curDevice.imgList = res.data;
        this.lookDevice = clone(this.curDevice);
        this.getDevTypeName(device.equitype).then(r => {
          this.lookDevice.typeName = r.data.name;
          this.showLookDevDig = true;
        });
      });
    },
    /**
     * 显示设备报损弹窗
     */
    showDamageDeviceDig(device) {
      this.curDevice = clone(device);
      this.curDamage = {
        devId: device.id,
        devName: device.name,
        orderCode: "",
        damageRemark: "",
        imgList: []
      };
      this.showDamageDig = true;
    },
    /**
     * 显示设备使用清单弹窗
     */
    showUseDig(device) {
      this.showUseListDig = true;
      this.curDevice = clone(device);
    },

    // ****************API相关操作****************
    /**
     * 获取新增编辑基本信息修改金额权限
     */
    getBranchUserUpdateBasicInfoPermission() {
      return new Promise((resolve, reject) => {
        this.$Axios({
          method: "POST",
          url: `/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchUserUpdateBasicInfoPermission`,
          data: {
            SearchUserId: getkevalue().userid
          },
          success(res) {
            if (res.data.status) {
              resolve(res.data.data.IsCanUpdateEquipment);
            } else {
              this.$message.error(res.data.msg);
              resolve(false);
            }
          },
          error(err) {
            this.$message.error(err);
            resolve(false);
          }
        });
      });
    },
    /**
     * 获取所有基类下的设备类型
     */
    getAllTypeList() {
      this.getEquiBaseList().then(res => {
        this.devTypeList = [];
        this.devPTypeList.forEach(pType => {
          this.equiTypeList(pType);
        });
        this.getEquiInfoList();
      });
    },
    /**
     * 获取设备基类列表
     */
    getEquiBaseList() {
      let that = this;
      return new Promise((resolve, reject) => {
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiBaseList";
        this.$Axios({
          method: "GET",
          url: url,
          success(res) {
            if (res.status == 200) {
              that.devPTypeList = res.data;
              resolve(res);
            } else {
              reject(res);
              that.$message.error("查询设备基类列表失败");
            }
          },
          error(err) {
            reject(res);
          }
        });
      });
    },
    /**
     * 根据基类id获取设备类型列表(不单独调用 仅仅在获取全部时调用)
     */
    equiTypeList(pType) {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/EquiTypeList";
      this.$Axios({
        method: "POST",
        data: {
          baseid: pType.id,
          like: this.searchText
        },
        url: url,
        success(res) {
          if (res.status == 200) {
            pType.deviceItemList = res.data;
            res.data.forEach(device => {
              this.devTypeList.push(device);
            });
            //重新查询列表设备列表
          } else {
            that.$message.error("查询设备类型列表失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 添加设备类型
     */
    insertEquiType() {
      if (!this.newDevType.pid || this.newDevType.pid == "") {
        this.$message({
          message: "设备分类不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.newDevType.name || this.newDevType.name == "") {
        this.$message({
          message: "类型名称不能为空",
          type: "warning"
        });
        return;
      }
      //  if (!this.newDevType.remark || this.newDevType.remark == "") {
      //   this.$message({
      //     message: "类型说明不能为空",
      //     type: "warning"
      //   });
      //   return;
      // }
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsertEquiType";
      this.$Axios({
        method: "POST",
        data: {
          name: this.newDevType.name,
          remark: this.newDevType.remark,
          pid: this.newDevType.pid
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            //重新查询列表设备列表
            that.getAllTypeList();
            this.showAddDig = false;
          } else {
            that.$message.error("操作失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 修改设备类型
     */
    equiTypeUpdate() {
      if (!this.newDevType.pid || this.newDevType.pid == "") {
        this.$message({
          message: "设备分类不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.newDevType.name || this.newDevType.name == "") {
        this.$message({
          message: "类型名称不能为空",
          type: "warning"
        });
        return;
      }
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/EquiTypeUpdate";
      this.$Axios({
        method: "POST",
        data: {
          id: this.newDevType.id,
          name: this.newDevType.name,
          remark: this.newDevType.remark,
          pid: this.newDevType.pid
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            //重新查询列表设备列表
            that.getAllTypeList();
            this.showAddDig = false;
          } else {
            that.$message.error("操作失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 删除设备类型
     */
    deleteEquiType() {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/DeleteEquiType";
      this.$Axios({
        method: "GET",
        data: {
          id: this.curDevType.id
        },
        url: url,
        success(res) {
          if (res.status == 200) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            //重新查询设备类型列表
            that.getAllTypeList();
            that.showAddDig = false;
            that.showDeleteDig = false;
          } else {
            that.$message.error("操作失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 获取设备列表
     */
    getEquiInfoList() {
      let that = this;
      this.devIsLodding = true;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiInfoList";
      this.$Axios({
        method: "POST",
        data: {
          page: this.currentPge,
          size: 10000,
          typeid: this.curDevType.id,
          like: this.searchText
        },
        url: url,
        success(res) {
          that.devIsLodding = false;
          if (res.status == 200) {
            that.deviceData = res.data;
          } else {
            that.$message.error("查询失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 根据设备类型id查找设备类型
     */
    getDevTypeName(typeId) {
      if (!typeId) {
        return;
      }
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetTypeinfo";
        this.$Axios({
          method: "GET",
          data: {
            id: typeId
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              resolve(res);
            } else {
              that.$message.error("获取设备类型信息失败");
              resolve(res);
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 添加设备
     */
    insEquiInfo() {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsEquiInfo";
      this.$Axios({
        method: "POST",
        data: {
          typeid: this.curDevice.equitype,
          code: this.curDevice.code,
          name: this.curDevice.name,
          buytime: this.curDevice.buytime,
          useprice: this.curDevice.useprice,
          remark: this.curDevice.remark
        },
        url: url,
        success(res) {
          console.log("res", res);
          if (res.status == 200 && res.data.status) {
            //进行添加图片相关操作
            that.curDevice.id = res.data.id;
            if (that.curDevice.imgList.length > 0) {
              if (that.curDevice.imgList.filter(i => i.id == "").length == 1) {
                that.insEquiImg().then(() => {
                  that.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  if (that.curDevice.equitype == that.curDevType.id) {
                    that.getEquiInfoList();
                  }
                });
              }
              //多张图片添加操作
              else {
                that.insEquiImgs().then(() => {
                  that.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  if (that.curDevice.equitype == that.curDevType.id) {
                    that.getEquiInfoList();
                  }
                });
              }
            } else {
              that.$message({
                message: "操作成功",
                type: "success"
              });
            }

            that.showAddDevDig = false;
            if (that.curDevice.equitype == that.curDevType.id) {
              that.getEquiInfoList();
            }
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error(err) {
          that.$message.error(res.data.Message);
        }
      });
    },
    /**
     * 获取设备图片集合
     */
    getEquiImgs(devId) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiImgs";
        this.$Axios({
          method: "GET",
          data: {
            eid: devId
          },
          url: url,
          success(res) {
            if (res.status == 200) {
              resolve(res);
            } else {
              that.$message.error("获取设备图片失败");
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 添加单个图片到设备
     */
    insEquiImg() {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsEquiImg";
        this.$Axios({
          method: "POST",
          data: {
            eid: this.curDevice.id,
            filepath: this.curDevice.imgList.filter(i => i.id == "")[0].filepath
          },
          url: url,
          success(res) {
            if (res.status == 200 && res.data) {
              resolve(res);
            } else {
              that.$message.error("设备信息保存成功但图片保存失败");
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 添加多个图片到设备
     */
    insEquiImgs() {
      return new Promise((resolve, reject) => {
        let filepaths = "";
        this.curDevice.imgList
          .filter(i => i.id == "")
          .forEach(img => {
            filepaths = filepaths + img.filepath + ",";
          });
        filepaths = filepaths.substring(0, filepaths.length - 1);
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsEquiImgs";
        this.$Axios({
          method: "POST",
          data: {
            eid: this.curDevice.id,
            filepaths: filepaths
          },
          url: url,
          success(res) {
            if (res.status == 200 && res.data) {
              resolve(res);
            } else {
              that.$message.error("设备信息保存成功但图片保存失败");
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 删除设备图片
     */
    delEquiImg(imgId) {
      return new Promise((resolve, reject) => {
        let that = this;
        let url = "/xlapi/CameraManage/EquiManage/EquiBase/DelEquiImg";
        this.$Axios({
          method: "GET",
          data: {
            id: imgId
          },
          url: url,
          success(res) {
            if (res.status == 200 && res.data) {
              resolve(res);
            } else {
              that.$message.error("设备信息保存成功但图片删除失败");
            }
          },
          error(err) {
            that.$message.error("操作失败");
          }
        });
      });
    },
    /**
     * 修改设备
     */
    updateEquiInfo(deleteImgList) {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/UpdateEquiInfo";
      this.$Axios({
        method: "POST",
        data: {
          id: this.curDevice.id,
          typeid: this.curDevice.equitype,
          code: this.curDevice.code,
          name: this.curDevice.name,
          buytime: this.curDevice.buytime,
          useprice: this.curDevice.useprice,
          remark: this.curDevice.remark
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data.status) {
            if (that.curDevice.imgList.length > 0) {
              //单张图片添加操作
              if (that.curDevice.imgList.filter(i => i.id == "").length == 1) {
                that.insEquiImg().then(() => {
                  that.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  that.lookDevice = clone(that.curDevice);
                });
              }
              //多张图片添加操作
              else {
                that.insEquiImgs().then(() => {
                  that.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  that.lookDevice = clone(that.curDevice);
                });
              }
            }
            //移除图片操作
            deleteImgList.forEach(d => {
              that.delEquiImg(d);
            });
            that.$message({
              message: "信息保存成功",
              type: "success"
            });
            that.deleteImgList = [];
            that.showAddDevDig = false;
            that.lookDevice = clone(that.curDevice);
            that.showLookDevDig = true;
            that.getEquiInfoList();
          } else {
            that.$message.error("操作失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },
    /**
     * 删除设备
     */
    delEquiInfo() {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/DelEquiInfo";
      this.$Axios({
        method: "GET",
        data: {
          id: this.curDevice.id
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            //重新查询设备类型列表
            that.getAllTypeList();
            that.deleteImgList = [];
            that.showAddDevDig = false;
            that.showDeleteDig = false;
          } else {
            that.$message.error("操作失败");
          }
        },
        error(err) {
          that.$message.error("操作失败");
        }
      });
    },

    /**
     * 金额格式验证 小数两位
     * @param numberStr input
     * @param allowNull 是否允许为空
     */
    validateMoney(numberStr, allowNull = false) {
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (reg.test(numberStr)) return true;
      if (!numberStr || numberStr.length == 0) {
        return allowNull;
      }
      return false;
    },
    /**
     * 保存报损
     */
    saveDamage() {
      console.log("报损报损");
    }
  }
};
</script>

<style scoped>
@import "../../../../static/css/orderTableStyle.css";
.device-main {
  width: 92.59%;
  height: 79.34%;
  margin: 2.5% 0 0 2.9%;
  display: flex;
  justify-content: space-between;
}

.device-search {
  width: 17.72%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
}

.device-list {
  width: 78.79%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
}

/*搜索框*/
.search-input {
  width: 85.18%;
  font-size: 14px;
  color: #4c4c4c;
  margin: 23px auto 0;
}

.search-div {
  width: 40px;
  height: 24px;
  cursor: pointer;
  border-left: 1px solid #ddd;
}

.search-div img {
  margin-top: 4px;
}

/*可收缩列表*/
.search-class {
  width: 91.48%;
  height: 66.47%;
  max-height: 66.47%;
  overflow-y: auto;
  margin: 16.29% auto 14.81%;
}

.device-item {
  width: 100%;
  height: 51px;
  line-height: 51px;
  cursor: pointer;
  color: #1d213e;
  font-size: 14px;
  font-weight: 400;
  background: transparent;
}

.device-item:hover {
  color: #5996f8;
  background: #f0f4f9;
}
.device-item:hover .icon-style {
  display: inline;
}

.device-active {
  color: #5996f8;
  text-decoration: underline;
}

.collapse-icon {
  margin-right: 12px;
}

/*修改图标样式*/
.icon-style {
  font-size: 16px;
  color: #5996f8;
  margin-right: 30px;
  display: none;
}

.add-btn {
  width: 62.96% !important;
  height: 7.3%;
  border: 1px solid rgba(89, 150, 248, 1) !important;
  border-radius: 10px;
  font-size: 16px !important;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #5996f8 !important;
}

/*右侧列表*/
.list-title {
  width: 90%;
  height: 13.34%;
  display: flex;
  margin: auto;
  justify-content: space-between;
  align-items: center;
}

.devType-name {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #4c4c4c;
  line-height: 26px;
}

.add-device {
  width: 84px !important;
  height: 34px;
  background: #5996f8 !important;
  color: #fff !important;
  font-size: 14px !important;
  font-weight: 400;
  padding: 0px;
  border-radius: 5px !important;
}
/*表格区*/
.device-table {
  width: 90%;
  height: 77.94%;
  margin: auto;
  position: relative;
}
.table-span {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  cursor: pointer;
  text-decoration: underline;
}
.span-look {
  color: #ff6600;
  margin-right: 20px;
}
.span-report {
  color: #0acf00;
  margin-right: 20px;
}
.span-use {
  color: #5996f8;
}

>>> .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/*搜索框样式*/
>>> .search-input .el-input-group--append .el-input__inner {
  border-right-color: transparent;
}
>>> .search-input .el-input-group--append .el-input__inner:hover {
  border-right-color: #c0c4cc;
}
>>> .search-input .el-input-group--append .el-input__inner:focus {
  border-right-color: #409eff;
}

>>> .search-input .el-input-group__append {
  background: transparent;
  padding: 0;
}

/*可收缩面板*/
>>> .search-class .el-collapse-item__content {
  padding-bottom: 0px;
}

>>> .search-class .el-collapse-item__header {
  font-size: 15px;
  height: 65px;
  font-weight: 500;
  color: #808080;
  padding-left: 27px;
}
>>> .search-class .el-collapse-item__arrow {
  display: none;
}
/*表格样式*/
>>> .hotel-header {
  height: 46px !important;
  font-size: 14px !important;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #808080;
  text-align: center;
}
>>> .hotel-header th {
  text-align: center;
  background: #e5e5e5;
  padding: 0px;
}

>>> .hotel-row td {
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  border-right: 1px solid #ddd;
  padding: 0px;
}
>>> .hotel-row .cell {
  line-height: 46px;
}
>>> .hotel-row:hover > td {
  background: #f0f4fa !important;
  color: #5996f8 !important;
}
>>> .hotel-row1 td {
  background: #ffffff;
}

>>> .hotel-row2 td {
  background: #f0f0f0;
}
</style>

<style>
/*设置页面弹窗居中*/
.device-main .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>
