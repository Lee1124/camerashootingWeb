<!--通用input输入框  height：32px  width:根据父级宽度而定
统一回调组件上回调 @changeInputText-->

<template>
  <div id="commonInput">
    <el-input
      :placeholder="inputPlaceholderText"
      v-model="inputValue"
      @change="changeInputText"
      @blur="inputBlur"
      :readonly="isReadonly"
      clearable>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "Input",
    props: ['inputPlaceholderText','isReadonly'],
    methods: {
      changeInputText(val) {
        this.$emit('changeInputText', val);
      },
      inputBlur(val){
        this.$emit('inputBlur', this.inputValue);
      }
    },
    mounted() {
    },
    created() {
    },
    data() {
      return {
        inputValue: '',
      };
    }
  }
</script>

<style scoped>
  #commonInput {
    height: 100%;
  }
  >>> .el-input {
    height: 100%;
  }
  >>> .el-input__inner {
    height: 100%;
    line-height: inherit;
    color: #4C4C4C;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  >>> .el-input__inner::-webkit-input-placeholder {
    color: #BBBBBB;
  }

  >>> .el-input__inner:focus {
    border: 1px solid #9AB6E4;
  }
  >>>  .el-input__suffix {
    top: 40%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
