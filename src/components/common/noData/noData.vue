<template>
  <div id="noData">
    <div class="msgBox noSelect">
      <img src="../../../../static/img/common/no-data-icon.png">
      <p v-cloak class="msg">{{msg}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "noData",
    props: ['msg'],
    data() {
      return {};
    },
    created() {

    },
  }
</script>

<style scoped>
  #noData {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 995;
    background: #FFF;
    text-align: center;
  }

  .msg {
    color: #4c4c4c;
    font-size: 14px;
    margin-top: 30px;
  }

  .msgBox {
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
