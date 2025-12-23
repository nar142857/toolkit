/**
 * API 服务层
 * 用于与 Cloudflare Workers 后端通信
 */

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://toolkit-api.your-domain.workers.dev'

// HTTP 请求封装
class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.request<T>(url.pathname + url.search)
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// 创建 API 服务实例
const apiService = new ApiService(API_BASE_URL)

// 工具相关 API
export const toolsApi = {
  // 获取所有工具
  async getTools() {
    return apiService.get<any[]>('/api/tools')
  },

  // 获取工具统计
  async getStats(toolId?: number) {
    return apiService.get<any[]>('/api/stats', { toolId })
  },

  // 更新工具使用次数
  async updateUsage(toolId: number) {
    return apiService.post<any>('/api/stats', { toolId })
  }
}

// 健康检查 API
export const healthApi = {
  // 检查后端服务状态
  async check() {
    return apiService.get<{ status: string; timestamp: string }>('/api/health')
  }
}

// 错误处理
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// 导出默认实例
export default apiService