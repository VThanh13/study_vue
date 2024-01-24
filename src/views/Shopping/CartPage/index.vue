<template>
  <Loading :isLoading="isLoading"></Loading>

  <Teleport to="body">
    <DeleteProductModal
      :isShow="isShowModal"
      @cancel="isShowModal = false"
      :item="itemDetail"
      @deleteCart="deleteCart"
    >
    </DeleteProductModal>
    <Toast :message="message" :isShow="isShowToast" :type="type"></Toast>
    <ConfirmPay
      :isShow="isShowConfirmPay"
      :total="totalPrice"
      @cancel="isShowConfirmPay = false"
      @payCart="payCart"
    ></ConfirmPay>
  </Teleport>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div class="screen">
    <div class="navbar">
      <p @click="goToHomePage()">VEGETABLES</p>
    </div>
    <div class="user">
      <img src="/src/assets/images/shopping/person_2.jpg" alt="user avatar" />
      <p>John Doe</p>
    </div>

    <div class="cart">
      <div id="empty-cart" v-if="empty">
        <img src="/src/assets/images/shopping/preview.png" alt="no item in cart" />
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
          <div class="pay">
            <div>
              <p>Total</p>
              <p>${{ totalPrice }}</p>
            </div>

            <button @click="showConfirmPay()">Pay <i class="fas fa-cash-register"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import db from '@/components/firebase/firebase'
import router from '@/router'

import { DeleteProductModal, Loading, Toast, ConfirmPay } from '@/components/component'
import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'

type cartModel = {
  id: string
  amount: number
  image: string
  price: number
  productName: string
  total: number
}

// VARIABLE
const myCart = ref<cartModel[]>([])
const empty = ref<boolean>(true)
const totalPrice = ref<number>(0)
const isShowModal = ref<boolean>(false)
const itemDetail = ref()
const isLoading = ref<boolean>(false)
const message = ref<string>('')
const isShowToast = ref<boolean>(false)
const isShowConfirmPay = ref<boolean>(false)
const type = ref<string>()

// FUNCTION
onBeforeMount(async () => {
  await getMyCart()
  checkEmptyCart()
})

const showModal = (item: cartModel) => {
  itemDetail.value = item
  isShowModal.value = true
}

const showConfirmPay = () => {
  isShowConfirmPay.value = true
}

const showToast = (typeToast: string, messageToast: string) => {
  type.value = typeToast
  message.value = messageToast
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, 2000)
}

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
      let data = ref<cartModel>({
        id: listProduct[0][i].id,
        amount: listProduct[0][i].amount,
        productName: listProduct[0][i].productName,
        price: listProduct[0][i].price,
        total: listProduct[0][i].price * listProduct[0][i].amount,
        image: listProduct[0][i].image as string
      })
      myCart.value.push(data.value)
      totalPrice.value += data.value.total
    }
  }
}

const deleteCart = async () => {
  try {
    isLoading.value = true
    for (let i = 0; i < myCart.value.length; i++) {
      if (myCart.value[i].id === itemDetail.value.id) {
        myCart.value.splice(i, 1)
      }
    }
    await updateDoc(doc(db, 'cart', 'PQOj2DIgq8GZiPGJzART'), {
      products: myCart.value
    })
    await getMyCart().then(() => {
      isLoading.value = false
      showToast('success', 'Delete product successfully')
    })
  } catch (error) {
    console.log(error)
    showToast('error', 'Delete product failed')
  }
  isShowModal.value = false
  checkEmptyCart()
}

const payCart = async () => {
  isShowConfirmPay.value = false
  isLoading.value = true
  try {
    myCart.value = []
    await updateDoc(doc(db, 'cart', 'PQOj2DIgq8GZiPGJzART'), {
      products: myCart.value
    }).then(() => {
      isLoading.value = false
      showToast('success', 'Pay successfully')
    })
  } catch (error) {
    console.log(error)
    showToast('error', 'Pay failed')
  }
  empty.value = true
}

const goToHomePage = () => {
  router.push({ name: 'shoppingHome' })
}

const checkEmptyCart = () => {
  if (myCart.value.length === 0) {
    empty.value = true
  } else {
    empty.value = false
  }
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
