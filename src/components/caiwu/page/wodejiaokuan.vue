<!--我的交款-->
<template>
  <div>
    <tables ref="DataInit" ></tables>
    <MyAdd :diaLog="diaLog" v-if="diaLog.dialogVisible"></MyAdd>
  </div>
</template>

<script>
  import tables from '../../tool/WoDeJiaokuanTable'
  import MyAdd from '../wodejiaokuan/wodejiaokuan'
    export default {
        name: "wodejiaokuan",
        props:['data'],
        components:{
          tables,MyAdd
        },
        data(){
          return {
            diaLog:{
              dialogVisible:false
            },
          }
        },
        methods:{
          //初始化数据
          handlerInit(total,form){
            let data = this.data.data.filter((res,i)=>{
              res.index = i;
              res.childrenData = [];
              return res
            })
            this.$refs.DataInit.handlerInit(data,this.data,total,form.sum)
          },
        //  添加我的交款
          handlerWoAdd(){
            this.diaLog.dialogVisible = true
            this.diaLog.actiontype = 'add'
            this.diaLog.title = '添加我的交款'
          }
        }

    }
</script>

<style scoped>
  /deep/ .el-dialog__wrapper{
    position: fixed !important;
  }
</style>
