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
              <RadioGroup v-model="size">
                <Radio value="mini">迷你 64*64</Radio>
                <Radio value="small">较差</Radio>
                <Radio value="middle">中等</Radio>
                <Radio value="origin">原图</Radio>
              </RadioGroup>
            </label>
            <label class="form-item flex btn-group">
              <z-button @click.prevent="downloadImage()">下载图片</z-button>
              <z-button @click.prevent="downloadImage(true)">全尺寸下载</z-button>
              <z-button @click.prevent="clipboard">复制外链</z-button>
            </label>
          </form>
        </div>
      </div>
      <div class="origin-image-summary">
        <p>创建时间：{{ image?.createAt }}</p>
      </div>
    </div>
    <!-- <ImageContainer /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { queryImage, downloadImageAction } from '../api/image'
// import { downloadImg } from '../utils/download'
// import ImageContainer from '../components/ImageContainer/index.vue'
import Radio from '../components/Radio/index.vue'
import RadioGroup from '../components/Radio/RadioGroup.vue'
import { saveAs } from 'file-saver'
import { handleClipboard } from '../utils/clipboard'

export default defineComponent({
  components: {
    Radio,
    RadioGroup
    // ImageContainer
  },
  setup() {
    const { image, size, downloadImage, clipboard } = useImage()

    return {
      size,
      image,
      clipboard,
      downloadImage
      // downloadImg
  }
  }
})

function useImage() {
  const route = useRoute()
  const size = ref('mini')
  const image = ref<ImageModule.Image>()
  // 获取图信息
  const getImage = (id = route.params.id) => {
    queryImage(id as string).then(({ data }) => {
      console.log('data', data)
      image.value = data
    })
  }
  getImage()

  // 下载图片
  const downloadImage = async (isAll = false) => {
    if (!image.value) return
    const file = await downloadImageAction(image.value.id, isAll ? 'all' : size.value)
    let type = image.value.mime
    let filename = image.value.filename
    if (isAll) {
      type = 'application/zip'
      filename = image.value.filename.replace(image.value.ext, 'zip')
    }
    saveAs(new Blob([file], { type }), filename)
  }

  // 复制外链
  const clipboard = (e: Event) => {
    const currenImage = image.value
    if (!currenImage) return
    const url = {
      mini: currenImage.mini,
      small: currenImage.thumb,
      middle: currenImage.middle,
      origin: currenImage.url,
    }[size.value]
    handleClipboard(url || '', e)
  }
  return {
    size,
    image,
    clipboard,
    downloadImage
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
