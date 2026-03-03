<template>
  <view class="waterfall-wrapper">
    <!-- 左侧列 -->
    <view class="waterfall-column">
      <view
        v-for="note in leftColumnNotes"
        :key="note.id"
        class="waterfall-item"
      >
        <NoteCard :note="note" @click="handleNoteClick(note)" />
      </view>
    </view>

    <!-- 右侧列 -->
    <view class="waterfall-column">
      <view
        v-for="note in rightColumnNotes"
        :key="note.id"
        class="waterfall-item"
      >
        <NoteCard :note="note" @click="handleNoteClick(note)" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NoteCard from './NoteCard.vue'
import type { Note } from '@/types/api.types'

interface Props {
  notes: Note[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'noteClick', note: Note): void
}>()

// 固定两列
const columnCount = 2

// 将笔记分配到两列（交替分配）
const leftColumnNotes = computed(() => {
  return props.notes.filter((_, index) => index % columnCount === 0)
})

const rightColumnNotes = computed(() => {
  return props.notes.filter((_, index) => index % columnCount === 1)
})

const handleNoteClick = (note: Note) => {
  emit('noteClick', note)
}
</script>

<style scoped>
.waterfall-wrapper {
  display: flex;
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
  width: 100%;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.waterfall-item {
  animation: fadeSlideUp 0.3s ease-out backwards;
  width: 100%;
  box-sizing: border-box;
}

.waterfall-item:nth-child(1) { animation-delay: 0s; }
.waterfall-item:nth-child(2) { animation-delay: 0.05s; }
.waterfall-item:nth-child(3) { animation-delay: 0.1s; }
.waterfall-item:nth-child(4) { animation-delay: 0.15s; }
.waterfall-item:nth-child(5) { animation-delay: 0.2s; }
.waterfall-item:nth-child(6) { animation-delay: 0.25s; }

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
