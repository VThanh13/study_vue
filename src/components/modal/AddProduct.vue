<template>
  <div v-if="isShow" class="modal">
    <img :src="item.image" alt="product image" />

    <div class="product">
      <p class="name">{{ item.name }}</p>
      <p class="price">${{ item.price }}</p>
      <input type="number" placeholder="number of items.." />

      <div class="action">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-add" @click="$emit('addCart')">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const prop = defineProps({
  item: Object,
  isShow: Boolean
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
  justify-content: center;
  align-items: center;

  img {
    width: 40%;
    height: 70%;
  }

  .product {
    width: 40%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;

    .name {
      font-size: 3rem;
      font-weight: bold;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
    }

    input {
      width: 50%;
      height: 3rem;
      border: 1px solid black;
      border-radius: 5px;
      margin: 1rem 0;
      padding: 0 1rem;
      text-align: center;
    }

    .action {
      width: 50%;
      display: flex;
      justify-content: space-between;

      button {
        width: 40%;
        height: 3rem;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
      }

      .btn-cancel {
        &:hover {
          background-color: red;
          color: white;
        }
      }

      .btn-add {
        &:hover {
          background-color: green;
          color: white;
        }
      }
    }
  }
}
</style>
