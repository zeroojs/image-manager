<template>
  <input v-model="inputValue" class="input" v-bind="$attrs" />
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
.input {
  padding: 10px;
  outline: none;
  border: 1px solid var(--gray);
  background-color: var(--gray);
  border-radius: var(--border-radius);
  transition: .3s ease;
  &:focus {
    border-color: var(--primary-color);
  }
}
</style>
