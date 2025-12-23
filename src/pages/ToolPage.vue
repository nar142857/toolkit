<template>
  <div class="tool-page">
    <SidebarNav />
    
    <main class="tool-main">
      <!-- 工具页眉 -->
      <header class="tool-page-header">
        <div class="header-content">
          <div class="tool-breadcrumb">
            <t-breadcrumb>
              <t-breadcrumb-item>
                <router-link to="/">首页</router-link>
              </t-breadcrumb-item>
              <t-breadcrumb-item>
                <router-link :to="'/?category=' + selectedCategory">
                  {{ selectedCategory }}
                </router-link>
              </t-breadcrumb-item>
              <t-breadcrumb-item>{{ currentTool?.name }}</t-breadcrumb-item>
            </t-breadcrumb>
          </div>
          
          <div class="tool-title-section">
            <h1 class="tool-page-title">{{ currentTool?.name }}</h1>
            <p class="tool-page-description">{{ currentTool?.description }}</p>
          </div>
        </div>
      </header>

      <!-- 工具内容区域 -->
      <section class="tool-content-section">
        <div v-if="currentToolComponent">
          <component :is="currentToolComponent" />
        </div>
        <div v-else class="tool-not-found">
          <t-empty description="工具不存在或正在开发中">
            <t-button @click="$router.push('/')">
              <t-icon name="chevron-left" />
              返回首页
            </t-button>
          </t-empty>
        </div>
      </section>

      <!-- 相关工具推荐 -->
      <section class="related-tools-section" v-if="relatedTools.length > 0">
        <h3>相关工具</h3>
        <t-row :gutter="[16, 16]">
          <t-col 
            v-for="tool in relatedTools" 
            :key="tool.id" 
            :span="{ xs: 12, sm: 8, md: 6, lg: 4 }"
          >
            <ToolCard :tool="tool" />
          </t-col>
        </t-row>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolsStore } from '../stores/tools'
import SidebarNav from '../components/SidebarNav.vue'
import ToolCard from '../components/ToolCard.vue'
import TextDeduplication from '../components/TextDeduplication.vue'

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const toolsStore = useToolsStore()

// 当前工具ID
const toolId = computed(() => parseInt(route.params.id as string))

// 当前工具信息
const currentTool = computed(() => {
  return toolsStore.tools.find(tool => tool.id === toolId.value)
})

// 选中分类
const selectedCategory = computed(() => currentTool.value?.category || '全部工具')

// 工具组件映射
const componentMap: Record<number, any> = {
  1: TextDeduplication, // 文本去重
  // 后续可以添加更多工具组件
}

// 当前工具组件
const currentToolComponent = computed(() => {
  return componentMap[toolId.value] || null
})

// 相关工具推荐（同分类的其他工具）
const relatedTools = computed(() => {
  if (!currentTool.value) return []
  
  return toolsStore.tools
    .filter(tool => 
      tool.category === currentTool.value!.category && 
      tool.id !== toolId.value
    )
    .slice(0, 4) // 只显示前4个相关工具
})

// 组件挂载时的处理
onMounted(async () => {
  // 如果工具不存在，可以重定向到首页
  if (!currentTool.value) {
    console.warn(`工具 ID ${toolId.value} 不存在`)
  } else {
    // 异步记录工具使用次数到后端
    await toolsStore.updateToolUsage(toolId.value)
    console.log(`正在使用工具: ${currentTool.value.name}`)
  }
})
</script>

<style scoped>
.tool-page {
  min-height: 100vh;
  background-color: var(--td-bg-color-page);
  display: flex;
}

.tool-main {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
}

.tool-page-header {
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-component-border);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
}

.tool-breadcrumb {
  margin-bottom: 16px;
}

.tool-title-section {
  text-align: center;
}

.tool-page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--td-text-color-primary);
}

.tool-page-description {
  font-size: 1.1rem;
  color: var(--td-text-color-secondary);
  margin: 0;
}

.tool-content-section {
  padding: 32px;
}

.tool-not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.related-tools-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px 48px;
}

.related-tools-section h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--td-text-color-primary);
  border-bottom: 2px solid var(--td-brand-color-7);
  padding-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-main {
    margin-left: 0;
  }
  
  .header-content {
    padding: 16px;
  }
  
  .tool-content-section {
    padding: 16px;
  }
  
  .related-tools-section {
    padding: 0 16px 32px;
  }
  
  .tool-page-title {
    font-size: 2rem;
  }
  
  .tool-breadcrumb {
    margin-bottom: 12px;
  }
}

/* 面包屑导航样式 */
:deep(.t-breadcrumb-item a) {
  color: var(--td-brand-color-7);
  text-decoration: none;
  transition: color 0.2s ease;
}

:deep(.t-breadcrumb-item a:hover) {
  color: var(--td-brand-color-6);
}
</style>