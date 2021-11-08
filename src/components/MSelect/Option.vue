<template>
   <li class="select-option" @click="handleClick">
     {{ label }}
   </li>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, inject } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: [Number, String]
    },
    label: String
  },
  setup(props) {
    const self = getCurrentInstance()
    const setParentInputValue = inject('setInputValue') as Function
    const handleClick = () => {
      setParentInputValue(props.value)
    }
    return {
      handleClick
    }
  }
})
</script>

<style scoped>
.select-option {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  cursor: pointer;
}
.select-option:hover {
  background-color: #f5f7fa;
}
</style>