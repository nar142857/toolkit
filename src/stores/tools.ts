import { defineStore } from 'pinia'
import { toolsApi, healthApi } from '../services/api'

export interface Tool {
  id: number
  name: string
  description: string
  category: string
  usageCount: number
  todayUsage: number
}

export const useToolsStore = defineStore('tools', {
  state: () => ({
    tools: [
      { id: 1, name: '文本去重', description: '快速去除重复文本', category: '文本工具', usageCount: 1024, todayUsage: 45 },
      { id: 2, name: '大小写转换', description: '英文大小写快速转换', category: '文本工具', usageCount: 856, todayUsage: 23 },
      { id: 3, name: '简繁转换', description: '简体中文与繁体中文互转', category: '语言工具', usageCount: 2341, todayUsage: 67 },
      { id: 4, name: 'URL编码解码', description: 'URL编码与解码工具', category: '编码解码', usageCount: 1523, todayUsage: 34 },
      { id: 5, name: '人民币大写', description: '数字转人民币大写格式', category: '财务工具', usageCount: 756, todayUsage: 12 },
      { id: 6, name: '农历转换', description: '公历农历日期互转', category: '日期时间', usageCount: 1823, todayUsage: 41 },
      { id: 7, name: '进制转换', description: '二进制八进制十进制十六进制互转', category: '换算工具', usageCount: 634, todayUsage: 8 },
      { id: 8, name: '二维码生成', description: '文本生成二维码图片', category: '图像工具', usageCount: 2105, todayUsage: 89 },
      { id: 9, name: '身份证查询', description: '身份证号码归属地查询', category: '便民查询', usageCount: 1456, todayUsage: 32 },
      { id: 10, name: 'JSON格式化', description: 'JSON数据格式化和美化', category: '开发工具', usageCount: 2789, todayUsage: 76 },
      { id: 11, name: 'Base64编码', description: 'Base64编码与解码', category: '编码解码', usageCount: 1324, todayUsage: 28 },
      { id: 12, name: 'IP地址查询', description: 'IP地址归属地和运营商查询', category: '网络工具', usageCount: 967, todayUsage: 19 },
    ] as Tool[],
    categories: ['文本工具', '语言工具', '财务工具', '日期时间', '换算工具', '图像工具', '便民查询', '开发工具', '编码解码', '网络工具'],
    selectedCategory: '全部工具',
    apiStatus: 'loading' as 'loading' | 'connected' | 'error',
    lastSyncTime: null as Date | null
  }),

  getters: {
    filteredTools: (state) => {
      if (state.selectedCategory === '全部工具') {
        return state.tools
      }
      return state.tools.filter(tool => tool.category === state.selectedCategory)
    },

    popularTools: (state) => {
      return [...state.tools].sort((a, b) => b.usageCount - a.usageCount).slice(0, 6)
    }
  },

  actions: {
    setSelectedCategory(category: string) {
      this.selectedCategory = category
    },

    // 本地更新使用次数
    incrementUsage(toolId: number) {
      const tool = this.tools.find(t => t.id === toolId)
      if (tool) {
        tool.usageCount++
        tool.todayUsage++
      }
    },

    // 异步更新使用次数到后端
    async updateToolUsage(toolId: number) {
      try {
        // 本地立即更新
        this.incrementUsage(toolId)
        
        // 异步更新到后端
        await toolsApi.updateUsage(toolId)
        
        console.log(`Tool ${toolId} usage updated successfully`)
      } catch (error) {
        console.error('Failed to update tool usage:', error)
        // 即使后端更新失败，本地数据已经更新
      }
    },

    // 从后端同步工具数据
    async syncToolsFromApi() {
      try {
        this.apiStatus = 'loading'
        
        const [toolsData, healthData] = await Promise.all([
          toolsApi.getTools(),
          healthApi.check()
        ])

        // 如果有新的工具数据，可以在这里更新
        // this.tools = toolsData
        
        this.apiStatus = 'connected'
        this.lastSyncTime = new Date()
        
        console.log('Tools synced from API:', healthData)
      } catch (error) {
        this.apiStatus = 'error'
        console.error('Failed to sync tools from API:', error)
        
        // 如果API失败，使用本地数据
        console.log('Using local tools data as fallback')
      }
    },

    // 初始化：检查API连接
    async initializeApi() {
      await this.syncToolsFromApi()
    }
  }
})