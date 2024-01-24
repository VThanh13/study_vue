<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div class="modal" v-if="isShow">
    <div class="search">
      <input type="text" placeholder="Search..." v-model="search" />
      <i class="fas fa-times" @click="$emit('cancel')"></i>
    </div>
    <ul v-show="searchResult.length">
      <li v-for="result in searchResult" :key="result" @click="$emit('search')">
        <i class="fas fa-search" style="font-size: 20px; color: darkgray"></i>
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'

const prop = defineProps({
  isShow: Boolean,
  listProduct: Array
})

const emit = defineEmits(['cancel', 'search'])

const search = ref('')
const data = ref(prop.listProduct.map((item) => item.name))

const searchResult = computed(() => {
  if (search.value === '') {
    return []
  }

  return data.value.filter((item) => {
    return item.toLowerCase().includes(search.value.toLowerCase())
  })
})
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  max-height: 100%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 0;
  margin: 0;
  justify-content: start;
  align-items: center;
  flex-direction: column;

  .search {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      width: 50%;
      height: 45px;
      border-radius: 30px;
      border: 1px solid #82ae46 !important;
      padding: 0 10px;
      font-size: 25px;
      box-shadow: none !important;
      background-color: white;
      color: black;
      margin-top: 6px;
    }
    i {
      font-size: 35px;
      color: white;
      margin-left: 25px;

      &:hover {
        cursor: pointer;
        color: red;
      }
    }
  }
  ul {
    display: flex;
    justify-content: center;
    align-items: start;
    flex-wrap: wrap;
    background-color: white;
    flex-direction: column;
    width: 60%;
    border-radius: 10px;
  }
  li {
    color: grey;
    font-size: 25px;

    height: 40px;
    margin: 0 5%;

    &:hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
