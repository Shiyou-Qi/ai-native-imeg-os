import { create } from 'zustand'
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react'

export type NodeType =
  | 'textInput'
  | 'imageInput'
  | 'imageGenerator'
  | 'imageEditor'
  | 'multimodal'
  | 'output'

export interface NodeData {
  nodeType: NodeType
  label: string
  description?: string
  // Text input
  prompt?: string
  negativePrompt?: string
  // Image generation
  model?: string
  width?: number
  height?: number
  steps?: number
  guidance?: number
  seed?: number
  // Image editing
  operation?: 'remove-bg' | 'upscale' | 'filter' | 'inpaint' | 'outpaint'
  filterType?: string
  // Multimodal
  modality?: 'image-to-text' | 'text-to-image' | 'image-to-image' | 'text-to-video'
  // Common
  imageUrl?: string
  resultUrl?: string
  isProcessing?: boolean
  progress?: number
}

export const nodeTypeConfig: Record<NodeType, {
  label: string
  description: string
  color: string
  icon: string
  category: 'input' | 'generation' | 'editing' | 'multimodal' | 'output'
}> = {
  textInput: {
    label: '文字输入',
    description: '输入文字提示词，作为 AI 生成的输入',
    color: '#42a5f5',
    icon: 'Type',
    category: 'input',
  },
  imageInput: {
    label: '图片输入',
    description: '上传或导入图片作为输入源',
    color: '#66bb6a',
    icon: 'Image',
    category: 'input',
  },
  imageGenerator: {
    label: '图像生成',
    description: '使用 AI 模型根据提示词生成图像',
    color: '#ab47bc',
    icon: 'Sparkles',
    category: 'generation',
  },
  imageEditor: {
    label: '图像编辑',
    description: '对图像进行编辑：背景移除、放大、滤镜等',
    color: '#ff7043',
    icon: 'Pencil',
    category: 'editing',
  },
  multimodal: {
    label: '多模态 AI',
    description: '结合文本与图像进行多模态 AI 处理',
    color: '#26c6da',
    icon: 'Brain',
    category: 'multimodal',
  },
  output: {
    label: '输出',
    description: '查看和保存工作流输出结果',
    color: '#78909c',
    icon: 'Download',
    category: 'output',
  },
}

interface CanvasState {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  workflowStatus: 'idle' | 'running' | 'completed' | 'error'
  // History for undo/redo
  history: { nodes: Node[]; edges: Edge[] }[]
  historyIndex: number

  // Actions
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  removeNode: (id: string) => void
  updateNodeData: (id: string, data: Partial<NodeData>) => void
  selectNode: (id: string | null) => void
  setWorkflowStatus: (status: 'idle' | 'running' | 'completed' | 'error') => void
  undo: () => void
  redo: () => void
  saveHistory: () => void
  runWorkflow: () => Promise<void>
}

let nodeIdCounter = 0
const nextId = (type: NodeType) => `${type}-${Date.now()}-${++nodeIdCounter}`

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowStatus: 'idle',
  history: [{ nodes: [], edges: [] }],
  historyIndex: 0,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },

  onConnect: (connection) => {
    set((state) => {
      const newEdges = addEdge(
        { ...connection, animated: true, style: { stroke: '#666', strokeWidth: 2 } },
        state.edges
      )
      return { edges: newEdges }
    })
    get().saveHistory()
  },

  addNode: (type, position) => {
    const config = nodeTypeConfig[type]
    const newNode: Node = {
      id: nextId(type),
      type: 'aiNode',
      position,
      data: {
        nodeType: type,
        label: config.label,
        description: config.description,
        prompt: '',
        negativePrompt: '',
        model: 'stable-diffusion-xl',
        width: 1024,
        height: 1024,
        steps: 30,
        guidance: 7.5,
        seed: -1,
        operation: 'remove-bg',
      } as unknown as Record<string, unknown>,
    }
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: newNode.id,
    }))
    get().saveHistory()
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }))
    get().saveHistory()
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }))
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  setWorkflowStatus: (workflowStatus) => set({ workflowStatus }),

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { nodes, edges } = history[newIndex]
      set({ nodes, edges, historyIndex: newIndex })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { nodes, edges } = history[newIndex]
      set({ nodes, edges, historyIndex: newIndex })
    }
  },

  saveHistory: () => {
    const { nodes, edges, history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ nodes: [...nodes], edges: [...edges] })
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  runWorkflow: async () => {
    const { nodes, edges } = get()
    set({ workflowStatus: 'running' })

    try {
      // Topological sort to determine execution order
      const sorted = topologicalSort(nodes, edges)

      for (const nodeId of sorted) {
        const node = nodes.find((n) => n.id === nodeId)
        if (!node) continue
        get().updateNodeData(nodeId, { isProcessing: true, progress: 0 })

        await simulateProcessing(node, (progress) => {
          get().updateNodeData(nodeId, { progress })
        })

        get().updateNodeData(nodeId, { isProcessing: false, progress: 100 })
      }

      set({ workflowStatus: 'completed' })
    } catch {
      set({ workflowStatus: 'error' })
    }
  },
}))

function topologicalSort(nodes: Node[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const node of nodes) {
    inDegree.set(node.id, 0)
    adjacency.set(node.id, [])
  }

  for (const edge of edges) {
    const deg = inDegree.get(edge.target) ?? 0
    inDegree.set(edge.target, deg + 1)
    const adj = adjacency.get(edge.source) ?? []
    adj.push(edge.target)
    adjacency.set(edge.source, adj)
  }

  const queue: string[] = []
  const result: string[] = []

  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  while (queue.length > 0) {
    const current = queue.shift()!
    result.push(current)
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1
      inDegree.set(neighbor, newDeg)
      if (newDeg === 0) queue.push(neighbor)
    }
  }

  return result
}

async function simulateProcessing(
  _node: Node,
  onProgress: (p: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        onProgress(100)
        resolve()
      } else {
        onProgress(Math.round(progress))
      }
    }, 300)
  })
}
