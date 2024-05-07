<template>
  <div class="item-row">
    <span>{{ id }}</span>
    <input class="w-52 h-10" />
    <input class="w-52 h-10" />
    <input class="w-52 h-10" />
    <input class="w-52 h-10" />
    <input class="w-52 h-10 bg-red" @keydown.tab.prevent="$emit('onTriggerTab')" />
  </div>
</template>
<script setup>
  // import definedProps from "vue";
  const emits = defineEmits(["onTriggerTab"]);
  const props = defineProps(["id"]);
</script>
<style>
  .item-row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    position: relative;
  }
  .item-row > .text {
    position: sticky;
    left: 0;
  }
  .item-row > input:last-child {
    background: red;
  }
</style>
