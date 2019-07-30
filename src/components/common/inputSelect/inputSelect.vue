<!--高级搜索-->
<template>
  <div id="inputSearch">
    <div class="bigBox" id="bigBox">
      <div class="inputBox"><!--@keyup="searchNews($event)"-->
        <input type="text" id="inputSelect" @click.stop="fn" autocomplete="off" @keyup.enter="searchNews"
               v-model="searchText" @keyup="searchNo($event)"
               class="inputSelect" @focus="inputFocus($event)" @blur="inputBlur($event)"
               placeholder="请输入地址、酒店、客户、项目...">
        <div class="searchBtn" @click="searchNews"><!--@click="searchNews"-->
          <span></span>
          <img src="../../../../static/img/common/search.png" alt="搜索">
        </div>
        <div class="addInput commonScrollStyle" @click.stop="fn" v-show="isShowAddInput">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            @close="handleClose(tag)"
            :type="tag.type">
            {{tag.name}}
          </el-tag>
        </div>
      </div>
      <transition name="selectBox-slide-fade">
        <div id="selectBox" class="selectBox commonScrollStyle" @click.stop="fn" v-if="isShowSelectBox">
          <!--v-loading="loading"-->
          <ul class="listBox" @click.stop="fn">
            <template v-for="(items,index) in searchData">
              <li @click.stop="fn">
                <label @click.stop="fn" v-cloak>{{items.name}}</label>
                <div class="list" @click.stop="fn">
                  <template v-for="(items2,index2) in items.data">
                  <span class="tagSpan" :title="items2.name+'('+items2.num+')'" v-cloak @click.stop="selectThis(items,items2)"
                        :class="[{spanIsSelected:items2.isSelected}]" v-if="items2.num!=0">{{items2.name}}({{items2.num}})</span>
                  </template>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  //事件
  var myMethods = {
    fn() {
      if (this.isShowInputSearch) {
        this.isShowSelectBox = true;
      } else {
        this.isShowSelectBox = false;
      }
    },
    /*============change===========*/
    //选中当前
    selectThis(itemObj1, itemObj2) {
      itemObj2.isSelected = !itemObj2.isSelected;
      this.getIsSelectedTag();
      this.isAllNotSelected();
    },
    //获取选中的标签并加入数组中
    getIsSelectedTag() {
      this.tags = [];
      this.searchData.forEach((item, index, arr) => {
        arr[index].data.forEach((item2, index2, arr2) => {
          if (arr2[index2].isSelected) {
            this.tags.push(arr2[index2])
          }
        })
      });
      this.searchNews();
    },
    //判断是否全部未选
    isAllNotSelected() {
      if (this.tags.length == 0) {
        this.isShowAddInput = false;
      } else {
        this.isShowAddInput = true;
      }
    },

    //移除某标签
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      tag.isSelected = false;
      this.isAllNotSelected();
    },

    //获取光标显示
    inputFocus(e) {
      $(e.target).css('border', '1px solid #9AB6E4');
      if (this.isShowInputSearch) {
        this.isShowSelectBox = true;
        this.getOurOrderData();
      } else {
        this.isShowSelectBox = false;
      }
    },

    //获取我的订单中的数据并做处理
    getOurOrderData() {
      let data = this.$parent.$refs.ourOrderRouterView.tableData2.data;
      let data2 = this.$parent.$refs.ourOrderRouterView.tableData2;
      let willBack = [];//待回馈订单
      let PSArr = [];//待安排拍摄
      let HQArr = [];//待安排后期
      let PSHandoverArr = [];//拍摄待交接
      let HQMakeArr = [];//后期制作
      let willPassArr = [];//待审核
      let returnArr = [];//退回
      let willToKHArr = [];//待移交客户
      let orderSuccessArr = [];//订单完成
      data.forEach((item, index, arr) => {
        if (arr[index].OrderState == null || arr[index].OrderState == 0) {
          willBack.push(arr[index]);
        }
        if (arr[index].PSList.length == 0) {
          PSArr.push(arr[index]);
        }
        if (arr[index].HQList.length == 0) {
          HQArr.push(arr[index]);
        }
        if (arr[index].OrderState == '1') {
          PSHandoverArr.push(arr[index]);
        }
        if (arr[index].OrderState == '2') {
          HQMakeArr.push(arr[index]);
        }
        if (arr[index].OrderState == '3') {
          willPassArr.push(arr[index]);
        }
        if (arr[index].OrderState == '4') {
          returnArr.push(arr[index]);
        }
        if (arr[index].OrderState == '5') {
          willToKHArr.push(arr[index]);
        }
        if (arr[index].OrderState == '6') {
          orderSuccessArr.push(arr[index]);
        }
      });
      this.searchData[1].data[0] = {listId: 1, name: '待回馈订单', isSelected: false, type: '', num: willBack.length, id: 0};
      this.searchData[1].data[1] = {listId: 0, name: '待安排拍摄', isSelected: false, type: '', num: PSArr.length, id: -1};
      this.searchData[1].data[2] = {listId: 0, name: '待安排后期', isSelected: false, type: '', num: HQArr.length, id: -2};
      this.searchData[1].data[3] = {
        listId: 1,
        name: '拍摄待交接',
        isSelected: false,
        type: '',
        num: PSHandoverArr.length,
        id: 1
      };
      this.searchData[1].data[4] = {listId: 1, name: '后期制作', isSelected: false, type: '', num: HQMakeArr.length, id: 2};
      this.searchData[1].data[5] = {
        listId: 1,
        name: '待审核',
        isSelected: false,
        type: '',
        num: willPassArr.length,
        id: 3
      };
      this.searchData[1].data[6] = {listId: 1, name: '退回', isSelected: false, type: '', num: returnArr.length, id: 4};
      this.searchData[1].data[7] = {
        listId: 1,
        name: '待移交客户',
        isSelected: false,
        type: '',
        num: willToKHArr.length,
        id: 5
      };
      this.searchData[1].data[8] = {
        listId: 1,
        name: '订单完成',
        isSelected: false,
        type: '',
        num: orderSuccessArr.length,
        id: 6
      };

      if (!data2.AdvancedQueryModel.DDLXList){
        return false;
      }

      /*类型*/
      data2.AdvancedQueryModel.DDLXList.forEach((item, index, arr) => {
        arr[index].name = arr[index].QueryProjectName;
        arr[index].isSelected = false;
        arr[index].type = '';
        arr[index].num = arr[index].QueryProjectNum;
        arr[index].listId = -1;
      });
      this.searchData[0].data = data2.AdvancedQueryModel.DDLXList;

      /*项目*/
      data2.AdvancedQueryModel.XMList.forEach((item, index, arr) => {
        arr[index].name = arr[index].QueryProjectName;
        arr[index].isSelected = false;
        arr[index].type = '';
        arr[index].num = arr[index].QueryProjectNum;
        arr[index].listId = 2;
      });
      this.searchData[2].data = data2.AdvancedQueryModel.XMList;

      /*销售*/
      data2.AdvancedQueryModel.XSList.forEach((item, index, arr) => {
        arr[index].name = arr[index].QueryProjectName;
        arr[index].isSelected = false;
        arr[index].type = '';
        arr[index].num = arr[index].QueryProjectNum;
        arr[index].listId = 3;
      });
      this.searchData[3].data = data2.AdvancedQueryModel.XSList;
      /*拍摄*/
      data2.AdvancedQueryModel.PSList.forEach((item, index, arr) => {
        arr[index].name = arr[index].QueryProjectName;
        arr[index].isSelected = false;
        arr[index].type = '';
        arr[index].num = arr[index].QueryProjectNum;
        arr[index].listId = 4;
      });
      this.searchData[4].data = data2.AdvancedQueryModel.PSList;
    },


    //获取光标显示
    inputBlur(e) {
      $(e.target).css('border', '')
    },

    //点击空白处或除开搜索框处 隐藏高级搜索内容框
    loadEvent() {
      let that = this;
      $('body').on('click', e => {
        that.isShowSelectBox = false;
      })
    },
    /*============/change===========*/

    //关键词查询
    searchNews() {
      if (this.searchText == '') {
        this.searchTableData = [];
        // console.log(this.tags);
        this.tags.forEach((item, index, arr) => {
          if (arr[index].listId == 1) {//其余7种状态
            this.filterData(arr[index].id, arr[index].listId);
          } else if (arr[index].listId == 0) {//2种特殊状态
            this.filterData(arr[index].id, arr[index].listId);
          } else if (arr[index].listId == 2) {//项目
            this.filterData(arr[index].OrderIdList, arr[index].listId);
          } else if (arr[index].listId == 3) {//销售
            this.filterData(arr[index].OrderIdList, arr[index].listId);
          } else if (arr[index].listId == 4) {//拍摄
            this.filterData(arr[index].OrderIdList, arr[index].listId);
          } else if (arr[index].listId == -1) {//类型
            this.filterData(arr[index].OrderIdList, arr[index].listId);
          }
        })
      } else {
        this.filterData2(this.searchText);
      }
    },

    //关键词筛选
    filterData2(text) {
      let data = this.$parent.$refs.ourOrderRouterView.tableData2.data;
      let result = data.filter((item) => {
        if (item.HotelName.indexOf(text) != -1) {//酒店
          return item;
        } else if (item.CityName.indexOf(text) != -1) {//市区
          return item;
        } else if (item.WeddingName.indexOf(text) != -1) {//公司名称
          return item;
        } else if (item.CustomerName.indexOf(text) != -1) {//客户名称
          return item;
        } else if (item.ProjectName.indexOf(text) != -1) {//项目名称
          return item;
        }
      });
      this.searchTableData = result;
      this.$parent.$refs.ourOrderRouterView.tableData = this.searchTableData;
      this.$parent.$refs.ourOrderRouterView.tableArr = this.searchTableData;
    },

    //筛选数据
    filterData(obj, listId) {//obj:空或者0 待回馈订单  1拍摄待交接   2后期制作   3待审核  4退回   5待移交客户  6订单完成
      // let data=this.searchTableData;
      let data = this.$parent.$refs.ourOrderRouterView.tableData2.data;
      // console.log(data)
      if (listId == 1) {
        // console.log(obj)
        let result = data.filter((item) => {
          // console.log(item.OrderState)
          if (item.OrderState == obj) {
            return item;
          }
        });
        this.searchTableData = this.searchTableData.concat(result);
      } else if (listId == 0) {
        if (obj == -1) {
          let result = data.filter((item) => {
            if (item.PSList.length == 0) {
              return item;
            }
          });
          this.searchTableData = this.searchTableData.concat(result);
        } else if (obj == -2) {
          let result = data.filter((item) => {
            if (item.HQList.length == 0) {
              return item;
            }
          });
          this.searchTableData = this.searchTableData.concat(result);
        }
      } else if (listId == 2) {
        data.forEach((item, index, arr) => {
          obj.forEach((item2, index2, arr2) => {
            if (arr2[index2] == arr[index].OrderId) {
              this.searchTableData.push(arr[index]);
            }
          })
        });
      } else if (listId == 3) {
        data.forEach((item, index, arr) => {
          obj.forEach((item2, index2, arr2) => {
            if (arr2[index2] == arr[index].OrderId) {
              this.searchTableData.push(arr[index]);
            }
          })
        });
      } else if (listId == 4) {
        data.forEach((item, index, arr) => {
          obj.forEach((item2, index2, arr2) => {
            if (arr2[index2] == arr[index].OrderId) {
              this.searchTableData.push(arr[index]);
            }
          })
        });
      } else if (listId == -1) {
        // console.log(data)
        // console.log(obj)
        let newArr = data.filter(item => obj.find(item2 => item2 == item.OrderId))
        this.searchTableData=this.searchTableData.concat(newArr);
      }
      setTimeout(() => {
        this.sortFn();
      });
    },

    //JSON数据去重并排序
    sortFn() {
      this.searchTableData.sort(function (a, b) {
        return new Date(a.OrderDate).getTime() - new Date(b.OrderDate).getTime()
      });
      this.searchTableData = this.unique(this.searchTableData, 'OrderId');
      this.$parent.$refs.ourOrderRouterView.tableData = this.searchTableData;
    },
    //json数据去重
    unique(arr, attribute) {
      var new_arr = [];
      var json_arr = [];
      for (var i = 0; i < arr.length; i++) {
        if (new_arr.indexOf(arr[i][attribute]) == -1) {    //  -1代表没有找到
          new_arr.push(arr[i][attribute]);   //如果没有找到就把这个name放到arr里面，以便下次循环时用
          json_arr.push(arr[i]);
        } else {
        }
      }
      return json_arr;
    },

    //关键词为空
    searchNo(e) {
      if ($(e.target).val() == "") {
        this.$emit('searchNo', $(e.target).val())
      }

      if (e.keyCode == 13) {
        this.$emit('searchNews', this.searchText)
      }
    },
  };
  export default {
    name: "input_select",
    props: ['contentData', 'selectData', 'loading', 'isShowInputSearch'],
    created() {
      this.loadEvent();
    },
    data() {
      return {
        searchText: '',
        isShowSelectBox: false,
        isShowAddInput: false,
        searchTableData: [],
        tags: [
          // {name: '周杰伦（11）', type: ''},
          // {name: '吴建达', type: ''},
        ],
        //高级搜索内容数据
        searchData: [
          {
            name: '类型:',
            id: 0,
            data: []
          },
          {
            name: '状态:',
            id: 1,
            data: []
          },
          {
            name: '项目:',
            id: 2,
            data: [
              // {name: '哈哈哈哈12', isSelected: false, type: ''},
              // {name: '哈哈哈哈5', isSelected: false, type: ''},
              // {name: '哈哈哈哈77', isSelected: false, type: ''},
            ]
          },
          {
            name: '销售:',
            id: 3,
            data: []
          },
          {
            name: '拍摄:',
            id: 4,
            data: []
          },
        ]
      }
    },
    methods: myMethods,
    watch: {
      searchText(val) {
        this.isShowSelectBox = false;
        this.searchText = val;
        if (val == '') {
          this.$parent.$refs.ourOrderRouterView.tableData = this.$parent.$refs.ourOrderRouterView.tableData2.data;
          this.searchTableData = this.$parent.$refs.ourOrderRouterView.tableData;
          this.$parent.$refs.ourOrderRouterView.tableArr = this.$parent.$refs.ourOrderRouterView.tableData2.data;
        }
      },
      tags(val) {
        if (val.length == 0) {
          this.$parent.$refs.ourOrderRouterView.tableData = this.$parent.$refs.ourOrderRouterView.tableData2.data;
          if (this.$parent.$refs.ourOrderRouterView.tableData != undefined) {
            this.searchTableData = this.$parent.$refs.ourOrderRouterView.tableData;
          }
          this.isShowSelectBox = false;
          this.isShowAddInput = false;
        }
      },
      searchTableData(val) {
        // if (val.length == 0) {
        //   this.$parent.$refs.ourOrderRouterView.isShowNoData = true;
        // } else {
        //   this.$parent.$refs.ourOrderRouterView.tableArr = val;
        // }
        // console.log(this.$parent.$refs.ourOrderRouterView.tableData)
        // this.$parent.$refs.ourOrderRouterView.tableArr = val;
      }

    },
    mounted() {
      window.Vue = this;
      this.getIsSelectedTag();//初始化搜索状态1
      this.isAllNotSelected();//初始化搜索状态2
      this.searchTableData = this.$parent.$refs.ourOrderRouterView.tableData;
    },
    //自定义私有指令
    directives: {
      'borderStyle': function (el, binding) {
        el.style.border = '1px solid #9AB6E4'
      }
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  #inputSearch {
    padding: 0;
    height: 32px;
  }

  li {
    list-style: none;
  }

  .bigBox {
    position: absolute;
    height: 0;
    width: 0;
  }

  /*搜索框*/
  .inputBox {
    position: relative;
    width: 300px;
  }

  .inputSelect {
    width: 300px;
    height: 32px;
    border: 1px solid #DDD;
    border-radius: 4px;
    padding-left: 10px;
    box-sizing: border-box;
    outline: none;
  }

  .inputSelect::-webkit-input-placeholder {
    color: #BBB;
  }

  .searchBtn {
    width: 40px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  .searchBtn span {
    display: inline-block;
    height: 24px;
    width: 1px;
    background: #DDD;
    position: absolute;
    top: 50%;
    margin-top: -12px;
    left: 0;
  }

  .searchBtn img {
    margin-top: 8px;
  }

  /*高级搜索框*/
  .selectBox {
    width: 600px;
    height: 370px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    margin-top: 10px;
    overflow: auto;
    padding: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    z-index: 9999;
    background: #fff;
  }

  .addInput {
    width: 255px;
    height: 30px;
    position: absolute;
    top: 1px;
    left: 1px;
    background: #fff;
    border-radius: 4px;
    padding: 3px 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    text-align: left;
  }

  /*选项列表*/
  .listBox {
    /*background: pink;*/
  }

  .listBox li {
    text-align: left;
    margin-bottom: 5px;
  }

  .listBox li label {
    font-size: 14px;
    color: #AAAAAA;
  }

  .listBox li div.list {
    padding: 18px 0;
    font-size: 13px;
    color: #4C4C4C;
  }

  .listBox li div.list span {
    display: inline-block;
    padding: 5px 15px;
    cursor: pointer;
    transition: all .2s;
  }

  .listBox li div.list span:hover {
    background: rgba(178, 198, 231, .2);
    color: #5996F8;
  }

  .spanIsSelected {
    color: #5996F8;
  }

  /*==========标签卡拓展==========*/
  >>> .el-tag {
    height: 24px;
    line-height: 24px;
    margin-right: 10px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background: #F0F4FA;
    color: #5996F8;
    font-size: 14px;
    border: 0;
    padding: 0 8px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  >>> .el-tag:last-of-type {
    margin-right: 0;
  }

  >>> .el-tag .el-tag__close {
    color: #5996F8;
    line-height: 18px;
    margin-left: -5px;
  }

  >>> .el-tag .el-tag__close:hover {
    background: #dde1e7;
  }

  .listBox li div.list span.tagSpan {
    width: 136px;
    height: 28px;
    line-height: 28px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }

  /*======动画======*/
  .selectBox-slide-fade-enter-active, .selectBox-slide-fade-leave-active {
    transition: all .2s;
  }

  .selectBox-slide-fade-enter, .selectBox-slide-fade-leave-to {
    opacity: 0;
    height: 0;
  }

</style>
