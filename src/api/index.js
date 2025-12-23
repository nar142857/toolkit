/**
 * Cloudflare Workers API for Toolkit
 * 提供工具统计、用户管理等功能
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 处理 CORS 预检请求
function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  })
}

// 工具统计 API
async function handleToolStats(request, env) {
  const url = new URL(request.url)
  const toolId = url.searchParams.get('toolId')

  if (request.method === 'POST') {
    // 增加工具使用次数
    if (!toolId) {
      return new Response(JSON.stringify({ error: 'Tool ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    try {
      // 更新数据库中的使用次数
      const stmt = env.DB.prepare(`
        INSERT OR REPLACE INTO tool_stats (tool_id, usage_count, last_used)
        VALUES (?, COALESCE((SELECT usage_count FROM tool_stats WHERE tool_id = ?), 0) + 1, ?)
      `)
      
      await stmt.bind(parseInt(toolId), parseInt(toolId), new Date().toISOString()).run()

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to update stats' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } else if (request.method === 'GET') {
    // 获取工具统计数据
    try {
      let query = 'SELECT * FROM tool_stats ORDER BY usage_count DESC'
      let params = []

      if (toolId) {
        query = 'SELECT * FROM tool_stats WHERE tool_id = ?'
        params = [parseInt(toolId)]
      }

      const results = await env.DB.prepare(query).bind(...params).all()

      return new Response(JSON.stringify({ data: results.results || [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// 获取所有工具数据
async function getTools(request, env) {
  try {
    // 从 KV 存储获取工具列表
    const toolsData = await env.CACHE.get('tools_list')
    
    if (toolsData) {
      return new Response(toolsData, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 如果缓存中没有，返回默认数据
    const defaultTools = [
      { id: 1, name: '文本去重', description: '快速去除重复文本', category: '文本工具', usageCount: 1024, todayUsage: 45 },
      { id: 2, name: '大小写转换', description: '英文大小写快速转换', category: '文本工具', usageCount: 856, todayUsage: 23 },
      { id: 3, name: '简繁转换', description: '简体中文与繁体中文互转', category: '语言工具', usageCount: 2341, todayUsage: 67 },
      { id: 4, name: 'URL编码解码', description: 'URL编码与解码工具', category: '编码解码', usageCount: 1523, todayUsage: 34 },
    ]

    return new Response(JSON.stringify(defaultTools), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tools' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// 主路由处理
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url)

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return handleCORS()
  }

  // 路由分发
  switch (url.pathname) {
    case '/api/tools':
      return getTools(request, env)
    
    case '/api/stats':
      return handleToolStats(request, env)
    
    case '/api/health':
      return new Response(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    
    default:
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

// 事件监听器
export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx)
    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  async scheduled(event, env, ctx) {
    // 定时任务：每天重置今日使用次数
    try {
      await env.DB.prepare(`
        UPDATE tool_stats SET today_usage = 0
      `).run()
      
      console.log('Reset today usage counts')
    } catch (error) {
      console.error('Failed to reset usage counts:', error)
    }
  }
}