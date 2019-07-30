<!--通用输入文本 宽高根据父级元素确定-->
<template>
  <div id="textArea">
    <textarea @blur="TextAreaBlur"  :readonly="isReadonly" v-model="textAreaText" name="textArea" class="textArea commonScrollStyle" :placeholder="textAreaPlaceholderText"></textarea>
  </div>
</template>

<script>

  /*方法*/
  let myMethods = {
    TextAreaBlur(){
      this.$emit('TextAreaBlur',this.textAreaText)
    }
  };
  export default {
    name: "textArea",
    props:['textAreaPlaceholderText','isReadonly'],
    data() {
      return {
        textAreaText:'',
      };
    },
    methods: myMethods,
    created() {

    },
  }
</script>

<style scoped>
  #textArea {
    height: 100%;
  }
  .textArea {
    width: 100%;
    height: 100%;
    border:1px solid rgba(221,221,221,1);
    border-radius:4px;
    resize: none;
    font-size: 14px;
    color: #4c4c4c;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .textArea::-webkit-input-placeholder {
    color: #BBBBBB;
    font-size: 14px;
  }
</style>
