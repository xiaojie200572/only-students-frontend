<template>
  <view class="data-center-page">
    <view class="page-nav">
      <text class="nav-title">数据中心</text>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 我的收入 -->
      <view class="data-card">
        <view class="section-header">
          <text class="section-title">我的收入</text>
        </view>
        <view class="card-summary">
          <view class="summary-item">
            <text class="summary-value">¥{{ (incomeData.today / 100).toFixed(2) }}</text>
            <text class="summary-label">今日收入</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">¥{{ (incomeData.week / 100).toFixed(2) }}</text>
            <text class="summary-label">近7日</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">¥{{ (incomeData.month / 100).toFixed(2) }}</text>
            <text class="summary-label">近30日</text>
          </view>
        </view>
        <view class="card-chart">
          <view class="chart-tabs">
            <text 
              :class="['chart-tab', { active: incomeMetric === 'income' }]" 
              @click="changeIncomeMetric('income')"
            >收入</text>
          </view>
          <view class="trend-tabs">
            <text 
              :class="['trend-tab', { active: incomeDays === 7 }]" 
              @click="changeIncomeDays(7)"
            >7天</text>
            <text 
              :class="['trend-tab', { active: incomeDays === 30 }]" 
              @click="changeIncomeDays(30)"
            >30天</text>
          </view>
          <view class="chart-wrapper" ref="incomeChartRef">
            <view id="income-chart" class="trend-canvas"></view>
          </view>
        </view>
      </view>

      <!-- 互动数据 -->
      <view class="data-card">
        <view class="section-header">
          <text class="section-title">互动数据</text>
        </view>
        <view class="card-summary">
          <view class="summary-item">
            <text class="summary-value">{{ formatNumber(creatorSummary?.totalFavorites || 0) }}</text>
            <text class="summary-label">收藏</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ formatNumber(creatorSummary?.totalComments || 0) }}</text>
            <text class="summary-label">评论</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ formatNumber(creatorSummary?.totalShares || 0) }}</text>
            <text class="summary-label">分享</text>
          </view>
        </view>
        <view class="card-chart">
          <view class="chart-tabs">
            <text 
              v-for="m in interactionMetrics" 
              :key="m.value"
              :class="['chart-tab', { active: interactionMetric === m.value }]" 
              @click="changeInteractionMetric(m.value)"
            >{{ m.label }}</text>
          </view>
          <view class="trend-tabs">
            <text 
              :class="['trend-tab', { active: interactionDays === 7 }]" 
              @click="changeInteractionDays(7)"
            >7天</text>
            <text 
              :class="['trend-tab', { active: interactionDays === 30 }]" 
              @click="changeInteractionDays(30)"
            >30天</text>
          </view>
          <view class="chart-wrapper" ref="interactionChartRef">
            <view id="interaction-chart" class="trend-canvas"></view>
          </view>
        </view>
      </view>

      <!-- 流量数据 -->
      <view class="data-card">
        <view class="section-header">
          <text class="section-title">流量数据</text>
        </view>
        <view class="card-summary">
          <view class="summary-item">
            <text class="summary-value">{{ formatNumber(creatorSummary?.totalViews || 0) }}</text>
            <text class="summary-label">浏览</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ formatNumber(creatorSummary?.totalSubscribers || 0) }}</text>
            <text class="summary-label">粉丝</text>
          </view>
        </view>
        <view class="card-chart">
          <view class="chart-tabs">
            <text 
              v-for="m in trafficMetrics" 
              :key="m.value"
              :class="['chart-tab', { active: trafficMetric === m.value }]" 
              @click="changeTrafficMetric(m.value)"
            >{{ m.label }}</text>
          </view>
          <view class="trend-tabs">
            <text 
              :class="['trend-tab', { active: trafficDays === 7 }]" 
              @click="changeTrafficDays(7)"
            >7天</text>
            <text 
              :class="['trend-tab', { active: trafficDays === 30 }]" 
              @click="changeTrafficDays(30)"
            >30天</text>
          </view>
          <view class="chart-wrapper" ref="trafficChartRef">
            <view id="traffic-chart" class="trend-canvas"></view>
          </view>
        </view>
      </view>

      <!-- 我的评分 -->
      <view class="rating-section">
        <view class="section-header">
          <text class="section-title">我的评分</text>
        </view>
        <view class="rating-card">
          <view class="rating-stars">
            <text class="rating-value">{{ creatorSummary?.avgRating?.toFixed(1) || '0.0' }}</text>
            <view class="stars">
              <svg 
                v-for="i in 5" 
                :key="i" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                :fill="i <= Math.round(creatorSummary?.avgRating || 0) ? '#FFB800' : 'none'"
                :stroke="i <= Math.round(creatorSummary?.avgRating || 0) ? '#FFB800' : '#999'"
                stroke-width="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </view>
          </view>
          <text class="rating-count">已有 {{ creatorSummary?.totalRatings || 0 }} 人评分</text>
        </view>
      </view>

      <!-- 笔记数据列表 -->
      <view class="notes-section">
        <view class="section-header">
          <text class="section-title">笔记数据</text>
        </view>
        <view class="notes-list">
          <view class="note-item" v-for="note in notes" :key="note.id" @click="goToNote(note.noteId)">
            <view class="note-cover">
              <view class="note-cover-placeholder">
                <text>笔记</text>
              </view>
            </view>
            <view class="note-info">
              <text class="note-title">笔记 {{ note.noteId }}</text>
              <view class="note-stats">
                <text class="note-stat">浏览 {{ note.totalViews || 0 }}</text>
                <text class="note-stat">热度 {{ note.heatScore || 0 }}</text>
              </view>
            </view>
          </view>
          <view v-if="notes.length === 0" class="empty-notes">
            <text>暂无笔记数据</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <TabBar :current="-1" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/stores/user'
import { analyticsApi, type NoteStats } from '@/api/analytics'
import TabBar from '@/components/TabBar.vue'

const userStore = useUserStore()
const creatorId = ref<number>(0)

const creatorSummary = ref<any>(null)
const notes = ref<NoteStats[]>([])

// 收入图表
const incomeDays = ref(7)
const incomeMetric = ref('income')
const incomeChartRef = ref<any>(null)
const incomeChartData = ref<any[]>([])
let incomeChartInstance: echarts.ECharts | null = null

// 互动图表
const interactionDays = ref(7)
const interactionMetric = ref('favorites')
const interactionMetrics = [
  { label: '收藏', value: 'favorites', color: '#2196F3' },
  { label: '评论', value: 'comments', color: '#4CAF50' },
  { label: '分享', value: 'shares', color: '#9C27B0' }
]
const interactionChartRef = ref<any>(null)
const interactionChartData = ref<any[]>([])
let interactionChartInstance: echarts.ECharts | null = null

// 流量图表
const trafficDays = ref(7)
const trafficMetric = ref('views')
const trafficMetrics = [
  { label: '浏览', value: 'views', color: '#FF9800' },
  { label: '粉丝', value: 'subscribers', color: '#00BCD4' }
]
const trafficChartRef = ref<any>(null)
const trafficChartData = ref<any[]>([])
let trafficChartInstance: echarts.ECharts | null = null

const incomeData = ref({
  today: 0,
  week: 0,
  month: 0
})

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return String(num)
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 152, 0'
}

const loadCreatorSummary = async () => {
  if (!creatorId.value) return
  
  try {
    const result = await analyticsApi.getCreatorSummary(creatorId.value)
    if (!result) return
    
    creatorSummary.value = result
    
    incomeData.value = {
      today: result.todayIncome || 0,
      week: result.weekIncome || 0,
      month: result.monthIncome || 0
    }
  } catch (error) {
    console.error('获取创作者汇总失败:', error)
  }
}

const loadNotes = async () => {
  if (!creatorId.value) return
  
  try {
    const result = await analyticsApi.getNotesByCreator(creatorId.value)
    notes.value = result || []
  } catch (error) {
    console.error('获取笔记列表失败:', error)
  }
}

const getTrendData = async (days: number) => {
  if (!creatorId.value) return []
  
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const startStr = startDate.toISOString().split('T')[0]
    const endStr = endDate.toISOString().split('T')[0]
    
    const result = await analyticsApi.getDailyStatsRange(creatorId.value, startStr, endStr)
    return result || []
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    return []
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.slice(5)
}

const createChartOption = (data: any[], metric: string, color: string, isIncome: boolean = false) => {
  const fieldMap: Record<string, string> = {
    views: 'newViews',
    favorites: 'newFavorites',
    comments: 'newComments',
    shares: 'newShares',
    subscribers: 'newSubscribers',
    income: 'incomeAmount'
  }
  
  const field = fieldMap[metric] || 'newViews'
  const dates = data.map(d => formatDate(d.statsDate))
  const values = data.map(d => {
    const val = d[field]
    return isIncome ? (val ? val / 100 : 0) : (val || 0)
  })
  
  const rgbColor = hexToRgb(color)
  
  return {
    grid: {
      left: 40,
      right: 20,
      top: 10,
      bottom: 25
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999', fontSize: 10 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { 
        color: '#999', 
        fontSize: 10,
        formatter: (value: number) => {
          if (isIncome) return `¥${value}`
          return String(value)
        }
      },
      splitLine: { lineStyle: { color: '#f5f5f5' } }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      confine: true,
      enterable: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff', fontSize: 12 },
      padding: [8, 12],
      borderWidth: 0,
      formatter: (params: any) => {
        console.log('tooltip triggered:', params)
        const data = params[0]
        const val = isIncome ? `¥${data.value}` : data.value
        return `${data.name}\n${val}`
      }
    },
    series: [{
      type: 'line',
      data: values,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      triggerLineEvent: true,
      triggerItemEvent: true,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `rgba(${rgbColor}, 0.3)` },
          { offset: 1, color: `rgba(${rgbColor}, 0.05)` }
        ])
      }
    }]
  }
}

const initIncomeChart = async () => {
  await nextTick()
  if (typeof window !== 'undefined') {
    const container = document.getElementById('income-chart') as HTMLElement
    if (container) {
      incomeChartInstance = echarts.init(container)
      updateIncomeChart()
      
      // 触摸事件处理 - 手动触发 tooltip
      container.addEventListener('touchstart', (e) => {
        if (!incomeChartInstance || !incomeChartData.value.length) return
        const x = e.touches[0].clientX - container.getBoundingClientRect().left
        const y = e.touches[0].clientY - container.getBoundingClientRect().top
        const pointInGrid = incomeChartInstance.convertFromPixel('grid', [x, y])
        if (pointInGrid) {
          const dataIndex = Math.floor(pointInGrid[0])
          if (dataIndex >= 0 && dataIndex < incomeChartData.value.length) {
            incomeChartInstance.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: dataIndex
            })
          }
        }
      })
    }
  }
}

const updateIncomeChart = () => {
  if (!incomeChartInstance || !incomeChartData.value.length) return
  const option = createChartOption(incomeChartData.value, incomeMetric.value, '#FFD700', true)
  incomeChartInstance.setOption(option)
}

const loadIncomeData = async () => {
  incomeChartData.value = await getTrendData(incomeDays.value)
  if (!incomeChartInstance) {
    initIncomeChart()
  } else {
    updateIncomeChart()
  }
}

const changeIncomeDays = (days: number) => {
  incomeDays.value = days
  loadIncomeData()
}

const changeIncomeMetric = (metric: string) => {
  incomeMetric.value = metric
  updateIncomeChart()
}

const initInteractionChart = async () => {
  await nextTick()
  if (typeof window !== 'undefined') {
    const container = document.getElementById('interaction-chart') as HTMLElement
    if (container) {
      interactionChartInstance = echarts.init(container)
      updateInteractionChart()
      
      container.addEventListener('touchstart', (e) => {
        if (!interactionChartInstance || !interactionChartData.value.length) return
        const x = e.touches[0].clientX - container.getBoundingClientRect().left
        const y = e.touches[0].clientY - container.getBoundingClientRect().top
        const pointInGrid = interactionChartInstance.convertFromPixel('grid', [x, y])
        if (pointInGrid) {
          const dataIndex = Math.floor(pointInGrid[0])
          if (dataIndex >= 0 && dataIndex < interactionChartData.value.length) {
            interactionChartInstance.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: dataIndex
            })
          }
        }
      })
    }
  }
}

const updateInteractionChart = () => {
  if (!interactionChartInstance || !interactionChartData.value.length) return
  const metric = interactionMetrics.find(m => m.value === interactionMetric.value)
  const color = metric?.color || '#2196F3'
  const option = createChartOption(interactionChartData.value, interactionMetric.value, color)
  interactionChartInstance.setOption(option)
}

const loadInteractionData = async () => {
  interactionChartData.value = await getTrendData(interactionDays.value)
  if (!interactionChartInstance) {
    initInteractionChart()
  } else {
    updateInteractionChart()
  }
}

const changeInteractionDays = (days: number) => {
  interactionDays.value = days
  loadInteractionData()
}

const changeInteractionMetric = (metric: string) => {
  interactionMetric.value = metric
  updateInteractionChart()
}

const initTrafficChart = async () => {
  await nextTick()
  if (typeof window !== 'undefined') {
    const container = document.getElementById('traffic-chart') as HTMLElement
    if (container) {
      trafficChartInstance = echarts.init(container)
      updateTrafficChart()
      
      container.addEventListener('touchstart', (e) => {
        if (!trafficChartInstance || !trafficChartData.value.length) return
        const x = e.touches[0].clientX - container.getBoundingClientRect().left
        const y = e.touches[0].clientY - container.getBoundingClientRect().top
        const pointInGrid = trafficChartInstance.convertFromPixel('grid', [x, y])
        if (pointInGrid) {
          const dataIndex = Math.floor(pointInGrid[0])
          if (dataIndex >= 0 && dataIndex < trafficChartData.value.length) {
            trafficChartInstance.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: dataIndex
            })
          }
        }
      })
    }
  }
}

const updateTrafficChart = () => {
  if (!trafficChartInstance || !trafficChartData.value.length) return
  const metric = trafficMetrics.find(m => m.value === trafficMetric.value)
  const color = metric?.color || '#FF9800'
  const option = createChartOption(trafficChartData.value, trafficMetric.value, color)
  trafficChartInstance.setOption(option)
}

const loadTrafficData = async () => {
  trafficChartData.value = await getTrendData(trafficDays.value)
  if (!trafficChartInstance) {
    initTrafficChart()
  } else {
    updateTrafficChart()
  }
}

const changeTrafficDays = (days: number) => {
  trafficDays.value = days
  loadTrafficData()
}

const changeTrafficMetric = (metric: string) => {
  trafficMetric.value = metric
  updateTrafficChart()
}

const goToNote = (noteId: number) => {
  uni.navigateTo({
    url: `/pages/note/detail?id=${noteId}`
  })
}

const handleResize = () => {
  if (incomeChartInstance) incomeChartInstance.resize()
  if (interactionChartInstance) interactionChartInstance.resize()
  if (trafficChartInstance) trafficChartInstance.resize()
}

onMounted(() => {
  const userId = userStore.userInfo?.id
  if (userId) {
    creatorId.value = userId
    loadCreatorSummary()
    loadNotes()
    loadIncomeData()
    loadInteractionData()
    loadTrafficData()
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (incomeChartInstance) {
    incomeChartInstance.dispose()
    incomeChartInstance = null
  }
  if (interactionChartInstance) {
    interactionChartInstance.dispose()
    interactionChartInstance = null
  }
  if (trafficChartInstance) {
    trafficChartInstance.dispose()
    trafficChartInstance = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.data-center-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.content-area {
  margin-top: 60px;
  padding: 16px;
  padding-bottom: 80px;
}

/* 数据卡片通用样式 */
.data-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 卡片汇总数字 */
.card-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.summary-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-label {
  font-size: 9px;
  color: var(--text-primary);
}

/* 图表区域 */
.card-chart {
  position: relative;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chart-tab {
  font-size: 12px;
  color: var(--text-tertiary);
  padding: 4px 10px;
  border-radius: 10px;
  background: var(--bg-secondary);
}

.chart-tab.active {
  background: var(--accent-warm);
  color: #fff;
}

.trend-tabs {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
}

.trend-tab {
  font-size: 12px;
  color: var(--text-tertiary);
  padding: 4px 10px;
  border-radius: 10px;
}

.trend-tab.active {
  background: var(--accent-warm);
  color: #fff;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
}

.trend-canvas {
  width: 100%;
  height: 100%;
  min-height: 160px;
}

/* 评分 */
.rating-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.rating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-value {
  font-size: 36px;
  font-weight: 700;
  color: #FFB800;
}

.stars {
  display: flex;
  gap: 4px;
}

.rating-count {
  font-size: 14px;
  color: var(--text-tertiary);
}

/* 笔记列表 */
.notes-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.note-cover {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.note-cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-tertiary);
}

.note-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-stats {
  display: flex;
  gap: 12px;
}

.note-stat {
  font-size: 12px;
  color: var(--text-tertiary);
}

.empty-notes {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
}

/* 响应式布局 - 平板及以上 */
@media (min-width: 768px) {
  .content-area {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 0;
  }
  
  .page-nav {
    max-width: 960px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .data-card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .summary-value {
    font-size: 22px;
  }
  
  .summary-label {
    font-size: 14px;
  }
  
  .chart-wrapper {
    height: 200px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .note-item {
    padding: 12px;
  }
  
  .note-cover {
    width: 80px;
    height: 80px;
  }
  
  .note-title {
    font-size: 16px;
  }
}

/* 响应式布局 - 笔记本及以上 */
@media (min-width: 1024px) {
  .content-area {
    max-width: 1100px;
  }
  
  .page-nav {
    max-width: 1100px;
  }
  
  .data-card {
    padding: 24px;
  }
  
  .card-summary {
    gap: 12px;
  }
  
  .summary-item {
    padding: 12px;
  }
  
  .summary-value {
    font-size: 20px;
  }
  
  .summary-label {
    font-size: 12px;
  }
  
  .chart-wrapper {
    height: 240px;
  }
  
  .rating-card {
    padding: 30px;
  }
  
  .rating-value {
    font-size: 48px;
  }
}

/* 响应式布局 - 桌面及以上 */
@media (min-width: 1280px) {
  .content-area {
    max-width: 1200px;
    padding: 32px 0;
  }
  
  .page-nav {
    max-width: 1200px;
    height: 70px;
  }
  
  .nav-title {
    font-size: 20px;
  }
  
  .content-area {
    margin-top: 70px;
  }
  
  .data-card {
    padding: 28px;
    border-radius: 20px;
  }
  
  .summary-value {
    font-size: 30px;
  }
  
  .chart-wrapper {
    height: 280px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .notes-section {
    padding: 24px;
    border-radius: 16px;
  }
  
  .note-item {
    padding: 16px;
  }
  
  .note-cover {
    width: 100px;
    height: 100px;
  }
  
  .note-title {
    font-size: 18px;
  }
  
  .note-stat {
    font-size: 14px;
  }
}
</style>
