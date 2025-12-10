<template>
  <div class="cat-gallery">
    <button class="cat-gallery__refresh-button" @click="handleRefresh" :disabled="loading">
      Odśwież koty
    </button>
    <div v-if="loading" class="cat-gallery__loader" aria-label="Ładowanie…"></div>

    <div v-else class="cat-gallery__grid">
      <div
        class="cat-gallery__img-holder"
        v-for="(url, index) in images"
        :key="url"
        @click="openModal(url)"
      >
        <div class="cat-gallery__image-loader" v-if="!loadedImages.has(url)"></div>

        <img
          :src="url"
          :alt="`Kot ${index + 1}`"
          class="cat-gallery__image"
          loading="lazy"
          @load="() => loadedImages.add(url)"
          @error="() => loadedImages.add(url)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loadedImages = ref<Set<string>>(new Set())
defineProps<{
  images: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'open-modal', url: string): void
}>()

const handleRefresh = () => emit('refresh')

const openModal = (url: string) => emit('open-modal', url)
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.cat-gallery {
  &__loader {
    width: 200px;
    height: 200px;
    border: 10px solid;
    border-color: transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spinner-rotate 0.8s linear infinite;
    color: $color-primary;
    margin: 0 auto;
  }
  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  &__img-holder {
    cursor: pointer;
    overflow: hidden;
    border-radius: 1rem;
    height: 400px;
    width: 400px;
    flex: 0 1 400px;
    position: relative;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
  &__image-loader {
    position: absolute;
    inset: 0;
    background-color: $color-bg-default;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      content: '';
      width: 40px;
      height: 40px;
      border: 4px solid transparent;
      border-top-color: $color-primary;
      border-radius: 50%;
      animation: spinner-rotate 0.6s linear infinite;
    }
  }
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    object-position: center;
  }
  &__refresh-button {
    display: block;
    margin: 2rem auto;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: $color-primary;
    color: lighten($color-primary, 50%);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: darken($color-primary, 10%);
    }
  }
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
