<template>
  <div class="text-deduplication">
    <div class="tool-header">
      <h2 class="tool-title">文本去重</h2>
      <p class="tool-description">快速去除重复的文本行，支持多种去重模式</p>
    </div>

    <div class="tool-content">
      <t-row :gutter="24">
        <!-- 输入区域 -->
        <t-col :span="12">
          <div class="input-section">
            <div class="section-header">
              <h3>输入文本</h3>
              <div class="actions">
                <t-button variant="text" @click="clearInput">
                  <t-icon name="delete" />
                  清空
                </t-button>
                <t-button variant="text" @click="loadExample">
                  <t-icon name="file-add" />
                  示例
                </t-button>
              </div>
            </div>
            <t-textarea
              v-model="inputText"
              placeholder="请输入需要去重的文本，每行一个"
              :autosize="{ minRows: 15, maxRows: 25 }"
              class="text-input"
            />
            <div class="input-info">
              <t-tag theme="default" size="small">
                {{ inputLines.length }} 行
              </t-tag>
              <t-tag theme="default" size="small">
                {{ inputText.length }} 字符
              </t-tag>
            </div>
          </div>
        </t-col>

        <!-- 输出区域 -->
        <t-col :span="12">
          <div class="output-section">
            <div class="section-header">
              <h3>去重结果</h3>
              <div class="actions">
                <t-button variant="text" @click="copyResult">
                  <t-icon name="copy" />
                  复制
                </t-button>
                <t-button variant="text" @click="downloadResult">
                  <t-icon name="download" />
                  下载
                </t-button>
              </div>
            </div>
            <t-textarea
              v-model="outputText"
              placeholder="去重后的结果将显示在这里"
              :autosize="{ minRows: 15, maxRows: 25 }"
              class="text-output"
              readonly
            />
            <div class="output-info">
              <t-tag theme="success" size="small">
                {{ outputLines.length }} 行
              </t-tag>
              <t-tag theme="success" size="small">
                {{ outputText.length }} 字符
              </t-tag>
              <t-tag theme="warning" size="small" v-if="duplicatesCount > 0">
                已去除 {{ duplicatesCount }} 个重复项
              </t-tag>
            </div>
          </div>
        </t-col>
      </t-row>

      <!-- 配置区域 -->
      <div class="config-section">
        <h3>去重配置</h3>
        <t-row :gutter="24">
          <t-col :span="8">
            <t-form-item label="去重模式">
              <t-radio-group v-model="dedupeMode" @change="performDeduplication">
                <t-radio value="exact">精确匹配</t-radio>
                <t-radio value="ignoreCase">忽略大小写</t-radio>
                <t-radio value="ignoreSpace">忽略空格</t-radio>
                <t-radio value="trim">去除首尾空格</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="保留顺序">
              <t-switch v-model="keepOrder" @change="performDeduplication" />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="自动去重">
              <t-switch v-model="autoDedup" />
            </t-form-item>
          </t-col>
        </t-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 响应式数据
const inputText = ref('')
const outputText = ref('')
const dedupeMode = ref('exact')
const keepOrder = ref(true)
const autoDedup = ref(true)

// 计算属性
const inputLines = computed(() => {
  if (!inputText.value) return []
  return inputText.value.split('\n').filter(line => line.trim())
})

const outputLines = computed(() => {
  if (!outputText.value) return []
  return outputText.value.split('\n').filter(line => line.trim())
})

const duplicatesCount = computed(() => {
  return inputLines.value.length - outputLines.value.length
})

// 监听输入变化，自动去重
watch(inputText, () => {
  if (autoDedup.value) {
    performDeduplication()
  }
})

// 去重核心函数
const performDeduplication = () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }

  const lines = inputText.value.split('\n')
  const seen = new Set()
  const result: string[] = []

  for (const line of lines) {
    let processedLine = line
    
    // 根据模式处理文本
    switch (dedupeMode.value) {
      case 'ignoreCase':
        processedLine = line.toLowerCase()
        break
      case 'ignoreSpace':
        processedLine = line.replace(/\s+/g, ' ')
        break
      case 'trim':
        processedLine = line.trim()
        break
    }

    // 检查是否重复
    if (!seen.has(processedLine)) {
      seen.add(processedLine)
      result.push(line) // 保留原始行
    }
  }

  outputText.value = result.join('\n')
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

// 加载示例
const loadExample = () => {
  const exampleText = `苹果
香蕉
橙子
苹果
葡萄
香蕉
西瓜
桃子
苹果
芒果
葡萄
火龙果`
  
  inputText.value = exampleText
  performDeduplication()
}

// 复制结果
const copyResult = async () => {
  if (!outputText.value) {
    MessagePlugin.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(outputText.value)
    MessagePlugin.success('已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = outputText.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    MessagePlugin.success('已复制到剪贴板')
  }
}

// 下载结果
const downloadResult = () => {
  if (!outputText.value) {
    MessagePlugin.warning('没有可下载的内容')
    return
  }

  const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `去重结果_${new Date().getTime()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  MessagePlugin.success('文件已下载')
}

// 初始化示例
loadExample()
</script>

<style scoped>
.text-deduplication {
  max-width: 1400px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--td-bg-color-container);
  border-radius: 8px;
  border: 1px solid var(--td-component-border);
}

.tool-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--td-text-color-primary);
}

.tool-description {
  color: var(--td-text-color-secondary);
  font-size: 1.1rem;
}

.tool-content {
  background: var(--td-bg-color-container);
  border-radius: 8px;
  padding: 24px;
  border: 1px solid var(--td-component-border);
}

.input-section,
.output-section {
  height: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--td-text-color-primary);
}

.actions {
  display: flex;
  gap: 8px;
}

.text-input,
.text-output {
  width: 100%;
}

.input-info,
.output-info {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.config-section {
  margin-top: 32px;
  padding: 24px;
  background: var(--td-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--td-component-border);
}

.config-section h3 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: var(--td-text-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-content .t-row {
    flex-direction: column;
  }
  
  .tool-content .t-col {
    margin-bottom: 24px;
  }
  
  .tool-header {
    padding: 16px;
  }
  
  .tool-title {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>