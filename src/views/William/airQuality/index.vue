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
      <div >
        <div class="forecast-summary">
          <p>共 {{ 0 }} 個地區，平均 AQI: {{ 0 }}</p>
        </div>
        <transition-group name="forecast-list" tag="div" class="forecast-list">
          <div  class="forecast-card">
            <h2 class="area">{{ '台北' }}</h2>
            <div  class="api good">
              AQI: {{123}}
              <span class="aqi-label">{{ 123 }}</span>
            </div>
            <div class="details">
              <p><strong>主要污染物：</strong> {{  '無' }}</p>
              <p><strong>狀態：</strong> {{'無' }}</p>
              <p><strong>發布時間：</strong> {{ '無' }}</p>
            </div>
            <div class="health-effects">
              <h3>健康影響</h3>
              <p>{{ '空氣品質令人滿意，基本無空氣污染。' }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


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