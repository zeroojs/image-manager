<template>
  <div>
    <div class="img-info">
      <div class="flex">
        <div class="origin-image-container">
          <img src="../assets/demo.jpeg" alt="">
        </div>
        <div class="origin-image-actions">
          <h1 class="image-title">猫头鹰</h1>
          <ul class="link-group">
            <li class="link-item">
              <a href="http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb">
                http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb
              </a>
            </li>
            <li class="link-item">
              <a href="http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb">
                http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb
              </a>
            </li>
            <li class="link-item">
              <a href="http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb">
                http://image-manager.zeroojs.com/kajshduahsdoasd.png?size=thumb
              </a>
            </li>
          </ul>
          <form class="download-form">
            <label class="form-item">
              <p>品质选择</p>
              <div class="radio-group flex">
                <div class="flex middle">
                  <input type="radio" name="size" />
                  迷你100*100
                </div>
                <div class="flex middle">
                  <input type="radio" name="size" />
                  较差
                </div>
                <div class="flex middle">
                  <input type="radio" name="size" />
                  中等
                </div>
                <div class="flex middle">
                  <input type="radio" name="size" />
                  原图
                </div>
              </div>
            </label>
            <label class="form-item flex btn-group">
              <z-button>下载图片</z-button>
              <z-button>全尺寸下载</z-button>
              <z-button>复制外链</z-button>
            </label>
          </form>
        </div>
      </div>
      <div class="origin-image-summary"></div>
    </div>
    <ImageContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageContainer from '../components/ImageContainer/index.vue'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
.origin-image-container {
  flex: 1;
  height: 500px;
  background-color: var(--gray);
  overflow: hidden;
  img {
    height: 100%;
    display: block;
    margin: 0 auto;
  }
}
.origin-image-actions {
  width: 350px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
}
.image-title {
  margin-bottom: 40px;
  font-size: 24px;
}
.link-group {
  a, a:active, a:link {
    color: var(--primary-color);
    text-decoration: none;
  }
  .link-item {
    margin-bottom: 20px;
    word-break: break-all;
    list-style-type: none;
  }
}
.download-form {
  margin-top: auto;
  .form-item {
    margin-top: 20px;
    p {
      margin-bottom: 10px;
    }
  }
  .btn-group,
  .radio-group {
    gap: 20px;
    input {
      margin-right: 5px;
    }
  }
}
.origin-image-summary {
  margin-top: 40px;
}
</style>
