<template>
  <div id="sideNav">
    <div class="hd">
      <div class="logoBox">
        <img :src="this.$store.state.branchLog">
      </div>
      <!--<div class="title"><span style="font-weight: 700">- </span>管理系统</div>-->
    </div>

    <div class="nav">
      <ul>
        <template v-for="(items,index) in navData">
          <li :class="{liIsSelected:items.isSelected}" @mouseenter="liMouseEnter(items)"
              @mouseleave="liMouseLeave(items)" @click="selectThis(items)">
            <div class="spanBox">
              <span class="icon" v-show="!items.isEnter"
                    :style="'background: url('+items.url1+') no-repeat center center;'"></span>
              <span class="icon" v-show="items.isEnter"
                    :style="'background: url('+items.url2+') no-repeat center center;'"></span>
              <span v-text="items.name" :class="[{isSelectedText:items.isEnter}]"></span>
            </div>
            <span class="arrow" v-show="items.isSelected"></span>
          </li>
        </template>
      </ul>
    </div>

  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    navData: [
      {
        name: '首页',
        url1: './static/img/common/home1.png',
        url2: './static/img/common/home2.png',
        isSelected: true,
        isEnter: true,
        path: '/homePage',
        no:1
      },
      {
        name: '订单',
        url1: './static/img/common/order1.png',
        url2: './static/img/common/order2.png',
        isSelected: false,
        isEnter: false,
        path: '/orderManage',
        no:2
      },
      {
        name: '设备',
        url1: './static/img/common/shebei1.png',
        url2: './static/img/common/shebei2.png',
        isSelected: false,
        isEnter: false,
        path: '/deviceHome',
        no:3
      },
      {
        name: '财务',
        url1: './static/img/common/price1.png',
        url2: './static/img/common/price2.png',
        isSelected: false,
        isEnter: false,
        path: '/caiwu',
        no:4
      },
      {
        name: '统计',
        url1: './static/img/common/tj1.png',
        url2: './static/img/common/tj2.png',
        isSelected: false,
        isEnter: false,
        path: '/deviceHome',
        no:5
      },
      {
        name: '设置',
        url1: './static/img/common/set1.png',
        url2: './static/img/common/set2.png',
        isSelected: false,
        isEnter: false,
        path:'/settingHome',
        no:6
      },
    ],
  };
  /*方法*/
  let myMethods = {
    //鼠标移入
    liMouseEnter(itemObj) {
      itemObj.isEnter = true;
    },
    //鼠标移出
    liMouseLeave(itemObj) {
      if (!itemObj.isSelected) {
        itemObj.isEnter = false;
      }
    },
    //选择当前
    selectThis(itemObj) {
      this.navData.forEach((item, index, arr) => {
        arr[index].isSelected = false;
        arr[index].isEnter = false;
      });
      itemObj.isSelected = true;
      itemObj.isEnter = true;
      this.$router.push({path: itemObj.path+'?no='+itemObj.no})
      // console.log(itemObj.path)
      if (itemObj.path=='/orderManage'){//如果点击菜单返回列表页
        this.$parent.$parent.$parent.$refs.routerView.isShowOrderDetailsPage=false;
      }
    },
    //判断路由
    getRouter(){
      let $path=this.$route.path;
      this.navData.forEach((item,index,arr)=>{
        arr[index].isSelected = false;
        arr[index].isEnter = false;
        if ($path.indexOf(arr[index].path)!=-1){
          arr[index].isSelected = true;
          arr[index].isEnter = true;
        }
      })
    }
  };
  export default {
    name: "sideNav",
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
      this.getRouter();
    },

  }
</script>

<style scoped lang="scss">
  $width1: 81%;
  $margin1: 0 auto;

  #sideNav {
    height: 100%;
    padding: 25px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .logoBox {
    max-height: 150px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .logoBox img {
    /*width: 100%;*/
    max-height: 150px;
    max-width: 100%;
  }

  .hd {
    height: 20%;
  }

  .hd .title {
    padding: 20px 35px;
    width: $width1;
    margin: $margin1;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: right;
    font-size: 19px;
    color: #82868F;
  }

  .nav {
    height: 72%;
    margin-top: 28%;
  }

  .nav ul {
    height: 100%;
    overflow-y: auto;
  }

  .nav ul li {
    height: 12.5%;
    position: relative;
    font-size: 17px;
    color: #FFFFFF;
    transition: all .2s;
    cursor: pointer;
  }

  .nav ul li:hover {
    background: rgba(255, 255, 255, .1);
  }

  .nav ul li .spanBox {
    position: absolute;
    top: 50%;
    left: 48%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
  }

  .nav ul li .spanBox .icon {
    width: 34px;
    height: 34px;
    display: inline-block;
    background-size: cover !important;
    margin-right: 16px;
  }

  .nav ul li .arrow {
    width: 9px;
    height: 15px;
    display: inline-block;
    background: url("../../../../static/img/common/jt.png") no-repeat center center;
    position: absolute;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .nav ul li.liIsSelected {
    background: rgba(255, 255, 255, .1);
  }

  .nav ul li .isSelectedText {
    color: #5996F8;
    font-weight: 700;
  }


</style>
