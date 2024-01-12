<template>
  <div class="modal" v-if="isShow">
    <div class="product">
      <p>Do you want to delete</p>
      <h3>{{ item.productName }}</h3>
      <img :src="item.image" alt="product image" />
      <div class="action">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-delete" @click="$emit('deleteCart')">Delete</button>
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

  .product {
    background-color: white;
    width: 40%;
    height: 65%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;

    img {
      width: 50%;
      height: 50%;
    }

    .action {
      width: 50%;
      display: flex;
      justify-content: space-between;
      margin-top: 50px;

      button {
        width: 40%;
        height: 3rem;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background-color: red;
          color: white;
        }
      }
    }
  }
}
</style>
