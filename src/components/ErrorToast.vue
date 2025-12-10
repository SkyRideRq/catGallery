<template>
  <div class="error-toast" v-if="visible">
    <p>{{ message }}</p>
    <button class="error-toast__close" @click="visible = false">✕</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref<boolean>(false)

const close = () => {
  visible.value = false
  emit('close')
}

watch(
  () => props.show,
  (value: boolean) => {
    visible.value = value

    if (value) {
      setTimeout(() => {
        close()
      }, 3000)
    }
  },
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: $color-error;
  color: lighten($color-error, 30%);
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: bold;
  animation: slide 0.3s ease-out;
  display: flex;
  align-items: center;
  &__close {
    background: transparent;
    border: none;
    color: lighten($color-error, 30%);
    margin-left: 12px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: lighten($color-error, 50%);
    }
  }
}
@keyframes slide {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
