<template>
  <div class="pokemon">
    <div class="screen">
      <h1>POKE MEMORIES</h1>
      <p>Select mode to start game</p>
      <div class="modes">
        <button @click="goToGamePage(4)">
          <span>4x4</span>
          <span>Easy</span>
        </button>
        <button @click="goToGamePage(6)">
          <span>6x6</span>
          <span>Normal</span>
        </button>
        <button @click="goToGamePage(8)">
          <span>8x8</span>
          <span>Hard</span>
        </button>
        <button @click="goToGamePage(10)">
          <span>10x10</span>
          <span>Super Hard</span>
        </button>
      </div>
    </div>
    <p class="copyright">This is copyright</p>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const goToGamePage = (mode: number) => {
  console.log(mode)
  router.push({ name: 'pokemonPlay', query: { level: mode } })
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
