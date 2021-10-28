<template>
  <!-- 时间与属性在vue3中都被归纳到$attrs中了 -->
  <button v-bind="$attrs" class="btn">
    <slot></slot>
  </button>
</template>

<style lang="less" scoped>
.btn {
  padding: 8px 10px;
  outline: none;
  color: var(--white);
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: .3s ease;
  &:hover {
    background-color: var(--light-primary-color);
  }
  &:active {
    background-color: var(--deep-primary-color);
    transform: scale(.98);
  }
}
</style>
