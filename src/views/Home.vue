<template>
  <div class="home-container">
    <SidebarNav />
    
    <main class="app-main">
      <header class="app-header">
        <h1 class="app-title">工具合集</h1>
        <p class="app-subtitle">便捷的在线工具集合</p>
      </header>

      <section class="section">
        <h2 class="section-title">热门工具</h2>
        <t-row :gutter="[16, 16]">
          <t-col 
            v-for="tool in popularTools" 
            :key="tool.id" 
            :span="{ xs: 12, sm: 8, md: 6, lg: 4 }"
          >
            <ToolCard :tool="tool" />
          </t-col>
        </t-row>
      </section>

      <section class="section">
        <h2 class="section-title">{{ toolsStore.selectedCategory }}</h2>
        <t-row :gutter="[16, 16]">
          <t-col 
            v-for="tool in filteredTools" 
            :key="tool.id" 
            :span="{ xs: 12, sm: 8, md: 6, lg: 4 }"
          >
            <ToolCard :tool="tool" />
          </t-col>
        </t-row>
        <div v-if="filteredTools.length === 0" class="empty-state">
          <t-empty description="该分类暂无工具" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useToolsStore } from '../stores/tools'
import { useRoute } from 'vue-router'
import ToolCard from '../components/ToolCard.vue'
import SidebarNav from '../components/SidebarNav.vue'

const toolsStore = useToolsStore()
const route = useRoute()

onMounted(async () => {
  console.log('应用已启动，工具数据已加载')
  
  // 初始化API连接
  await toolsStore.initializeApi()
  
  // 检查URL参数，设置分类
  const categoryParam = route.query.category as string
  if (categoryParam) {
    toolsStore.setSelectedCategory(categoryParam)
  }
})

const filteredTools = computed(() => toolsStore.filteredTools)
const popularTools = computed(() => toolsStore.popularTools)
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: var(--td-bg-color-page);
  display: flex;
}

.app-main {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  padding: 48px 32px 32px;
  background: linear-gradient(135deg, var(--td-brand-color-1), var(--td-brand-color-3));
  color: var(--td-font-gray-1);
}

.app-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
}

.section {
  margin-bottom: 48px;
  padding: 0 32px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--td-text-color-primary);
  border-bottom: 2px solid var(--td-brand-color-7);
  padding-bottom: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container .sidebar-nav {
    transform: translateX(-100%);
  }
  
  .app-main {
    margin-left: 0;
  }
  
  .section {
    padding: 0 16px;
  }
  
  .app-header {
    padding: 32px 16px 24px;
  }
}
</style>