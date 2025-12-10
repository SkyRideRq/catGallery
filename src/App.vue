<template>
  <div class="app">
    <h1 class="app__title">MIAU</h1>

    <CatGallery
      :images="catImages"
      :loading="isLoading"
      @refresh="loadCats"
      @open-modal="openModal"
    />

    <CatModal :is-open="isModalOpen" :current-image-url="selectedImage" @close="closeModal" />

    <ErrorToast :message="errorMessage" :show="showError" @close="showError = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { CatService } from '@/services/CatService'
import CatGallery from '@/components/CatGallery.vue'
import CatModal from '@/components/CatModal.vue'
import ErrorToast from '@/components/ErrorToast.vue'

const catImages = ref<string[]>([])
const isLoading = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)
const selectedImage = ref<string>('')
const showError = ref<boolean>(false)
const errorMessage = ref<string>('')

const loadCats = async () => {
  isLoading.value = true
  try {
    catImages.value = await CatService.fetchCats()
  } catch (error) {
    console.error(error)
    showError.value = true
    errorMessage.value = 'Wystąpił błąd podczas ładowania obrazków. Spróbuj ponownie.'
  } finally {
    isLoading.value = false
  }
}

const openModal = (url: string) => {
  selectedImage.value = url
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedImage.value = ''
}

onMounted(() => {
  loadCats()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';
.app {
  min-height: 100vh;
  margin: 60px auto;
  max-width: 1366px;
  padding: 0 20px;
  &__title {
    text-align: center;
    margin: 5rem 0;
    font-size: 5rem;
    font-weight: 700;
    color: $color-primary;
  }
}
</style>
