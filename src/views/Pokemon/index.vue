<template>
  <div class="pokemon">
    <div class="screen">
      <h1>POKE MEMORIES</h1>
      <p>Select mode to start game</p>
      <table class="table">
        <tr>
          <td v-for="(item, index) in selection" :key="index">
            <div class="modes">
              <button @click="goToGamePage(item.level)">
                <span>{{ item.name }}</span>
                <span>{{ item.des }}</span>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <p class="copyright">This is copyright</p>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

const goToGamePage = (mode: number) => {
  console.log(mode)
  router.push({ name: 'pokemonPlay', query: { level: mode } })
}

const selection = [
  {
    id: 1,
    name: '4x4',
    des: 'Easy',
    level: 4
  },
  {
    id: 2,
    name: '6x6',
    des: 'Normal',
    level: 6
  },
  {
    id: 3,
    name: '8x8',
    des: 'Hard',
    level: 8
  },
  {
    id: 4,
    name: '10x10',
    des: 'Super Hard',
    level: 10
  }
]
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
