<!--输入框  支持返回数据后搜索选择(一次性将数据返回完，支持筛选)-->
<template>
  <div id="inputSearch">
    <div class="inputBox">
      <input class="input" type="text" v-model="inputValue" :placeholder="inputSearchPlaceholder"
             @focus.stop="inputFocus" @click.stop="fn">
      <transition name="slide-fade">
        <div class="searchDataBox" @click.stop="fn" v-show="listData.length!=0&&isShowList">
          <ul class="commonScrollStyle" @click.stop="fn">
            <template v-for="(items,index) in listData">
              <li @click.stop="fn" class="createNewContent" v-if="items.id==-1" v-cloak>{{items.name}}<a
                class="void"
                @click.stop="createNewContent"
                href="javascript:void(0)">创建</a>
              </li>
              <li class="void" @click.stop="selectThis(items)" v-if="items.id!=-1" v-cloak>{{items.name}}</li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  /*方法*/
  let myMethods = {
    fn() {

    },
    //获取焦点
    inputFocus() {
      this.isShowList = true;
      this.$emit('inputFocus',{val:this.inputValue,type:'inputFocus'});//通过该方法进行数据请求
    },
    //创建
    createNewContent() {
      this.$emit('createNewContent');
    },
    //选择当前
    selectThis(itemsObj) {
      this.inputValue = itemsObj.name;
      this.isSelectedItemObj=[itemsObj];
      this.isShowList = false;
    },
    //请求远程数据
    loadListData(val) {

    },

    //初始化事件
    loadEvent() {
      let that = this;
      $('body').click((e) => {
        that.isShowList = false;
      })
    }
  };
  export default {
    name: "inputSearch",
    props: ['inputSearchPlaceholder','listData'],
    data() {
      return {
        inputValue: '',
        isShowList: false,
        isSelectedItemObj:[],//选择某选项保存的对象
      };
    },
    methods: myMethods,
    created() {
      this.loadEvent();
    },
    mounted() {

    },
    watch: {
      inputValue(val) {
        this.loadListData(val);
        if (val==''){
          this.isSelectedItemObj=[];
          this.$emit('inputFocus',{val:this.inputValue,type:'inputFocus'});//通过该方法进行数据请求
          this.isShowList=true;
        }else {
          this.$emit('inputFocus',{val:this.inputValue,type:'searchText'});//通过该方法进行数据请求
        }
      },
    }
  }
</script>

<style scoped>
  .inputBox {
    position: relative;
  }

  .input {
    border: 1px solid #DDD;
    line-height: 32px;
    /*margin-top: -4px;*/
    height: 32px;
    color: #4C4C4C;
    font-size: 14px;
    width: 100%;
    border-radius: 4px;
    padding: 0 12px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .input:focus {
    border-color: #9AB6E4;
  }

  .input::-webkit-input-placeholder {
    color: #BBBBBB;
  }

  .searchDataBox {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(154, 182, 228, 1);
    border-radius: 5px;
    padding: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    max-height: 160px;
    margin-top: 10px;
    position: absolute;
    z-index: 99;
    width: 100%;
  }

  .searchDataBox::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: -5px;
    left: 20px;
    background: #fff;
    border-top: 1px solid rgba(154, 182, 228, 1);
    border-left: 1px solid rgba(154, 182, 228, 1);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .searchDataBox ul {
    max-height: 135px;
    overflow-y: auto;
  }

  .searchDataBox ul li {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all .2s;
    text-align: left;
  }

  .searchDataBox li:hover {
    background: #EFF3F9;
    color: #5996F8;
  }

  .searchDataBox li.createNewContent {
    color: #666666;
    background: transparent;
  }

  .createNewContent a {
    color: #5996F8;
    margin-left: 5px;
  }

  .createNewContent a:hover {
    color: #5588e6;
  }

  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

</style>
