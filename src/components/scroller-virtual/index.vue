<template>
  <div ref="container" class="container" @scroll="handleScroll">
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="content" :style="{ transform: `translateY(${offset}px)` }">
      <div v-for="item in visibleItems" :key="item.id" class="item">
        <Item @onTriggerTab="handleOnTab" :id="item.id" />
      </div>
    </div>
  </div>
</template>

<script>
  import Item from "./item.vue";
  export default {
    components: { Item },
    data() {
      return {
        items: Array.from({ length: 500 }, (_, i) => ({ id: i, text: `Item ${i}` })),
        itemHeight: 50,
        visibleCount: 10,
        startIndex: 0,
        offset: 0,
      };
    },
    computed: {
      endIndex() {
        return Math.min(this.startIndex + this.visibleCount, this.items.length);
      },
      visibleItems() {
        return this.items.slice(this.startIndex, this.endIndex);
      },
      totalHeight() {
        return this.items.length * this.itemHeight;
      },
    },
    methods: {
      handleOnTab() {
        console.log("onTab");
        this.$refs.container.scrollTop = this.$refs.container.scrollTop + 30;
        this.handleScroll();
      },
      handleScroll() {
        const scrollTop = this.$refs.container.scrollTop;
        this.startIndex = Math.floor(scrollTop / this.itemHeight);
        this.offset = this.startIndex * this.itemHeight;
      },
    },
  };
</script>

<style scoped>
  .container {
    overflow: auto;
    position: relative;
    height: 500px;
  }
  .phantom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
  }
</style>
