<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div class="screen">
    <div class="game" v-if="!showResult">
      <img
        v-for="(pokemonData, index) in pokemon"
        :key="index"
        id="image"
        :src="pokemonData.isChoose ? pokemonData.image : '/src/assets/images/pokemon/icon_back.png'"
        alt="pokemon"
        :style="{
          background: pokemonData.isChoose ? '#ee9d9d' : '#7e405f',
          width: 80 / level + '%',
          height: 80 / level + '%',
          maxHeight: 80 / level + '%',
          maxWidth: 80 / level + '%'
        }"
        @click="choosePokemon(index)"
      />
    </div>
    <div class="result" v-else>
      <h1>Congratulations!</h1>
      <h2>You win!</h2>
      <h2>Point: {{ point }}</h2>
      <button class="button" @click="playAgain()">Play Again <i class="fas fa-history"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onBeforeMount, watch } from 'vue'
import router from '@/router'

const route = useRoute()

const pokemon = ref<any[]>([])
const selectedItem = ref<any[]>([])

const point = ref<number>(0)
const item1 = ref<number>(-1)
const item2 = ref<number>(-1)
const level = parseInt(route.query.level as string)

const showResult = ref<boolean>(false)

watch(
  () => point.value,
  (newVal, oldVal) => {
    if (point.value === pokemon.value.length / 2) {
      showResult.value = true
    }
  }
)

onBeforeMount(() => {
  const lv = parseInt(route.query.level as string)
  const totalItem = (lv * lv) / 2
  pokemon.value = getPokemonImage(totalItem)
})

const getPokemonImage = (totalItem: number) => {
  let listImage = []

  for (let i = 1; i < totalItem + 1; i++) {
    listImage.push({ id: i, image: '/src/assets/images/pokemon/' + i + '.png', isChoose: false })
  }

  // Add same list image to listImage
  let listSecond = listImage.map((item) => ({ ...item }))

  // Update id for second list, if don't update can't check match
  listSecond.forEach((item, index) => {
    item.id = index + 1
  })

  listImage.push(...listSecond)
  listImage.sort(() => Math.random() - 0.5)
  return listImage
}

const choosePokemon = (index: number) => {
  if (selectedItem.value.length >= 2) {
    return
  }

  const chosenPokemon = pokemon.value[index]

  if (!chosenPokemon.isChoose && selectedItem.value.length < 2) {
    // Save index of chosen pokemon to check match
    if (item1.value === -1) {
      item1.value = index
    } else {
      item2.value = index
    }

    // delay to choose pokemon but don't have animation
    setTimeout(() => {
      chosenPokemon.isChoose = true
    }, 300)

    selectedItem.value.push({ ...chosenPokemon })
    // if choose 2 pokemon, check match
    if (selectedItem.value.length === 2) {
      // delay to check match but don't have animation, wait for 2nd pokemon to be chosen
      setTimeout(() => {
        updatePokemon(item1.value, item2.value)
        item1.value = -1
        item2.value = -1
      }, 1000)
    }
  }
}

const updatePokemon = (item1: number, item2: number) => {
  if (pokemon.value[item1].image === pokemon.value[item2].image) {
    selectedItem.value = []
    point.value += 1
  } else {
    pokemon.value[item1].isChoose = false
    pokemon.value[item2].isChoose = false
    selectedItem.value = []
  }
}

const playAgain = () => {
  router.back()
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
