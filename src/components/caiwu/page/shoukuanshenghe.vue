<!--收款审核-->
<template>
  <div>
    <tables ref="DataInit"></tables>
  </div>
</template>

<script>
  import tables from '../../tool/ShouKuanShengHeTable'
    export default {
        name: "shoukuanshenghe",
        components:{tables},
        props:['data'],
        methods:{
          //表格初始化
          handlerInit(total,data){
            this.$refs.DataInit.handlerInit(total,data)
          }
        }
    }
</script>

<style scoped>

</style>
