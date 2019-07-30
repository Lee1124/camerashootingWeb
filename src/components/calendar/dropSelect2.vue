<template>
  <div id="dropSelect">
    <el-select v-model="value1" @change="changeVal1" popper-class="calendarOption" placeholder="请选择">
      <el-option
        v-for="item in option1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <el-select v-model="value2" @change="changeVal2" popper-class="calendarOption" placeholder="请选择">
      <el-option
        v-for="item in option2"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
    option1: [{label: '全部类型', value: 0}],
    value1: 0,
    option2: [{label: '全部人员', value: 0}],
    value2: 0,
  };
  /*方法*/
  let myMethods = {
    changeVal1(val) {
      this.value2=0;
      let parentData = this.$parent.$parent.$parent.workTipList;
      this.$parent.$parent.$parent.workTipFilterList = [];
      if (val == 0) {
        this.$parent.$parent.$parent.workTipFilterList = parentData;
      } else {
        let searchVal = '';
        this.option1.forEach(item => {
          if (item.value == val) {
            searchVal = item.label;
          }
        });
        let parentNewData = parentData.filter(item => item.PageType.indexOf(searchVal) != -1);
        this.$parent.$parent.$parent.workTipFilterList = parentNewData;
      }
    },
    changeVal2(val) {
      this.value1=0;
      let parentData = this.$parent.$parent.$parent.workTipList;
      if (val == 0) {
        this.$parent.$parent.$parent.workTipFilterList = parentData;
      } else {
        let searchList = [];
        this.option2.forEach(item => {
          if (item.value == val) {
            searchList = item.SearchList;
          }
        });
        let parentNewData = parentData.filter(item => searchList.find(item2 => item.OrderId == item2.OrderId));
        this.$parent.$parent.$parent.workTipFilterList = parentNewData;
      }
    }
  };
  export default {
    name: "dropSelect",
    props: {
      'dropSelectObj.option1': {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {

    },
  }
</script>

<style scoped>

</style>
