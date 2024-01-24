<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div v-if="isShow" class="modal">
    <div class="bill">
      <div class="header">
        <p>VEGETABLES</p>
      </div>
      <div class="content">
        <h3>Total:</h3>
        <p>${{ total }}</p>
      </div>
      <div class="paySelection">
        <label class="container">
          <input type="radio" checked="checked" name="radio" />
          <span class="checkmark"></span>
          <i class="fa fa-credit-card" style="color: black"></i>
          <p>Credit Card</p>
        </label>
        <label class="container">
          <input type="radio" checked="checked" name="radio" />
          <span class="checkmark"></span>
          <i class="far fa-money-bill-alt" style="color: red"></i>
          <p>Money</p>
        </label>
        <label class="container">
          <input type="radio" checked="checked" name="radio" />
          <span class="checkmark"></span>
          <i class="fab fa-cc-visa" style="color: lightblue"></i>
          <p>Visa Card</p>
        </label>
        <label class="container">
          <input type="radio" checked="checked" name="radio" />
          <span class="checkmark"></span>
          <i class="fab fa-cc-paypal" style="color: blue"></i>
          <p>Paypal</p>
        </label>
      </div>
      <div class="actions">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-pay" @click="$emit('payCart')">Pay</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const prop = defineProps({
  isShow: Boolean,
  total: Number
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

  .bill {
    height: auto;
    width: 40%;
    background-color: white;
    padding-bottom: 20px;

    .header {
      background-color: #82ae46;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      font-weight: bold;
      color: white;
      p {
        margin: 0;
      }
    }

    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      h3 {
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }

      p {
        font-size: 2rem;
        font-weight: bold;
        color: green;
        margin: 0 0 0 10px;
      }
    }
    .actions {
      display: flex;
      justify-content: space-evenly;
      margin-top: 50px;

      button {
        width: 20%;
        height: 3rem;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 1.5rem;
        font-weight: bold;

        &.btn-cancel {
          background-color: grey;
          color: white;

          &:hover {
            background-color: red;
          }
        }

        &.btn-pay {
          background-color: gray;
          color: white;

          &:hover {
            background-color: green;
          }
        }
      }
    }
  }
}

.paySelection {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  margin-left: 10%;

  label {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;

    input {
      margin-right: 10px;
    }
  }

  p {
    margin: 0 0 0 10px;
    color: black;
    font-size: 20px;
  }
}
</style>
