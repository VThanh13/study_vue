<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div v-if="isShow" class="toast">
    <div
      class="info"
      :style="{
        backgroundColor: toastColor
      }"
    >
      <p>
        {{ message }}
      </p>
      <i id="icon" :class="iconClass"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onBeforeUpdate } from 'vue'

const prop = defineProps({
  message: String,
  type: String,
  isShow: Boolean
})

const toastColor = ref()
const iconClass = ref()

onBeforeUpdate(() => {
  switch (prop.type) {
    case 'success':
      toastColor.value = 'green'
      iconClass.value = 'far fa-check-circle'
      break
    case 'error':
      toastColor.value = 'red'
      iconClass.value = 'fas fa-exclamation-circle'
      break
    case 'warning':
      toastColor.value = 'orange'
      iconClass.value = 'fas fa-exclamation-triangle'
      break
    default:
  }
})
</script>

<style scoped lang="scss">
.toast {
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0;
  margin: 0;

  .info {
    height: 60px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: fixed;
    top: 10%;
    right: 0;

    p {
      font-size: 1.5rem;
      color: white;
      text-align: center;
      margin: 0 10px;
    }

    #icon {
      font-size: 35px;
      color: white;
      margin-right: 10px;
    }
  }
}
</style>
