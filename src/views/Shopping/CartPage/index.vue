import type { Teleport } from 'vue';
<template>
  <Teleport to="body">
    <DeleteProductModal
      :isShow="isShowModal"
      @cancel="isShowModal = false"
      :item="itemDetail"
      @deleteCart="deleteCart"
    >
    </DeleteProductModal>
  </Teleport>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div class="screen">
    <div class="user">
      <img src="/src/assets/images/shopping/person_2.jpg" alt="user avatar" />
      <p>John Doe</p>
    </div>

    <div class="cart">
      <div id="empty-cart" v-if="empty">
        <p>No item in cart</p>
      </div>
      <div v-else id="cart-data">
        <div>
          <table>
            <tr>
              <th style="width: 20%"></th>
              <th style="width: 30%">Product</th>
              <th style="width: 10%">Price</th>
              <th style="width: 10%">Quantity</th>
              <th style="width: 10%">Total</th>
              <th style="width: 20%"></th>
            </tr>
            <tr v-for="(item, index) in myCart" :key="index">
              <td>
                <img :src="item.image" alt="product image" />
              </td>
              <td style="text-align: center">{{ item.productName }}</td>
              <td style="text-align: center">${{ item.price }}</td>
              <td style="text-align: center">{{ item.amount }}</td>
              <td style="text-align: center">${{ item.total }}</td>
              <td class="edit">
                <i class="fas fa-pen" id="edit-item"></i>
                <i class="fas fa-trash-alt" id="remove-item" @click="showModal(item)"></i>
              </td>
            </tr>
          </table>
          <p>Total</p>
          <p>${{ totalPrice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import db from '@/components/firebase/firebase'
import { DeleteProductModal } from '@/components/modal/modal'

import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'
const myCart = ref()

const empty = ref()
const totalPrice = ref(0)
const isShowModal = ref(false)

const itemDetail = ref()

const showModal = (item: object) => {
  itemDetail.value = item
  isShowModal.value = true
}

onBeforeMount(async () => {
  await getMyCart()
})

const getMyCart = async () => {
  myCart.value = []
  totalPrice.value = 0
  let listProduct: any[] = []
  const querySnapshot = await getDocs(query(collection(db, 'cart'), where('id', '==', '1')))
  querySnapshot.forEach((doc) => {
    const data = doc.data().products
    listProduct.push(data)
  })

  if (listProduct.length === 0) {
    empty.value = true
  } else {
    empty.value = false
    for (let i = 0; i < listProduct[0].length; i++) {
      let data = {
        id: listProduct[0][i].id,
        amount: listProduct[0][i].amount,
        productName: listProduct[0][i].productName,
        price: listProduct[0][i].price,
        total: listProduct[0][i].price * listProduct[0][i].amount,
        image: listProduct[0][i].image as string
      }
      myCart.value.push(data)
      totalPrice.value += data.total
    }
  }
}

const deleteCart = async () => {
  isShowModal.value = false
  for (let i = 0; i < myCart.value.length; i++) {
    if (myCart.value[i].id === itemDetail.value.id) {
      myCart.value.splice(i, 1)
    }
  }
  await updateDoc(doc(db, 'cart', 'PQOj2DIgq8GZiPGJzART'), {
    products: myCart.value
  })
  await getMyCart()
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
