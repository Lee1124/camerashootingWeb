<template>
  <div id="dropMoreSelect">
    <div class="selectBox" @click.stop="show" :class="{'selectBox_selected':isShowListBox}">
      <span class="tips" v-if="tags.length==0">可多选附件项目</span>
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        @close="handleClose(tag)"
        :type="tag.type">
        {{tag.name}}
      </el-tag>
      <i class="el-icon-arrow-down downIcon" :class="{downIcon_selected:isShowListBox}"></i>
      <div class="myBox" v-if="isShowListBox">
        <div class="listBox">
          <div class="box commonScrollStyle">
            <template v-for="(item,index) in selectList">
              <p class="inner" :class="{inner_selected:item.isSelected}" @click.stop="selectThis(item)">
                {{item.name}}
                <span v-if="item.isSelected" class="yesIcon" style="color: #5596f8;">√</span>
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "dropMoreSelect",
    props:{
      selectList:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data() {
      return {
        tags: [],
        isShowListBox:false
      };
    },
    methods: {
      show(){
        this.isShowListBox=!this.isShowListBox;
      },
      handleClose(tag) {
        this.selectList.forEach(item => {
          if (item.id==tag.id) {
            item.isSelected=false;
          }
        });
        this.isSelectedTag();
      },
      selectThis(itemObj) {
        itemObj.isSelected = !itemObj.isSelected;
        this.isSelectedTag();
      },
      isSelectedTag() {
        this.tags = [];
        this.selectList.forEach(item => {
          if (item.isSelected) {
            this.tags.push(item)
          }
        });
        let changeTagsValueStr='';
        let ProjectAmount=0;
        this.tags.forEach(item=>{
          changeTagsValueStr+=item.id+',';
          ProjectAmount+=item.ProjectAmount
        });
        this.$emit('changeTagsValue',{strVal:changeTagsValueStr,ProjectAmount:ProjectAmount})
      }
    },
    created() {

    },
    mounted(){
      $('body').click(()=>{
        this.isShowListBox=false
      })
    },
    watch:{
      tags(val){

      }
    }
  }
</script>

<style scoped>
  #dropMoreSelect {
    width: 100%;
  }

  .selectBox {
    height: 100%;
    min-height: 32px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    padding: 0 30px 0 8px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: all .2s;
  }

  .selectBox:hover {
    border-color: #9AB6E4;
  }

  .selectBox_selected {
    border-color: #9AB6E4;
  }

  .selectBox >>> .el-tag {
    height: 24px;
    line-height: 24px;
    margin: 3px 5px;
    background: #F0F4FA;
    color: #5996F8;
    border-radius: 2px;
  }

  .selectBox >>> .el-tag .el-icon-close {
    width: 14px;
    height: 14px;
    line-height: 15px;
    margin-top: -2px;
  }

  .tips {
    color: #BBB;
    font-size: 14px;
    position: absolute;
    left: 16px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .downIcon {
    color: #C0C4CC;
    font-size: 14px;
    position: absolute;
    right: 8px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    transition: all .2s;
  }

  .downIcon_selected {
    -webkit-transform: translateY(-50%) rotate(180deg);
    -moz-transform: translateY(-50%) rotate(180deg);
    -ms-transform: translateY(-50%) rotate(180deg);
    -o-transform: translateY(-50%) rotate(180deg);
    transform: translateY(-50%) rotate(180deg);
  }

  .myBox {
    position: absolute;
    height: 0;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .listBox {
    position: absolute;
    margin-top: 10px;
    left: 0;
    width: 100%;
    max-height: 150px;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
    background-color: #FFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 999;
    padding: 10px 0;
  }

  .listBox .box {
    overflow: auto;
    max-height: 130px;
  }

  .listBox::before {
    content: '';
    width: 10px;
    height: 10px;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    border: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 0;
    border-right: 0;
    background: #fff;
    color: #fff;
    position: absolute;
    top: -6px;
    left: 20px;
  }

  .inner {
    height: 32px;
    line-height: 32px;
    transition: all .2s;
    padding: 0 10px;
    position: relative;
  }

  .inner:hover {
    background: #F5F7FA;
  }

  .inner_selected {
    background: #F5F7FA;
    color: #5596f8;
  }

  .yesIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
