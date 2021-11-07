<template>
  <div>
    <div class="img-info">
      <div v-if="image" class="flex">
        <div class="origin-image-container">
          <img :src="image.url" alt="">
        </div>
        <div class="origin-image-actions">
          <h1 class="image-title">{{ image.filename }}</h1>
          <ul class="link-group">
            <li class="link-item">
              <p>Mini</p>
              <a :href="image.mini" target="_blank">
                {{ image.mini }}
              </a>
            </li>
            <li class="link-item">
              <p>缩略图</p>
              <a :href="image.thumb" target="_blank">
                {{ image.thumb }}
              </a>
            </li>
            <li class="link-item">
              <p>中等质量</p>
              <a :href="image.middle" target="_blank">
                {{ image.middle }}
              </a>
            </li>
            <li class="link-item">
              <p>原图</p>
              <a :href="image.url" target="_blank">
                {{ image.url }}
              </a>
            </li>
          </ul>
          <form class="download-form">
            <label class="form-item">
              <p>品质选择</p>
              <div class="radio-group flex">
                <div class="flex middle">
                  <input type="radio" name="size" />
                  迷你 64*64
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
      <div class="origin-image-summary">
        <p>创建时间：{{ image?.createAt }}</p>
      </div>
    </div>
    <ImageContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'
import { queryImage } from '../api/image'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const { image } = useImage()
    return {
      image
    }
  }
})

function useImage() {
  const route = useRoute()
  const image = ref<ImageModule.Image>()
  // 获取图信息
  const getImage = (id = route.params.id) => {
    queryImage(id as string).then(({ data }) => {
      console.log('data', data)
      image.value = data
    })
  }
  getImage()
  return {
    image
  }
}
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
    & > p {
      margin-bottom: 10px;
    }
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
  margin-bottom: 40px;
  color: var(--gray-d);
}
</style>
