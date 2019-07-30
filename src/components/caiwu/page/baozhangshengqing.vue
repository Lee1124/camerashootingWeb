<!--我的报账申请-->
<template>
  <div>
    <tables ref="DataInit"></tables>
  </div>
</template>

<script>
  import tables from '../../tool/WobaozhangshengqingTableform'
    export default {
      name: "baozhangshengqing",
      props:['data'],
      components:{
        tables
      },
      data(){
        return{
          dataAll:[]
        }
      },
      methods:{
        //初始化数据
        handlerInit(total,form){
          this.$parent.ISaddBaoZhang.IsEedIt = true
          let data = this.data.data.list.filter((res,i)=>{
            res.index = i;
            res.childrenData = [];
            return res
          })
          this.$refs.DataInit.handlerInit(data,this.data,total,form.ramount)
        }
      },
    }
</script>

<style scoped>

</style>
