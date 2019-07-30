<template>
  <div style="display: none">
    <viewer :images="images"
            @inited="handlerinited"
            class="viewer" ref="viewer"
    >
        <img  v-for="(item,index) in images" :src="item.src" class="viewer-img-in" :key="item.src">
    </viewer>
  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.css';
  import Viewer from 'v-viewer/src/component'
    export default {
        name: "Img-viewer",
        components: {
          Viewer
        },
        props:{
          option:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
      data(){
          return {
            images:[],
          }
      },
      methods:{
        handlerinited (viewer) {
          this.$viewer = viewer;
        },
        handlerImgshow () {
          this.images = this.option.list
          this.$nextTick(() => {
            this.$viewer.show()
            setTimeout(()=> {
              $('.viewer-img-in')[0].click()
            },100)
          })
        }
      }

    }
</script>

<style scoped>

</style>
