'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  type Node,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { PanelRight, PanelLeft, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCanvasStore, type NodeType } from '@/stores/canvas-store'
import { AINode } from './canvas/AINode'
import { NodePalette } from './canvas/NodePalette'
import { PropertiesPanel } from './canvas/PropertiesPanel'
import { CanvasToolbar } from './canvas/CanvasToolbar'

const nodeTypes = {
  aiNode: AINode,
}

const defaultViewport = { x: 0, y: 0, zoom: 1 }

function CanvasContent() {
  const reactFlowInstance = useReactFlow()
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    saveHistory,
    selectNode,
    selectedNodeId,
  } = useCanvasStore()

  const [showGrid, setShowGrid] = useState(true)
  const [showMinimap, setShowMinimap] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [showProperties, setShowProperties] = useState(false)
  const [zoom, setZoom] = useState(100)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Auto-open properties panel when a node is selected
  useEffect(() => {
    if (selectedNodeId) {
      setShowProperties(true)
    }
  }, [selectedNodeId])

  // Track viewport changes for zoom
  const handleViewportChange = useCallback(() => {
    const viewport = reactFlowInstance.getViewport()
    setZoom(Math.round(viewport.zoom * 100))
  }, [reactFlowInstance])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          useCanvasStore.getState().redo()
        } else {
          useCanvasStore.getState().undo()
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = useCanvasStore.getState().selectedNodeId
        if (selected) {
          useCanvasStore.getState().removeNode(selected)
        }
      }

      // Toggle panels
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        setShowPalette((v) => !v)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle node selection
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const handlePaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  // Handle adding node from palette
  const handleAddNode = useCallback(
    (type: NodeType) => {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const position = reactFlowInstance.screenToFlowPosition({
        x: reactFlowBounds ? reactFlowBounds.left + reactFlowBounds.width / 2 : 400,
        y: reactFlowBounds ? reactFlowBounds.top + reactFlowBounds.height / 2 : 300,
      })
      addNode(type, position)
      setShowPalette(false)
    },
    [addNode, reactFlowInstance]
  )

  // Handle drag and drop from palette
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow-type') as NodeType | undefined
      if (!type) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      addNode(type, position)
      saveHistory()
    },
    [addNode, reactFlowInstance, saveHistory]
  )

  // Handle connection change
  const handleConnect = useCallback(
    (connection: Parameters<typeof onConnect>[0]) => {
      onConnect(connection)
      saveHistory()
    },
    [onConnect, saveHistory]
  )

  // Handle nodes change with history
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      const hasPositionChange = changes.some((c) => c.type === 'position' && c.dragging === false)
      onNodesChange(changes)
      if (hasPositionChange) {
        saveHistory()
      }
    },
    [onNodesChange, saveHistory]
  )

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes)
    },
    [onEdgesChange]
  )

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn({ duration: 200 })
  }, [reactFlowInstance])

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut({ duration: 200 })
  }, [reactFlowInstance])

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 300 })
  }, [reactFlowInstance])

  return (
    <div className="flex flex-1 min-w-0 h-full flex-col overflow-hidden bg-background">
      {/* Top Toolbar */}
      <CanvasToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Canvas - always full area */}
        <div ref={reactFlowWrapper} className="absolute inset-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            onViewportChange={handleViewportChange}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            nodeTypes={nodeTypes}
            defaultViewport={defaultViewport}
            fitView
            deleteKeyCode={['Delete', 'Backspace']}
            multiSelectionKeyCode="Shift"
            selectionOnDrag
            panOnDrag={[1, 2]}
            snapToGrid={false}
            snapGrid={[20, 20]}
            className="bg-muted/20"
            proOptions={{ hideAttribution: true }}
          >
            {showGrid && (
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="oklch(0.4 0 0 / 0.15)"
              />
            )}

            {showMinimap && (
              <MiniMap
                nodeStrokeWidth={2}
                nodeBorderRadius={8}
                pannable
                zoomable
                className="!bg-card/80 !backdrop-blur-sm !border !border-border !rounded-xl !overflow-hidden !shadow-lg"
                maskColor="oklch(0 0 0 / 0.5)"
                style={{ width: 180, height: 120 }}
              />
            )}

            <Controls
              showZoom={false}
              showFitView={false}
              showInteractive={false}
              className="!bg-card/80 !backdrop-blur-sm !border !border-border !rounded-lg !shadow-sm"
            />
          </ReactFlow>
        </div>

        {/* Floating action buttons (bottom-left) */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
          <Button
            variant={showPalette ? 'secondary' : 'default'}
            size="icon"
            className="size-9 rounded-xl shadow-lg"
            onClick={() => setShowPalette(!showPalette)}
            title="节点面板 (Ctrl+P)"
          >
            <PanelLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg"
            onClick={() => setShowMinimap(!showMinimap)}
            title="小地图"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </Button>
        </div>

        {/* Floating Node Palette (left overlay) */}
        <AnimatePresence>
          {showPalette && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/20"
                onClick={() => setShowPalette(false)}
              />
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 top-0 z-20 w-60 rounded-r-2xl border-r border-border bg-card shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold">节点面板</span>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => setShowPalette(false)}>
                    <X className="size-4" />
                  </Button>
                </div>
                <NodePalette onAddNode={handleAddNode} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Properties Panel (right overlay) */}
        <AnimatePresence>
          {showProperties && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 right-0 top-0 z-20 w-[300px] rounded-l-2xl border-l border-border bg-card shadow-2xl"
            >
              <PropertiesPanel
                isOpen={showProperties}
                onClose={() => setShowProperties(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Properties button (when closed and a node is selected) */}
        {!showProperties && selectedNodeId && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              variant="default"
              size="sm"
              className="gap-2 rounded-xl shadow-lg"
              onClick={() => setShowProperties(true)}
            >
              <PanelRight className="size-4" />
              属性
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  )
}
