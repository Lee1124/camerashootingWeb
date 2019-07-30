<template>
  <ul>
    <li v-for="(item,index) in Switch.switchlist" @click="handlerSwitch(item,index)">
      <img v-if="item.start" src="../../../static/img/caiwu/1.png" alt="">
      <img v-else src="../../../static/img/caiwu/0.png" alt="">
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
    export default {
        name: "StateSwitch",
        props:{
          Switch:{
            type:Object,
            default:function(){
              return {}
            }
          }
        },
      methods:{
        //  当前选择
        handlerSwitch(row,index){
          let arr = this.Switch.switchlist
          for(let i = 0; i < arr.length;i++){
            if(index == 0 && i == 0){
              arr[i].start = !arr[i].start
              setTimeout(()=>{
                if(arr[0].start){
                  arr.filter(res=> res.start = true)
                }else{
                  arr.filter(res=> res.start = false)
                }
              })
            }else{
              i == index? arr[i].start = true : arr[i].start = false
            }
          }
          this.Switch.callback(row,index)
        }
      }
    }
</script>

<style scoped>
  ul{
    display: flex;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 48px;
    background: #fff;
  }
  ul li{
    font-size:15px;
    margin: 0 20px;
    text-align: center;
    line-height: 65px;
    height: 55px;
    padding-bottom: 14px;
    cursor: pointer;
  }
  img{
    position: relative;
    top: 5px;
  }
</style>
