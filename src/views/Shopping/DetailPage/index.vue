<template>
  <div class="screen">
    <Teleport to="body">
      <AddProductModal
        :item="itemDetail"
        :isShow="isShowModal"
        @cancel="isShowModal = false"
      ></AddProductModal>
    </Teleport>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
    <div class="product">
      <div class="image">
        <img :src="product.image" alt="Product image" />
      </div>
      <div class="description">
        <h3>{{ product.name }}</h3>
        <p id="price">${{ product.price }}.00</p>
        <p id="description">Description: {{ product.description }}</p>
        <p>{{ product.amount }}kg available</p>

        <div class="add-to-cart" @click="showModal(product)">
          <p>Add to cart</p>
        </div>
      </div>
    </div>
    <div class="related">
      <p>Related Products</p>
      <div class="relatedProducts">
        <div class="item" v-for="(item, index) in relatedProducts" :key="index">
          <img :src="item.image" alt="Product image" @click="goToDetailPage(item.id)" />
          <h3 id="name">{{ item.name }}</h3>
          <p id="price">${{ item.price }}</p>
          <i id="iconCart" class="fas fa-cart-plus" @click="showModal(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import db from '@/components/firebase/firebase'
import AddProductModal from '@/components/modal/AddProduct.vue'

import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  where,
  limit
} from 'firebase/firestore'

const quantity = ref(1)

const product = ref()
const itemDetail = ref()

const relatedProducts = ref()

const route = useRoute()
const isShowModal = ref(false)

const showModal = (item) => {
  console.log(item)
  itemDetail.value = item
  isShowModal.value = true
}

onBeforeMount(async () => {
  let id = route.query.id
  const querySnapshot = await getDocs(query(collection(db, 'products'), where('id', '==', id)))

  querySnapshot.forEach((doc) => {
    const data = {
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    }

    product.value = data

    console.log(product.value.image)
  })
  relatedProducts.value = await getRelatedProduct()
})

const getRelatedProduct = async () => {
  let listRelatedProduct = []
  const querySnapshot = await getDocs(query(collection(db, 'products'), limit(4)))

  querySnapshot.forEach((doc) => {
    const data = {
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    }

    listRelatedProduct.push(data)
  })

  return listRelatedProduct
}

const goToDetailPage = (id) => {
  router.push({ name: 'shoppingDetail', query: { id: id } })
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
