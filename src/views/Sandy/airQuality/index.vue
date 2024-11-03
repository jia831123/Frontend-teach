<template>
  <div class="air-quality-container">
    <div class="fixed-header">
      <h1 class="title">空氣品質預報</h1>
      <div class="controls">
        <select v-model="selectedArea" @change="filterForecasts">
          <option value="">選擇地區</option>
          <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
        </select>

        <select v-model="sortBy" @change="sortForecasts">
          <option value="aqi">按 AQI 排序</option>
          <option value="area">按地區排序</option>
          <option value="publishtime">按發布時間排序</option>
        </select>

        <select v-model="selectedLimit" @change="updateForecasts">
          <option value="5">顯示 5 筆</option>
          <option value="10">顯示 10 筆</option>
          <option value="50">顯示 50 筆</option>
        </select>
      </div>
    </div>
    <div class="content">
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        正在載入資料...
      </div>
      <div v-else>
        <div class="forecast-summary">
          <p>共 {{ filteredForecasts.length }} 個地區，平均 AQI: {{ averageAQI }}</p>
        </div>
        <transition-group name="forecast-list" tag="div" class="forecast-list">
          <div v-for="forecast in filteredForecasts" :key="forecast.publishtime" :class="['forecast-card', getAreaClass(forecast.area)]">
            <h2 class="area">{{ forecast.area }}</h2>
            <div :class="['aqi', getAqiClass(forecast.aqi)]">
              AQI: {{ forecast.aqi }}
              <span class="aqi-label">{{ forecast.aqi }}</span>
            </div>
            <div class="details">
              <p><strong>主要污染物：</strong> {{ forecast.pollutant || '無' }}</p>
              <p><strong>狀態：</strong> {{ forecast.status || '無' }}</p>
              <p><strong>發布時間：</strong> {{ forecast.publishtime || '無' }}</p>
            </div>
            <div class="health-effects">
              <h3>健康影響</h3>
              <p>{{ getHealthEffect(forecast.aqi) }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'

const forecasts = ref([])
const selectedArea = ref('')
const sortBy = ref('aqi')
const selectedLimit = ref(10)
const isLoading = ref(false)

const areas = ref([])

const fetchForecasts = async () => {
  try {
    isLoading.value = true
    const response = await fetch(
      `https://us-central1-delta-vial-435710-e5.cloudfunctions.net/function-1?limit=${selectedLimit.value}`
    )
    const data = await response.json()
    forecasts.value = data.records
    areas.value = [...new Set(data.records.map(record => record.area))]
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filteredForecasts = computed(() => {
  let results = forecasts.value

  if (selectedArea.value) {
    results = results.filter(forecast => forecast.area === selectedArea.value)
  }

  if (sortBy.value === 'aqi') {
    results.sort((a, b) => a.aqi - b.aqi)
  } else if (sortBy.value === 'area') {
    results.sort((a, b) => a.area.localeCompare(b.area))
  } else if (sortBy.value === 'publishtime') {
    results.sort((a, b) => new Date(b.publishtime) - new Date(a.publishtime))
  }

  return results
})

watch(selectedLimit, fetchForecasts)

const averageAQI = computed(() => {
  const totalAQI = filteredForecasts.value.reduce((sum, forecast) => sum + forecast.aqi, 0)
  return filteredForecasts.value.length ? (totalAQI / filteredForecasts.value.length).toFixed(2) : 0
})

const getAqiClass = (aqi) => {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy-sensitive'
  if (aqi <= 200) return 'unhealthy'
  if (aqi <= 300) return 'very-unhealthy'
  return 'hazardous'
}

const getHealthEffect = (aqi) => {
  if (aqi <= 50) return '空氣品質令人滿意，基本無空氣污染。'
  if (aqi <= 100) return '空氣品質可接受，對少數敏感族群可能輕度影響。'
  if (aqi <= 150) return '敏感族群可能會有影響，一般民眾無明顯影響。'
  if (aqi <= 200) return '對所有族群健康開始產生影響。'
  if (aqi <= 300) return '健康影響嚴重，建議限制外出活動。'
  return '危害健康，建議避免外出。'
}

// 根據地區名稱返回不同的類別
const getAreaClass = (area) => {
  const areaColors = {
    '台北市': 'area-taipei',
    '新北市': 'area-new-taipei',
    '台中市': 'area-taichung',
    '高雄市': 'area-kaohsiung',
    '台南市': 'area-tainan',
  }
  return areaColors[area] || 'area-default'
}

onMounted(fetchForecasts)
</script>

<style scoped>
.air-quality-container {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  align-items: center;
}

.fixed-header {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
  color: var(--color-heading);
  margin-bottom: 20px;
  width: 100%;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

.controls input,
.controls select {
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
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
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 各縣市底色 */
.area-taipei { background-color: #f4f1bb; }
.area-new-taipei { background-color: #ffcccb; }
.area-taichung { background-color: #d4e157; }
.area-kaohsiung { background-color: #ffd54f; }
.area-tainan { background-color: #90caf9; }
.area-default { background-color: #f2f2f2; }

.aqi {
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.good { color: #00e400; }
.moderate { color: #ffff00; }
.unhealthy-sensitive { color: #ff7e00; }
.unhealthy { color: #ff0000; }
.very-unhealthy { color: #8f3f97; }
.hazardous { color: #7e0023; }

.details {
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.health-effects h3 {
  font-size: 1rem;
  margin-bottom: 5px;
}
</style>
