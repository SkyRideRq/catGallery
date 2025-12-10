<template>
  <div v-if="isOpen" class="cat-modal" @click="closeModal">
    <div class="cat-modal__content">
      <button class="cat-modal__close" @click.stop="closeModal">&times;</button>

      <div class="cat-modal__zoom-controls" @click.stop>
        <button class="cat-modal__zoom-btn" @click="zoomIn">+</button>
        <button class="cat-modal__zoom-btn" @click="zoomOut">−</button>
      </div>

      <div
        class="cat-modal__image-wrapper"
        ref="wrapperRef"
        @wheel.prevent="handleWheelZoom"
        @dblclick="resetZoom"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <img
          v-if="currentImageUrl"
          :src="currentImageUrl"
          alt="Powiększony kot"
          class="cat-modal__image"
          ref="imageRef"
          :style="{ transform: transformStyle, cursor: isDragging ? 'grabbing' : 'grab' }"
          @load="onImageLoad"
          @click.stop
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  isOpen: boolean
  currentImageUrl: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('close')
  resetZoom()
}

const scale = ref(1)
const minScale = 0.5
const maxScale = 3

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, maxScale)
  clampToBounds()
}
const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, minScale)
  clampToBounds()
}
const resetZoom = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const handleWheelZoom = (e: WheelEvent) => {
  const delta = e.deltaY < 0 ? 0.1 : -0.1
  const newScale = scale.value + delta
  scale.value = Math.max(minScale, Math.min(maxScale, newScale))
  clampToBounds()
}

const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const startTranslateX = ref(0)
const startTranslateY = ref(0)
const wrapperRef = ref<HTMLDivElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const aspectRatio = ref(1)

const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img && img.naturalHeight) {
    aspectRatio.value = img.naturalWidth / img.naturalHeight
  }
}

const getBounds = () => {
  const wrapper = wrapperRef.value
  if (!wrapper) return { maxX: 0, maxY: 0 }
  const w = wrapper.clientWidth
  const h = wrapper.clientHeight
  const baseWidth = h * aspectRatio.value
  const scaledWidth = baseWidth * scale.value
  const scaledHeight = h * scale.value
  const maxX = Math.max(0, (scaledWidth - w) / 2)
  const maxY = Math.max(0, (scaledHeight - h) / 2)
  return { maxX, maxY }
}

const onMouseDown = (e: MouseEvent) => {
  if (scale.value <= 1) return
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startTranslateX.value = translateX.value
  startTranslateY.value = translateY.value
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value
  const { maxX, maxY } = getBounds()
  const nextX = startTranslateX.value + dx
  const nextY = startTranslateY.value + dy
  translateX.value = Math.max(-maxX, Math.min(maxX, nextX))
  translateY.value = Math.max(-maxY, Math.min(maxY, nextY))
}

const endDrag = () => {
  isDragging.value = false
  clampToBounds()
}

const onTouchStart = (e: TouchEvent) => {
  if (scale.value <= 1) return
  const t = e.touches[0]
  isDragging.value = true
  startX.value = t!.clientX
  startY.value = t!.clientY
  startTranslateX.value = translateX.value
  startTranslateY.value = translateY.value
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const t = e.touches[0]
  const dx = t!.clientX - startX.value
  const dy = t!.clientY - startY.value
  const { maxX, maxY } = getBounds()
  const nextX = startTranslateX.value + dx
  const nextY = startTranslateY.value + dy
  translateX.value = Math.max(-maxX, Math.min(maxX, nextX))
  translateY.value = Math.max(-maxY, Math.min(maxY, nextY))
}

const onTouchEnd = () => {
  isDragging.value = false
}

const clampToBounds = () => {
  const { maxX, maxY } = getBounds()
  if (Math.abs(translateX.value) > maxX) translateX.value = Math.sign(translateX.value) * maxX
  if (Math.abs(translateY.value) > maxY) translateY.value = Math.sign(translateY.value) * maxY
  if (scale.value <= 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

const transformStyle = computed(
  () => `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';
.cat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: $color-bg-overlay;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 95vw;
    max-height: 95vh;
    overflow: hidden;
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: $color-bg-overlay;
    color: $color-primary;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__zoom-controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1001;
    display: flex;
    gap: 8px;
  }

  &__zoom-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background: $color-bg-overlay;
    color: $color-primary;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    user-select: none;
  }

  &__image {
    width: auto;
    height: 100%;
    max-width: none;
    max-height: none;
    transition: transform 0.05s ease-out;
  }
}
</style>
