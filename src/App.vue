<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name:'App',
    components:{
    },
    created(){
      document.title='管理中心';
      console.log("当前版本","201907191424");
    }
  }
</script>

<style scoped>
  #app {
    height: 100%;
    min-width: 1350px;
    min-height: 625px;
  }

  html,body,#app{
    height: 100%;
  }

  body .el-table th.gutter{
    display: table-cell!important;
  }

  body .el-table colgroup.gutter{
    display: table-cell!important;
  }

</style>
