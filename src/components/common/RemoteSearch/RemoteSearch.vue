<!--联想搜索-->
<template>
  <el-select
    v-model="option.value"
    filterable
    remote
    reserve-keyword
    placeholder="输入4位婚期选择"
    :remote-method="remoteMethod"
    :loading="loading"
  @change="handlerchange">
    <el-option
      v-for="item in option.options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
    export default {
        name: "RemoteSearch",
        props:{
          option:{
            type:Object,
            default: function () {
              return new Object()
            }
          }
        },
      data(){
          return {
            loading: false,
          }
      },
      methods:{
        //  远程搜索
        remoteMethod(query){
          if(query == '' || query.length <= 3){
            return
          }
          this.$Axios({
            method:'GET',
            url:this.option.url,
            data:{
              [this.option.key]:query
            },
            success(res){
              this.option.callblack(res)
            },
            error(err){
              console.log(err)
            }
          });
        },
        handlerchange(row){
          this.option.options.map(res =>{
            if(row == res.value){
              this.option.label = res.label
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
