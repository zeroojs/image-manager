<template>
  <Navbar />
  <div class="app-container">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Button>Hello Vue3</Button>
    <div>
      <SearchInput v-model="keywords" placeholder="请输入关键字" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchInput from './components/SearchInput/index.vue'
import Navbar from './components/Navbar/index.vue'
export default defineComponent({
  components: {
    Navbar,
    SearchInput
  },
  data() {
    return {
      keywords: 'hehe'
    }
  }
})

</script>
