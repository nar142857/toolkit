<template>
  <t-card :title="tool.name" hover-shadow class="tool-card">
    <template #actions>
      <t-tag theme="primary" size="small">{{ tool.usageCount }}次使用</t-tag>
    </template>
    <p class="tool-description">{{ tool.description }}</p>
    <div class="tool-footer">
      <t-tag theme="warning" size="small">{{ tool.category }}</t-tag>
      <t-button variant="text" @click="navigateToTool">
        立即使用 <t-icon name="chevron-right" />
      </t-button>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { Tool } from '../stores/tools'
import { useRouter } from 'vue-router'

interface Props {
  tool: Tool
}

const props = defineProps<Props>()

const router = useRouter()

const navigateToTool = () => {
  // 跳转到工具详情页
  router.push(`/tool/${props.tool.id}`)
}
</script>

<style scoped>
.tool-card {
  margin-bottom: 16px;
  transition: transform 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-2px);
}

.tool-description {
  color: var(--td-text-color-secondary);
  margin: 8px 0 12px 0;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>