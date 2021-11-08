<template>
  <div class="z-select">
    <input
      v-model="inputValue"
      ref="input"
      class="z-select--input"
      readonly
      v-bind="$attrs"
      @click="handleInputClick"
      @blur="handleInputBlur"
    />
    <ul v-show="showTooltip" ref="tooltip" class="tooltip">
      <slot />
    </ul>
  </div>
</template>

<script lang="ts">
import { DefineComponent, defineComponent, onBeforeUnmount, provide, ref, SetupContext } from 'vue'
import { createPopper } from '@popperjs/core'
import Option from './Option.vue'

export default defineComponent({
  components: {
    Option
  },
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const input = ref<HTMLInputElement>()
    const tooltip = ref<HTMLUListElement>()
    const showTooltip = ref(false)
    const { childProps, getDefValue } = useSolt(ctx)
    const inputValue = ref<string | number>(getDefValue(props.modelValue))

    const handleInputClick = () => {
      if (!ctx.slots.default) {
        return
      }
      showTooltip.value = true
      if (!input.value || !tooltip.value) return
      createPopper(input.value, tooltip.value, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 15],
            }
          }
        ]
      })
    }

    let timer: NodeJS.Timeout
    const handleInputBlur = () => {
      timer = setTimeout(() => {
        showTooltip.value = false
        clearTimeout(timer)
      }, 100)
    }

    onBeforeUnmount(() => clearTimeout(timer))

    const setInputValue = (val: string | number) => {
      ctx.emit('update:modelValue', val)
      inputValue.value = childProps.find(item => item.value === val)?.label || ''
    }
    provide('setInputValue', setInputValue)
    return {
      input,
      tooltip,
      inputValue,
      showTooltip,
      handleInputBlur,
      handleInputClick
    }
  }
})

function useSolt(ctx: SetupContext<any>) {
  const solts = ctx.slots as any
  const childProps: { value: string, label: string }[] = []
  if (solts.default) {
    (solts.default() as any)[0].children.forEach((item) => {
      childProps.push(item.props)
    })
  }

  const getDefValue = (modelValue: string | number) => {
    if (!modelValue) return modelValue
    return childProps.find(item => item.value === modelValue)?.label || ''
  }
  return { childProps, getDefValue }
}
</script>

<style lang="less" scoped>
.z-select {
  width: 100%;
  max-width: 220px;
  position: relative;
}
.z-select--input {
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
.tooltip {
  color: white;
  border-radius: 4px;
  width: 100%;
  position: relative;
  z-index: 9;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  &::before {
    content: " ";
    width: 10px;
    height: 10px;
    background-color: inherit;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    border-radius: 0 0 20px;
    border-top: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
  }
}
</style>
