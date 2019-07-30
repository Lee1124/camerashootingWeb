import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // 共同维护的一个状态，state里面可以是很多个全局状态
  state:{
    ImgType:1,
    scrollLefts:0,
    defaultTime:'2018/01/01',
    branchLog:'',
    /*金额明细*/
    priceIsAdd:false,
    isShowOrderDetailsPage:false,
    showOrderDetailsDiaLog:false,
    orderNews:{

    },
    showDiaLogObj:{
      showHotelOrHQDetailsDiaLog:false
    },
    IsCanUpdateBasicInfo:false,//是否有编辑基本信息权限
    IsCanUpdateAmountInfo:false,//是否有编辑金额权限
    orderType:0,//订单类型
  },
  // 获取数据并渲染
  getters:{

  },
  // 处理数据的唯一途径，state的改变或赋值只能在这里
  mutations: {
    increment(state,ImgType){
      state.ImgType = ImgType;
    },
    scrollLeft(state,scrollLefts){
      state.scrollLefts = scrollLefts;
    },
    keepBranchLog(state,val){
      state.branchLog = val;
    },
    keepPriceIsAdd(state,val){
      state.priceIsAdd = val;
    },
    keepIsShowOrderDetailsPage(state,val){
      state.isShowOrderDetailsPage = val;
    },
    keepShowOrderDetailsDiaLog(state,val){
      state.showOrderDetailsDiaLog = val;
    },
    keepOrderNews(state,obj){
      state.orderNews = obj;
    },
    keepShowDiaLogObj(state,obj){
      state.showDiaLogObj = obj;
    },
    keepIsCanUpdateBasicInfo(state,val){
      state.IsCanUpdateBasicInfo = val;
    },
    keepIsCanUpdateAmountInfo(state,val){
      state.IsCanUpdateAmountInfo = val;
    },
    keepOrderType(state,val){
      state.orderType = val;
    }

  },
  // 数据的异步操作
  actions:{

  }
});

