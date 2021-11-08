<template>
  <input v-model="inputValue" class="z-input" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const inputValue = ref<string>(props.modelValue)

    watch(() => inputValue.value, (currentValue) => {
      ctx.emit('update:modelValue', currentValue)
    })

    return {
      inputValue
    }
  }
})
</script>
<style lang="less" scoped>
.z-input {
  width: 100%;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &:focus {
    border-color: var(--primary-color);
  }
  &::placeholder {
    color: var(--gray-d);
  }
}
</style>
