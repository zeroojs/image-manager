<template>
  <label class="z-radio flex middle">
    <input @click="handleChange" type="radio" :data-value="value" />
    <slot>123</slot>
  </label>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  props: {
    value: [String, Number]
  },
  setup(props) {
    const change = inject('change') as Function
    return {
      handleChange() {
        change(props.value)
      }
    }
  }
})
</script>

<style lang="less" scoped>
.z-radio {
  min-height: 20px;
  cursor: pointer;
  flex-wrap: nowrap;
  white-space: nowrap;
  [type="radio"] {
    width: 20px;
    zoom: 150%;
  }
  & ~ .z-radio {
    margin-left: 20px;
  }
}
</style>
