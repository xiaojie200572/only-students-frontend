<template>
  <view class="waterfall-wrapper">
    <view class="waterfall-column">
      <view
        v-for="note in column1Notes"
        :key="note.id"
        class="waterfall-item"
      >
        <NoteCard :note="note" @click="handleNoteClick(note)" />
      </view>
    </view>
    <view class="waterfall-column">
      <view
        v-for="note in column2Notes"
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

// 基于估算高度的"最短列优先"算法
const column1Notes = computed(() => {
  const result: Note[] = []
  const column2: Note[] = []
  
  // 估算每列高度（基于标题长度 + 是否有图片）
  let height1 = 0
  let height2 = 0
  
  for (const note of props.notes) {
    // 估算每个卡片的高度
    // 基础高度 + 标题高度 + 图片高度(如果有)
    const titleHeight = note.title ? Math.ceil(note.title.length / 10) * 20 : 0
    const hasImage = !!note.coverImage
    // 假设图片高度约为 200-300，根据宽高比调整
    const imageHeight = hasImage ? 250 : 0
    const cardHeight = 100 + titleHeight + imageHeight
    
    if (height1 <= height2) {
      result.push(note)
      height1 += cardHeight
    } else {
      column2.push(note)
      height2 += cardHeight
    }
  }
  
  return result
})

const column2Notes = computed(() => {
  const column1: Note[] = []
  const result: Note[] = []
  
  let height1 = 0
  let height2 = 0
  
  for (const note of props.notes) {
    const titleHeight = note.title ? Math.ceil(note.title.length / 10) * 20 : 0
    const hasImage = !!note.coverImage
    const imageHeight = hasImage ? 250 : 0
    const cardHeight = 100 + titleHeight + imageHeight
    
    if (height1 <= height2) {
      column1.push(note)
      height1 += cardHeight
    } else {
      result.push(note)
      height2 += cardHeight
    }
  }
  
  return result
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
