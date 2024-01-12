<script setup lang="ts">
import router from '@/router'
/**
 * Page view: Home
 */
</script>

<template>
  <div class="home">
    <h1>Home Screen</h1>
    <button @click="router.push({ path: '/pokemon' })">Pokemon Game</button>
    <button @click="router.push({ path: 'shopping/home' })">Shopping</button>
  </div>
</template>

<style scoped lang="scss">
@import './styles.scss';
</style>
