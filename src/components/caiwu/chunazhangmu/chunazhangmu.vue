<!--出纳账目图片上传组件-->
<template>
  <el-dialog
      title="上传图片"
      :visible.sync="dialogImg.dialogVisible"
      width="520px">

    <div class="commonScroll commonScrolls" style="height: 500px">
      <div  style="height: 100%;width: 100%;box-sizing: border-box;padding-top: 12px;">
        <div  style="margin-right: 20px;width:126px; height:90px;margin-bottom: 20px;float:left;">
          <img style="cursor: pointer" title="上传图片" @click="handlerImgUpdete()" src="../../../../static/img/caiwu/defultUpImg.png" width="126" height="90" alt="">
        </div>
        <div v-for="(item,index) in Imglist" :key="index" style="float:left;width:126px; height:90px;margin-right: 20px;margin-bottom: 20px;position: relative">
          <img style="max-height: 90px;max-width: 126px" :src="item.path" alt="">
          <i class="detel" @click="handlerDetel(index,item)"  title="删除图片">
            <img src="../../../../static/img/caiwu/detel.png" style="width: 12px;position: relative;
    left: -1px;" alt="">
          </i>
        </div>
      </div>
    </div>
      <span slot="footer" class="dialog-footer">
      <el-button class="btn-1" style="border: none;" @click="dialogImg.dialogVisible = false">取 消</el-button>
      <el-button type="primary" style="width: 102px;" @click="handlerDetermine()">确 定</el-button>
      <input multiple type="file" ref="file" style="display: none;" @change="handlerImgChange()" />
    </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "chunazhangmu",
        props:{
          dialogImg:{
            type:Object,
            default:() => {}
          }
        },
      data(){
        return {
          Imglist:[],                   //显示图片集合
        }
      },
      methods:{
        //  触发file
        handlerImgUpdete(){
          this.$refs.file.click()
        },
        // 选择文件
        handlerImgChange(){
          let file = event.target.files
          for(let i = 0; i < file.length; i++){
            this.$parent.FILE_ARRY.push(file[i])
          }
          this.handlerBase64(this.$parent.FILE_ARRY)
        },
        // 处理base64 显示
        handlerBase64(file){
          this.Imglist = []
          this.$ImgFileBase64({
            list:file,
            callback(res){
             this.Imglist.push(res)
            }
          })
        },
        //删除上传
        handlerDetel(index,row){
          let arr = this.$parent.FILE_ARRY
          this.Imglist = []
          arr.forEach((res,i) =>{
            if(row.index == i){
              arr.splice(i,1)
            }
          })
          this.handlerBase64(arr)
        },
        handlerDetelImg(){
          this.$parent.FILE_ARRY = []
          this.Imglist = []
        },
        //确定上传
        handlerDetermine(){
          this.dialogImg.callblack({
            callback:this.handlerDetelImg
          })
        }
      }
    }
</script>

<style scoped>
.btn-1:hover{
  background: transparent !important;
  color: #4c4c4c !important;
}
  /deep/ .el-dialog__body{
    padding: 30px 40px !important;
  }
  .commonScrolls{
    overflow: hidden;
    overflow-y: auto;
  }
.commonScrolls::-webkit-scrollbar{
  width: 0px;
  height: 3px;
  background: #E7EEF9;
  -webkit-border-radius: 1px;
  -moz-border-radius: 1px;
  border-radius: 1px;
}
.detel{
  width: 23px;
  height: 23px;
  position: absolute;
  right: -5.555555px;
  top: -11.55555px;
  border-radius: 50%;
  background-color: #5996F8;
  cursor: pointer;
  text-align: center;
  line-height: 23px
}
</style>
