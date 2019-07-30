<!--首页日历-->
<template>
  <div id="calendar">
    <div id="format" ref="format">
      <el-container>
        <!--左侧-->
        <el-aside>
          <div class="workBox" ref="workBox">
            <div class="title noSelect" :style="{paddingTop:workBoxTitlePaddingTop}">
              <span>工作提醒</span>
              <i>-</i>
              <span v-text="monthAndDay"></span>
              <i>-</i>
              <span v-text="weekValueNoChange"></span>
            </div>
            <div class="select noSelect">
              <dropSelect2 ref="dropSelect2Ref"></dropSelect2>
            </div>
            <div class="list" :style="{height:workBoxListHeight}" v-loading="isShowLoading1"
                 element-loading-text="正在加载...">
              <noData msg="暂无数据" v-show="workTipFilterList.length==0"></noData>
              <ul>
                <template v-for="(items,index) in workTipFilterList">
                  <li :title="items.OrderTitle" @click="openOrderDetails(items)" style="cursor:pointer;">
                    <i :style="{backgroundColor:items.color}"></i>
                    <span v-cloak>[{{items.PageType}}] {{items.OrderTitle}}</span>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </el-aside>
        <!--右侧-->
        <el-main v-loading="isShowLoading" element-loading-text="正在加载...">
          <div class="change-format-btn noSelect" ref="changeCalendarBtn" :style="{top:changeCalendarBtnTop}">
            <button @click="btn1Event" class="btn1"></button>
            <span class="checkedDayValue" v-cloak>{{showCheckedDay}}</span>
            <button @click="btn2Event" class="btn2"></button>
            <div class="datePicker">
              <el-date-picker
                popper-class="monthValuePicker"
                v-model="monthValue"
                type="month"
                placeholder="选择月"
                title='选择月份'
                @change="changeMonth">
              </el-date-picker>
            </div>
          </div>
          <div class="format-box" ref="calendarBox">
            <ul class="format-head noSelect">
              <li>星期一</li>
              <li>星期二</li>
              <li>星期三</li>
              <li>星期四</li>
              <li>星期五</li>
              <li>星期六</li>
              <li>星期日</li>
            </ul>
            <calendarContent class="noSelect" ref="calendar_swiper" :checkDate="current_day" @on-change="changeIndex">
              <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
                <ul v-for="(week,weekindex) in month" :key="weekindex">
                  <li style="cursor: pointer;" v-for="(day,dayindex) in week"
                      @click="chooseDay(day.year,day.month,day.day,day.othermonth,day.mode,day.thing)">
                    <div class="week-day"
                         :class="{ischecked:checkedDay==day.date,othermonth:day.othermonth,istoday:day.istoday}">
              <span style="display:inline-flex;" class="daySpanBox" :class="{todaySpanBox:day.istoday}">
  				    	<i class="day">{{day.day}}</i>
  				    	<i :style="{color:day.nongli.textColor}">{{day.nongli.old_str}}</i>
              </span>
                      <div class="thing commonScrollStyle">
                        <a
                          :class="{haveThing:day.thing.length!=0,colorBlue:thing.color=='#5996F8',colorRed:thing.color=='#F5574E'}"
                          v-for="thing in day.thing">
                          <!--<template v-for="(thingInner,index) in thing.OrderList">-->
                          <!--<p class="orderTitle">-->
                          <!--{{thingInner.OrderTitle}}-->
                          <!--</p>-->
                          <!--</template>-->
                          <p :title="'当天有'+thing.length+'个订单'">
                            <span v-if="thing.length!=0" :class="{todaySpanColor:day.istoday}">{{thing.length}}</span>
                          </p>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </calendarContent>
          </div>
        </el-main>
      </el-container>
    </div>

    <orderDetailsDiaLog :showOrderDetailsDiaLog="this.$store.state.showOrderDetailsDiaLog"
                        :orderList="orderList"></orderDetailsDiaLog>

    <!--订单详情页面-->
    <transition name="slide-fade">
      <div class="orderDetailsPage" v-if="this.$store.state.isShowOrderDetailsPage">
        <orderDetailsPage ref="orderDetailsPage" @closeOrderDetailsPage="closeOrderDetailsPage"
                          :isFormCalendar="isFormCalendar"></orderDetailsPage>
      </div>
    </transition>
  </div>
</template>

<script type="text/babel">
  import calendarContent from './swiper-monthorweek.vue'
  import format from '../../../static/lib/format'
  import orderDetailsDiaLog from '../calendar/checkedDayOrderDetailsDiaLog'
  import orderDetailsPage from '../orderManage/pages/orderManage-details';
  /*数据*/
  let dataObj = {
    isFormCalendar: true,
    orderDetailsRowObj: {},
    disp_date: new Date(),
    today: new Date(),
    current_day: new Date(),
    monthList: [],
    checkedDay: '0000-00-00',
    can_click: true,
    weekValue: '',
    monthAndDay: '',
    monthValue: '',
    changeCalendarBtnTop: '50px',
    workBoxTitlePaddingTop: '50px',
    workBoxListHeight: '450px',
    workTipList: [],
    workTipFilterList: [],
    calendarCt: [],
    isShowLoading: false,
    isShowLoading1: false,
    orderList: {
      list: []
    },
  };
  /*方法*/
  let myMethods = {
    /*打开详情*/
    openOrderDetails(itemObj){
      this.$store.commit('keepIsShowOrderDetailsPage',true);
      this.orderDetailsRowObj={OrderId:itemObj.OrderId};
    },
    /*关闭详情*/
    closeOrderDetailsPage() {
      this.$store.commit('keepIsShowOrderDetailsPage', false)
    },
    /*获取提醒列表*/
    getTipList() {
      this.isShowLoading1 = true;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraHomePageRemind';
      this.$Axios({
        method: 'POST',
        url: url,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.isShowLoading1 = false;
            res.data.data.forEach(item => {
              if (item.PageType == '待提交作品审核') {
                item.color = '#ff0000'
              } else if (item.PageType == '移交客户资料') {
                item.color = '#FFAE00'
              } else {
                item.color = '#A1A7B0'
              }
            });
            this.workTipList = res.data.data;
            this.workTipFilterList = res.data.data;
            if (res.data.searchTypeList.length != 0) {
              let newArr1 = [{label: '全部类型', value: 0}];
              res.data.searchTypeList.forEach((item, index, arr) => {
                newArr1.push({label: item, value: index + 1})
              });
              this.$refs.dropSelect2Ref.option1 = newArr1;
            } else {
              this.$refs.dropSelect2Ref.option1 = [{label: '暂无数据', value: 0}];
            }

            if (res.data.searchUserList.length != 0) {
              res.data.searchUserList.forEach(item => {
                item.label = item.UserName+'('+item.UserOrderCount+')';
                item.value = item.UserId;
              });
              res.data.searchUserList.unshift({label: '全部人员', value: 0})
              this.$refs.dropSelect2Ref.option2 = res.data.searchUserList;
            } else {
              this.$refs.dropSelect2Ref.option2 = [{label: '暂无数据', value: 0}];
            }

          }
        }
      })
    },
    /*获取数据*/
    getOrderNews() {
      let checkedDayArr = this.checkedDay.split('-');
      // console.log(checkedDayArr)
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraOrderCalendar';
      let data = {
        YearMonth: checkedDayArr[0] + '-' + checkedDayArr[1]
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.isShowLoading = false;
            res.data.data.forEach(item => {
              item.length = item.OrderList.length;
            });
            this.calendarCt = res.data.data;
            this.get3month();
          }
        }
      })
    },
    //选择月份
    changeMonth(val) {
      let selectTime = getFormatTime(val, '-');//选择的年月
      let num = MonthsBetw(this.checkedDay, selectTime);//计算显示的年月与选择的年月之间的月份
      this.changeIndex(num);//更新时间表
    },
    /*上一个月*/
    btn1Event() {
      this.changeIndex(-1);
    },
    /*下一个月*/
    btn2Event() {
      this.changeIndex(1);
    },
    /*根据某天处理订单列表的数据*/
    getOrderList(checkedDay) {
      let checkedDayList = checkedDay.split('-');
      this.orderList.checkedDay = checkedDayList[0] + '年' + checkedDayList[1] + '月' + checkedDayList[2] + '日 ' + this.weekValue.replace('周', '星期');
      let newArr = this.calendarCt.filter(item => item.OrderDay == parseInt(checkedDayList[2]));
      this.orderList.list = newArr[0].OrderList;
      this.orderList.orderCount = newArr[0].OrderList.length;
    },
    /*选择某天*/
    chooseDay(year, month, day, othermonth, mode, thing) {
      // 为了PC端点击事件和移动冲突
      if (!this.can_click) return;
      this.current_day = new Date(year, month, day);
      this.checkedDay = this.format(year, month, day);
      if (thing[0].length != 0) {
        this.$store.commit('keepShowOrderDetailsDiaLog', true);
      }
      if (othermonth && mode == 'month') {
        var _tmpdt = new Date(this.disp_date.getFullYear(), this.disp_date.getMonth() - othermonth, 0);
        var maxday = _tmpdt.getDate();
        var _day = maxday < day ? maxday : day;
        this.disp_date = new Date(year, month - othermonth, _day);
        this.changeIndex(othermonth, false, true)
      } else if (othermonth && mode == 'week') {
        this.disp_date = this.current_day
      } else {
        this.disp_date = this.current_day
      }
      this.getWeek(this.checkedDay);
      this.getOrderList(this.checkedDay);
    },
    format(year, month, day) {
      month++;
      month < 10 && (month = '0' + month);
      day < 10 && (day = '0' + day);
      return year + '-' + month + '-' + day;
    },
    getMonth(year, month) {  //创建单月历
      // console.log(year, month)
      var monthArr = [];
      var dt_first = new Date(year, month, 1); //每个月第一天
      var dt_last = new Date(year, month + 1, 0);  //每个月最后一天
      var monthLength = dt_last.getDate() - dt_first.getDate() + 1;
      var daylist = [];
      var space = (dt_first.getDay() - 1 + 7) % 7;  //月历前面空格
      // console.log(year, month)
      for (var i = -space; i < 36; i += 7) {
        var week = [];
        for (var j = 0; j < 7; j++) {
          let myThing = [];
          var day = i + j + 1;
          if (day > 0 && day <= monthLength) {
            if (month + 1 == this.checkedDay.split('-')[1]) {
              this.calendarCt.forEach((item, index, arr) => {
                if (arr[index].OrderDay == day) {
                  myThing.push(arr[index])
                }
              });
            }
            week.push({
              mode: 'month',
              day: day,
              year: year,
              month: month,
              date: this.format(year, month, day),
              //日历要显示的其他内容
              // thing: (day == 22 || day == 4) ? [{title: '婚纱拍摄', color: '#5996F8'}, {
              //   title: '交片',
              //   color: '#F5574E'
              // }] : [],
              thing: myThing,
              nongli: format.solar2lunar(year, month + 1, day),
              istoday: (this.today.getFullYear() == year && this.today.getMonth() == month && this.today.getDate() == day) ? true : false,
              ischecked: false
            });
            // console.log(year, month + 1, day)
            // console.log(format.solar2lunar(year, month + 1, day))
          } else {
            //其它月份
            //week.push({})
            var newdt = new Date(year, month, day);
            var _year = newdt.getFullYear();
            var _month = newdt.getMonth();
            var _day = newdt.getDate();
            week.push({
              mode: 'month',
              day: _day,
              year: _year,
              month: _month,
              date: this.format(year, month, day),
              nongli: format.solar2lunar(_year, _month + 1, _day),
              istoday: (this.today.getFullYear() == _year && this.today.getMonth() == _month && this.today.getDate() == _day) ? true : false,
              ischecked: false,
              othermonth: day <= 0 ? -1 : 1,
            })
          }
        }
        monthArr.push(week)
      }
      return monthArr
    },
    get3month() {
      var year = this.disp_date.getFullYear();
      var month = this.disp_date.getMonth();
      this.monthList = [];
      this.monthList.push(this.getMonth(year, month - 1));
      this.monthList.push(this.getMonth(year, month));
      this.monthList.push(this.getMonth(year, month + 1))
    },
    changeIndex(index, is_click = false) {
      if (index) {
        // console.log(this.disp_date.getMonth()+index)
        var _tmpdt = new Date(this.disp_date.getFullYear(), this.disp_date.getMonth() + index, 0);
        var maxday = _tmpdt.getDate();
        var _day = maxday < this.disp_date.getDate() ? maxday : this.disp_date.getDate();
        // console.log(_day);
        this.disp_date = new Date(this.disp_date.getFullYear(), this.disp_date.getMonth() + index, _day);
        if (!is_click) {
          this.checkedDay = this.format(this.disp_date.getFullYear(), this.disp_date.getMonth(), this.disp_date.getDate());
          // console.log(this.checkedDay)
          this.getWeek(this.checkedDay);
        }
        //console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
        // this.get3month();
        // console.log('move_change')
        // this.$refs.calendar_swiper.move_change()
        this.getOrderNews();
      }
    },
    //获取星期
    getWeek(today, val) {
      if (today == undefined || today == '') {
        today = getNowTime('-');
      }
      // console.log(today)
      this.clickToDay = today;
      let arrs = [];
      arrs = today.split('-'); //传入或输入日期，处理格式为 2016-12-5
      let weeks = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2]);
      weeks.getDay();//就是星期几啦
      let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      this.weekValue = weekday[weeks.getDay()];
      this.showCheckedDay = arrs[0] + '年' + arrs[1] + '月';
      if (val == 1) {
        this.weekValueNoChange = weekday[weeks.getDay()];
      }
    },
    //获取当天信息
    getToDay() {
      let nowTime = getNowTime('-');
      this.getWeek(nowTime, 1);
      let nowTimeArr = nowTime.split('-');
      this.monthAndDay = nowTimeArr[1] + '月' + nowTimeArr[2] + '日';
      this.checkedDay = nowTime;
    },
    //获取切换按钮的top位置
    getChangeCalendarBtnTop() {
      let bigHeight = $(this.$refs.format).outerHeight();
      let smallHeight = $(this.$refs.calendarBox).outerHeight();
      let changeCalendarBtnHeight = $(this.$refs.changeCalendarBtn).outerHeight();
      let workBoxHeight = $(this.$refs.workBox).outerHeight();
      this.changeCalendarBtnTop = ((bigHeight - smallHeight) / 2) - (changeCalendarBtnHeight / 1.2) + 'px';
      this.workBoxTitlePaddingTop = ((bigHeight - smallHeight) / 2) + (changeCalendarBtnHeight / 2) + 'px';
      this.workBoxListHeight = workBoxHeight * 0.6 + 'px';
    },
    //加载窗口缩放监听
    loadResize() {
      $(window).resize(() => {
        this.getChangeCalendarBtnTop();
      })
    }
  };
  export default {
    name: "format",
    data() {
      return dataObj;
    },
    components: {
      calendarContent,
      orderDetailsDiaLog,
      orderDetailsPage,
    },
    methods: myMethods,
    created() {
      this.showOrderDetailsDiaLog = false;
      this.disp_date = new Date();
      this.isShowLoading = true;
      this.loadResize();
      // this.get3month();
      this.getToDay();
      this.getWeek();
      this.getTipList();
    },
    mounted() {
      this.getChangeCalendarBtnTop();
      this.getOrderNews();
    },

  }
</script>

<style scoped>
  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    /*height: 0;*/
  }

  #noData {
    z-index: 999999;
  }

  #calendar {
    height: 100%;
    padding: 3.5% 7%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #format {
    height: 100%;
  }

  >>> .el-aside {
    width: 33% !important;
    overflow: hidden;
  }

  >>> .el-main {
    background: rgba(246, 246, 246, 0);
    box-shadow: 0 0 27px 0 rgba(0, 0, 0, 0.06);
    padding: 8% 5% 2%;
    position: relative;
  }

  /*=====左侧=====*/
  .workBox {
    height: 100%;
    padding: 0 10px;
    /*border: 1px solid red;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .workBox .title {
    text-align: left;
  }

  .workBox .title span {
    color: #808080;
    font-size: 20px;
  }

  .workBox .title i {
    vertical-align: 3px;
  }

  .workBox .title i:nth-of-type(1) {
    font-weight: 700;
    margin: 0 8px;
  }

  .workBox .title span:nth-of-type(1) {
    color: #333333;
    font-size: 28px;
    position: relative;
  }

  .workBox .title span:nth-of-type(2) {
    vertical-align: 1px;
  }

  .workBox .title span:nth-of-type(3) {
    vertical-align: 1px;
  }

  .workBox .title span:nth-of-type(1)::before {
    content: '';
    width: 34px;
    height: 6px;
    background: rgba(89, 150, 248, 1);
    position: absolute;
    bottom: -13px;
  }

  .workBox .select {
    margin: 10% 0 5.5%;
    text-align: left;
  }

  .workBox .select >>> .el-select {
    margin-right: 5px;
  }

  .workBox .select >>> .el-input__inner {
    width: 125px;
    height: 34px;
    border: 1px solid rgba(238, 238, 238, 1);
  }

  .workBox .select >>> .el-input__inner::-webkit-input-placeholder {
    color: #808080;
    font-size: 14px;
  }

  .workBox .select >>> .el-input__inner:hover {
    border: 1px solid rgba(154, 182, 228, 1);
  }

  .workBox .select >>> .el-select .el-input.is-focus .el-input__inner {
    border: 1px solid rgba(154, 182, 228, 1);
  }

  .workBox .select >>> .el-select .el-input.is-focus .el-select__caret {
    color: #9AB6E4;
  }

  .workBox .select >>> .el-select .el-input .el-select__caret {
    line-height: 34px;
  }

  .workBox .list {
    overflow: auto;
    width: 78%;
    min-width: 286px;
    position: relative;
  }

  .workBox .list li {
    width: 96.5%;
    height: 50px;
    padding: 0 25px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.07);
    border-radius: 3px;
    position: relative;
    line-height: 50px;
    color: #333333;
    font-size: 14px;
    text-align: left;
    margin-bottom: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .workBox .list li:last-of-type {
    margin-bottom: 0;
  }

  .workBox .list li i {
    width: 4px;
    height: 50px;
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .datePicker .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 170px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    opacity: 0;
    cursor: pointer;
  }

  .datePicker >>> .el-input--prefix .el-input__inner {
    cursor: pointer;
  }

  /*=====右侧=====*/
  .format-box {
    color: #fff;
    position: relative;
    height: 100%;
    z-index: 99;
  }

  .format-head {
    background: transparent;
    display: flex;
    height: 30px;
    line-height: 30px;
    color: #808080;
    font-size: 14px;
  }

  .format-head li {
    flex-grow: 1;
    text-align: center;
  }

  .swiper-item {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }

  .swiper-item:nth-child(1) {
    left: -100%;
  }

  .swiper-item:nth-child(2) {
    left: 0;
  }

  .swiper-item:nth-child(3) {
    left: 100%;
  }

  .month ul {
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 16%;
    min-height: 40px;
    border-right: 1px solid #eee;
  }

  .month li {
    flex: 1;
    flex-grow: 1;
    overflow: hidden;
    position: relative;
  }

  .week-day {
    /*position: relative;*/
    margin: auto;
    font-size: 12px;
    text-align: center;
    border: 0;
    line-height: 10px;
    overflow: hidden;
    border-top: 3px solid #F6F6F6;
    border-left: 3px solid #F6F6F6;
    z-index: 1;
    height: 140px;
    background: #fff;
    padding: 6% 3px;
    transition: all .2s;
  }

  .week-day:hover {
    background: #F2F2F2 !important;
  }

  .week-day i {
    display: inline-block;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    color: #808080;
    float: left;
    height: 22px;
    line-height: 22px;
  }

  .week-day i:nth-child(2) {
    margin-left: 2px;
  }

  .thing a {
    cursor: pointer;
    display: block;
    width: 100%;
    word-break: break-all;
    line-height: 16px;
    transform: scale(.95);
  }

  .thing {
    position: absolute;
    top: 52%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }

  .thing .haveThing {
    height: 100%;
    display: inline-block;
  }

  .thing p {

    width: 100%;
    height: 100%;
  }

  .thing p span {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #BBB;
    font-size: 22px;
    transition: all .2s;
  }

  @media (min-width:1400px)and(max-width: 1600px){
    .thing p span {
      font-size: 18px;
    }
  }
  @media (max-width:1400px){
    .thing p span {
      font-size: 14px;
    }
  }

  .month li:hover p span {
    color: #9fc4ff;
  }

  .orderTitle {
    color: #4C4C4C;
    padding: 3px 0 3px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }

  .orderTitle >>> .el-button {
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .orderTitle >>> .el-button span {
    background: red;
  }

  .orderTitle::before {
    content: '';
    width: 5px;
    height: 5px;
    position: absolute;
    background-color: #BBB;
    left: 0;
    border-radius: 50%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .othermonth i {
    color: #BBB;
  }

  .ischecked {
    background-color: #F2F2F2 !important;
  }

  /*.istoday {*/
  /*background: #fff !important;*/
  /*}*/

  .daySpanBox {
    height: 22px;
    padding: 0 8px;
    border-radius: 11px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: -15px;
    position: absolute;
    left: 25px;
  }

  .todaySpanBox {
    background: rgba(89, 150, 248, 1);
  }

  .todaySpanBox i {
    color: #fff !important;
  }

  .todaySpanColor {
    color: #9fc4ff !important;
  }

  .haveThing {
    text-align: left;
    color: #4C4C4C;
  }

  .colorBlue::before {
    background: #5996F8;
  }

  .colorRed::before {
    background: #F5574E;
  }

  /*切换按钮处*/
  .checkedDayValue {
    color: #333;
    font-size: 30px;
    margin: 0 10px;
  }

  .checkedDayValue::before {
    content: '';
    width: 34px;
    height: 6px;
    background: rgba(89, 150, 248, 1);
    position: absolute;
    bottom: -10px;
  }

  .change-format-btn {
    position: absolute;
    z-index: 999;
    /*background: #BB9860;*/
  }

  .change-format-btn button {
    outline: none;
    border: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    vertical-align: -2px;
    transition: all .2s;
  }

  .change-format-btn .btn1 {
    background: url("../../../static/img/left.png") no-repeat center center;
  }

  .change-format-btn .btn2 {
    background: url("../../../static/img/right.png") no-repeat center center;
  }

  .change-format-btn .btn1:hover {
    background: url("../../../static/img/left-hover.png") no-repeat center center;
  }

  .change-format-btn .btn2:hover {
    background: url("../../../static/img/right-hover.png") no-repeat center center;
  }


  .orderDetailsPage {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2998;
    background: #F6F6F6;
  }

</style>
