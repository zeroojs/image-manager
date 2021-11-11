<template>
  <div class="radio-group flex middle">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number]
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      radios: [] as HTMLInputElement[]
    }
  },
  mounted() {
    const radios: HTMLInputElement[] = this.$el.querySelectorAll('[type=radio]')
    if (radios.length === 0) return
    radios.forEach(radio => {
      radio.name = 'radio' + (this as any)._.uid
      if (this.modelValue && radio.dataset.value === this.modelValue) {
        radio.checked = true
      }
    })
    if (!this.modelValue) {
      const firstRadio= radios[0]
      firstRadio.checked = true
    }
  },
  setup(props, { emit }) {
    const change = (val: string | number) => {
      emit('update:modelValue', val)
    }
    provide('change', change)
    return {
      change
    }
  }
})
</script>
