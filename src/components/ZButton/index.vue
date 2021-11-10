<template>
  <!-- 时间与属性在vue3中都被归纳到$attrs中了 -->
  <button
    v-bind="$attrs"
    :class="[
        'z-btn',
        { 'is-danger': !isUndefined(danger) },
        { 'is-disabled': disabled },
        { 'is-plain': !isUndefined(plain) }
      ]"
    >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    plain: {
      type: (String || undefined) as PropType<string | undefined>,
      default: undefined
    },
    danger: {
      type: (String || undefined) as PropType<string | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    isUndefined(val: string | undefined) {
      return val === undefined
    }
  }
})

</script>
<style lang="less" scoped>
.z-btn {
  padding: 8px 10px;
  outline: none;
  color: var(--white);
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: .3s ease;
  min-width: 80px;
  text-align: center;
  &:hover {
    background-color: var(--light-primary-color);
  }
  &:active {
    background-color: var(--deep-primary-color);
    transform: scale(.98);
  }
  &.is-danger {
    background-color: var(--red);
    border-color: var(--red);
  }
  &.is-danger:hover {
    background-color: var(--red-l);
  }
  &.is-danger:active {
    background-color: var(--red-d);
  }
  &.is-plain {
    color: var(--primary-color);
    background-color: transparent;
  }
  &.is-disabled {
    cursor: not-allowed;
    filter: brightness(120%);
  }
}
</style>
