<template>
  <div id="dropSelect">
    <el-select :placeholder="dropSelect1Placeholder" filterable  @clear="clearVal" @visible-change="selectBoxVisible($event)" :disabled="isReadonly" clearable  v-model="dropSelectValue" @change="changeDropSelect">
      <el-option
        v-for="item in options"
        :key="item.value"
        popper-class="dropSelect"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "dropSelect",
    props: ['options','dropSelect1Placeholder','isReadonly'],
    methods: {
      changeDropSelect(val){
        setTimeout(()=>{
          this.$emit('changeDropSelect',this.dropSelectObj)
        })
      },
      selectBoxVisible(e){
        this.$emit('selectBoxVisible',e);
      },
      clearVal(){
        this.$emit('clearDropVal',this.dropSelectValue);
      }
    },
    mounted() {

    },
    created() {
    },
    data() {
      return {
        dropSelectValue:'',//双向选择的id
        dropSelectObj:[],//保存双向选择的对象
      };
    },
    watch:{
      dropSelectValue(val){
        this.options.forEach((item,index,arr)=>{
          if (arr[index].value==this.dropSelectValue){
            this.dropSelectObj=[arr[index]];
          }
        });
      }
    }
  }
</script>

<style scoped>
  #dropSelect {
    height: 100%;
  }
  >>> .el-select {
    height: 100%;
    width: 100%;
  }
  >>> .el-input {
    height: 100%;
  }
  >>> .el-input__inner {
    font-size: 14px;
    color: #4C4C4C;
    height: 100%;
  }
  >>> .el-input.is-disabled .el-input__inner {
    background: #fff;
    cursor: default;
  }
  >>> .el-input__inner::-webkit-input-placeholder {
    color: #BBB;
  }
  >>> .el-select .el-input .el-select__caret {
    line-height: inherit;
  }
  >>> .el-select .el-input.is-focus .el-input__inner {
    border: 1px solid #9AB6E4;
  }

  .el-select-dropdown__item.selected {
    color: #5996F8;
  }

</style>
