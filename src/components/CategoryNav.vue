<template>
  <nav class="category-nav">
    <t-tabs 
      :value="activeCategory" 
      @change="handleCategoryChange"
      placement="bottom"
      :show-add-icon="false"
      :scroll-threshold="10"
    >
      <t-tab-panel
        v-for="category in categories"
        :key="category"
        :value="category"
        :label="category"
      >
        <template #label>
          <div class="category-label">
            <t-icon :name="getCategoryIcon(category)" />
            <span>{{ category }}</span>
          </div>
        </template>
      </t-tab-panel>
    </t-tabs>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToolsStore } from '../stores/tools'

const toolsStore = useToolsStore()

// 计算属性
const activeCategory = computed({
  get: () => toolsStore.selectedCategory,
  set: (value: string) => toolsStore.setSelectedCategory(value)
})

const categories = computed(() => ['全部工具', ...toolsStore.categories])

// 分类图标映射
const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    '全部工具': 'apps',
    '文本工具': 'text-format',
    '语言工具': 'translation',
    '财务工具': 'money-circle',
    '日期时间': 'calendar',
    '换算工具': 'swap',
    '图像工具': 'image',
    '便民查询': 'search',
    '开发工具': 'code',
    '编码解码': 'lock-on',
    '网络工具': 'wifi'
  }
  return iconMap[category] || 'tools'
}

// 处理分类切换
const handleCategoryChange = (value: string) => {
  toolsStore.setSelectedCategory(value)
}
</script>

<style scoped>
.category-nav {
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-component-border);
  padding: 0 16px;
  margin-bottom: 24px;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.category-label .t-icon {
  font-size: 16px;
}
</style>