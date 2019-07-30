<!--菜单切换-->
<template>
  <ul>
    <li v-for="(item,index) in switchSet.menulist" v-show="item.show" style="font-size: 15px;color: #1D213E" :class="{lolor:item.start}" :key="index" @click="handleMenulist(item,index)">{{ item.name }}</li>
  </ul>
</template>

<script>
    export default {
        name: "MenuSwitching",
        props:{
          switchSet:{
            type:Object,
            default:function(){
              return {}
            }
          }
        },
      methods:{
        handleMenulist(row,index){
            this.switchSet.menulist.filter((cument,i)=> index == i? cument.start = true : cument.start = false )
            this.switchSet.callback(row,index)
        },
      //  权限设置
        handlerPermission(){
          this.$parent.PAGE_STRT = true
          this.$Axios({
            method:'POST',
            url:'/xlapi/CameraManage/CameraMenuManage/CameraMenu/GetChildMenuListByMenuName',
            data:{
              TypeName:'财务'
            },
            success(res){

              let data = res.data.data;
              let Menu_Data = this.$parent.switchSet.menulist
              data.forEach(a => {
                Menu_Data.forEach(b => {
                  if(a.MenuName == b.name ){
                    b.show = true
                  }
                })
              });
              let arr = []
              Menu_Data.forEach((res,index) =>{
                if(res.show){
                  arr.push(res)

                  this.$parent.switchSet.menulist[0].start = true
                  return
                }
              });

              if(arr.length > 0){
                this.handleMenulist(this.switchSet.menulist[arr[0].id],arr[0].id)
              }else{
                this.$parent.PAGE_STRT = false
              }

            },
            error(err){
              console.log(err)
            }
          });
        }
      },
      mounted(){

      },
      created(){
          this.handlerPermission()
      }
    }
</script>

<style scoped>
ul{
  display: flex;
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  padding: 25px 48px;
  background: #fff;
}
  ul li{
    font-size:15px;
    margin: 0 20px;
    text-align: center;
    line-height: 65px;
    height: 50px;
    padding-bottom: 10px;
    cursor: pointer;
  }
  .lolor{
    color:#5996F8 !important;
    border-bottom: 2px solid #5996F8;
  }
</style>
