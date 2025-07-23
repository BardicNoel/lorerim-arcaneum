// Types and interfaces for PerkTree layout logic

import type { PerkTree } from '../../types'

export interface LayoutConfig {
  nodeWidth: number
  nodeHeight: number
  horizontalSpacing: number
  verticalSpacing: number
  padding: number
  gridScaleX: number
  gridScaleY: number
}

export interface LayoutNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  originalX: number
  originalY: number
  children?: string[]
}

export interface PerkRecord {
  edid: string
  name: string
  position: {
    x: number
    y: number
    horizontal: number
    vertical: number
  }
  connection: {
    parents: string[]
    children: string[]
  }
} 