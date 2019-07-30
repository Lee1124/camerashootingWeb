<template>
  <div id="search">
    <div class="inputBox">
      <input type="text" autocomplete="off" @keyup.enter="searchNews" v-model="searchText"
             class="searchInput " :placeholder="searchPlaceholderText">
      <div class="searchBtn " @click="searchNews">
        <!--<span></span>-->
        <img src="../../../../static/img/common/search.png" alt="搜索">
      </div>
    </div>
  </div>
</template>

<script>
  /*方法*/
  let myMethods = {
    searchNews() {
      this.$emit('searchNews',this.searchText)
    }
  };
  export default {
    name: "search",
    props:['searchPlaceholderText'],
    data() {
      return {
        searchText: '',
      };
    },
    methods: myMethods,
    created() {

    },
    watch:{
      searchText(val){
        if (val==''){
          this.$emit('searchNews',this.searchText);
        }
      }
    }
  }
</script>

<style scoped>
  .searchInput {
    height: 32px;
    border:1px solid rgba(221,221,221,1);
    border-radius:5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    padding-left: 15px;
    font-size: 14px;
  }
  .searchInput:focus {
    border-color: #9AB6E4;
  }
  .searchInput::-webkit-input-placeholder {
    color: #BBB;
  }
  .inputBox {
    height: 32px;
    position: relative;
  }

  .searchBtn {
    width: 40px;
    height: 24px;
    position: absolute;
    right: 1px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: 99;
    cursor: pointer;
    border-left: 1px solid #DDDDDD;
    background: #FFF;
  }
  .searchBtn img {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }


</style>
