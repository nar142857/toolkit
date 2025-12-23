<template>
  <aside class="sidebar-nav">
    <div class="sidebar-header">
      <h3>工具分类</h3>
    </div>
    
    <div class="category-list">
      <div 
        v-for="category in categories"
        :key="category"
        :class="['category-item', { active: activeCategory === category }]"
        @click="handleCategoryChange(category)"
      >
        <t-icon :name="getCategoryIcon(category)" />
        <span class="category-name">{{ category }}</span>
        <span class="tool-count" v-if="getToolCount(category) > 0">
          {{ getToolCount(category) }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToolsStore } from '../stores/tools'

const toolsStore = useToolsStore()

// 计算属性
const activeCategory = computed(() => toolsStore.selectedCategory)
const categories = computed(() => ['全部工具', ...toolsStore.categories])

// 获取分类图标
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

// 获取分类工具数量
const getToolCount = (category: string): number => {
  if (category === '全部工具') {
    return toolsStore.tools.length
  }
  return toolsStore.tools.filter(tool => tool.category === category).length
}

// 处理分类切换
const handleCategoryChange = (category: string) => {
  toolsStore.setSelectedCategory(category)
}
</script>

<style scoped>
.sidebar-nav {
  width: 240px;
  background: var(--td-bg-color-container);
  border-right: 1px solid var(--td-component-border);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--td-component-border);
  background: var(--td-brand-color-1);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.category-list {
  padding: 16px 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: var(--td-text-color-secondary);
}

.category-item:hover {
  background: var(--td-bg-color-container-hover);
  color: var(--td-text-color-primary);
}

.category-item.active {
  background: var(--td-brand-color-1);
  color: var(--td-brand-color-7);
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--td-brand-color-7);
}

.category-item .t-icon {
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-count {
  font-size: 12px;
  background: var(--td-gray-color-2);
  color: var(--td-text-color-placeholder);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.category-item.active .tool-count {
  background: var(--td-brand-color-7);
  color: white;
}
</style>