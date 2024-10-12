<template>
  <div class="air-quality-container">
    <div class="fixed-header">
      <h1 class="title">空氣品質預報</h1>
      <div class="controls">
        <input v-model="searchQuery" placeholder="搜尋地區..." @input="filterForecasts" />
        <select v-model="sortBy" @change="sortForecasts">
          <option value="aqi">按 AQI 排序</option>
          <option value="area">按地區排序</option>
          <option value="publishtime">按發布時間排序</option>
        </select>
      </div>
    </div>
    <div class="content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        載入中...
      </div>
      <div v-else-if="error" class="error">發生錯誤：{{ error }}</div>
      <div v-else>
        <div class="forecast-summary">
          <p>共 {{ filteredForecasts.length }} 個地區，平均 AQI: {{ averageAQI }}</p>
        </div>
        <transition-group name="forecast-list" tag="div" class="forecast-list">
          <div v-for="forecast in filteredForecasts" :key="forecast.publishtime" class="forecast-card">
            <h2 class="area">{{ forecast.area }}</h2>
            <div class="aqi" :class="getAQIClass(Number(forecast.aqi))">
              AQI: {{ forecast.aqi }}
              <span class="aqi-label">{{ getAQILabel(Number(forecast.aqi)) }}</span>
            </div>
            <div class="details">
              <p><strong>主要污染物：</strong> {{ forecast.minorpollutant || '無' }}</p>
              <p><strong>發布時間：</strong> {{ formatDate(forecast.publishtime) }}</p>
            </div>
            <div class="health-effects">
              <h3>健康影響</h3>
              <p>{{ getHealthEffects(Number(forecast.aqi)) }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export type Response = {
  fields: Array<{
    id: string
    type: string
    info: {
      label: string
    }
  }>
  resource_id: string
  __extras: {
    api_key: string
  }
  include_total: boolean
  total: string
  resource_format: string
  limit: string
  offset: string
  _links: {
    start: string
    next: string
  }
  records: Array<{
    content: string
    publishtime: string
    area: string
    majorpollutant: string
    forecastdate: string
    aqi: string
    minorpollutant: string
    minorpollutantaqi: string
  }>}
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const forecasts = ref<Response['records']>([])
const filteredForecasts = ref<Response['records']>([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const sortBy = ref('aqi')

const fetchForecasts = async () => {
  try {
    const response = await fetch('https://us-central1-delta-vial-435710-e5.cloudfunctions.net/function-1?limit=100')
    const data = await response.json()
    forecasts.value = data.records
    filteredForecasts.value = [...forecasts.value]
    sortForecasts()
  } catch (err:any) {
    error.value = err['message']
  } finally {
    loading.value = false
  }
}

const getAQIClass = (aqi: number) => {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy-sensitive'
  if (aqi <= 200) return 'unhealthy'
  if (aqi <= 300) return 'very-unhealthy'
  return 'hazardous'
}

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return '良好'
  if (aqi <= 100) return '中等'
  if (aqi <= 150) return '對敏感族群不健康'
  if (aqi <= 200) return '不健康'
  if (aqi <= 300) return '非常不健康'
  return '危險'
}

const getHealthEffects = (aqi: number) => {
  if (aqi <= 50) return '空氣品質令人滿意，基本無空氣污染。'
  if (aqi <= 100) return '空氣品質可接受，但某些污染物可能對極少數異常敏感人群健康有較弱影響。'
  if (aqi <= 150) return '易感人群症狀有輕度加劇，健康人群可能出現刺激症狀。'
  if (aqi <= 200) return '健康人群可能出現症狀，易感人群症狀加劇。'
  if (aqi <= 300) return '健康人群運動耐受力降低，有明顯強烈症狀，提前出現某些疾病。'
  return '健康人群可能感到明顯不適，易感人群可能出現嚴重症狀，建議避免戶外活動。'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const filterForecasts = () => {
  filteredForecasts.value = forecasts.value.filter(forecast => 
    forecast.area.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  sortForecasts()
}

const sortForecasts = () => {
  filteredForecasts.value.sort((a, b) => {
    if (sortBy.value === 'aqi') return Number(b.aqi) - Number(a.aqi)
    if (sortBy.value === 'area') return a.area.localeCompare(b.area)
    return new Date(b.publishtime).getTime() - new Date(a.publishtime).getTime()
  })
}

const averageAQI = computed(() => {
  const total = filteredForecasts.value.reduce((sum, forecast) => sum + Number(forecast.aqi), 0)
  return Math.round(total / filteredForecasts.value.length)
})

onMounted(fetchForecasts)
</script>

<style scoped>
.air-quality-container {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  align-items: center; /* 新增：確保內容居中 */
}

.fixed-header {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%; /* 新增：確保寬度為100% */
  display: flex; /* 新增：使用flex布局 */
  flex-direction: column; /* 新增：垂直排列子元素 */
  align-items: center; /* 新增：水平居中對齊子元素 */
}

.title {
  text-align: center;
  color: var(--color-heading);
  margin-bottom: 20px;
  width: 100%; /* 新增：確保標題寬度為100% */
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%; /* 新增：確保控制區域寬度為100% */
  max-width: 600px; /* 新增：限制最大寬度 */
}

.controls input, .controls select {
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.content {
  flex-grow: 1;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  display: flex; /* 新增：使用flex布局 */
  flex-direction: column; /* 新增：垂直排列子元素 */
  align-items: center; /* 新增：水平居中對齊子元素 */
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: var(--color-text);
}

.spinner {
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-heading);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.forecast-summary {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.forecast-card {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: var(--color-text);
  transition: all 0.3s ease;
}

.forecast-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.area {
  margin-top: 0;
  color: var(--color-heading);
}

.aqi {
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
  position: relative;
}

.aqi-label {
  font-size: 14px;
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--color-background);
  padding: 2px 6px;
  border-radius: 10px;
}

.good { background-color: #a8e05f; color: #33691e; }
.moderate { background-color: #fdd835; color: #f57f17; }
.unhealthy-sensitive { background-color: #ff9800; color: #e65100; }
.unhealthy { background-color: #f44336; color: #b71c1c; }
.very-unhealthy { background-color: #9c27b0; color: #4a148c; }
.hazardous { background-color: #7e0023; color: #ffffff; }

.details {
  margin-top: 10px;
  font-size: 14px;
}

.details p {
  margin: 5px 0;
}

.health-effects {
  margin-top: 15px;
  font-size: 14px;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.health-effects h3 {
  margin-bottom: 5px;
  color: var(--color-heading);
}

/* 添加過渡效果 */
.forecast-list-enter-active,
.forecast-list-leave-active {
  transition: all 0.5s ease;
}
.forecast-list-enter-from,
.forecast-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 添加媒體查詢以適應深色模式 */
@media (prefers-color-scheme: dark) {
  .forecast-card {
    background-color: var(--color-background-mute);
    box-shadow: 0 2px 4px rgba(255,255,255,0.1);
  }

  .forecast-card:hover {
    box-shadow: 0 4px 8px rgba(255,255,255,0.2);
  }

  .aqi-label {
    background-color: var(--color-background-soft);
  }
}

@media (max-width: 600px) {
  .controls {
    flex-direction: column;
    width: 90%; /* 調整：在小屏幕上稍微縮小寬度 */
  }

  .controls input, .controls select {
    width: 100%;
  }

  .forecast-card {
    max-width: 100%;
  }
}
</style>