import React from "react";
import { Handle, Position } from "reactflow";
import type { PerkNode as PerkNodeType } from "../types";

interface PerkNodeProps {
  data: PerkNodeType & { hasChildren?: boolean; isRoot?: boolean };
  selected: boolean;
}

export function PerkNode({ data, selected }: PerkNodeProps) {
  const getNodeStyle = () => {
    const baseStyle = {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "2px solid",
      fontSize: "12px",
      fontWeight: "500",
      minWidth: "140px", // Increased from 80px to 140px
      textAlign: "center" as const,
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
    };

    if (selected) {
      return {
        ...baseStyle,
        borderColor: "#d4af37", // Skyrim gold
        backgroundColor: "#d4af37", // Skyrim gold
        color: "#1e1e1e", // Dark text for contrast
        boxShadow: "0 0 0 2px #d4af37, 0 4px 8px rgba(212, 175, 55, 0.3)",
        transform: "scale(1.05)",
      };
    }

    if (data.level <= 0) {
      return {
        ...baseStyle,
        borderColor: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
        opacity: 0.7,
      };
    }

    return {
      ...baseStyle,
      borderColor: "hsl(var(--border))",
    };
  };

  return (
    <div style={getNodeStyle()}>
      {/* Only show target handle if this node is not a root (has prerequisites) */}
      {!data.isRoot && <Handle type="target" position={Position.Bottom} />}
      
      <div className="font-medium">
        {data.perkName}
        {data.ranks > 1 && (
          <span className="text-xs text-muted-foreground ml-2">
            {data.currentRank}/{data.ranks}
          </span>
        )}
      </div>

      {/* Only show source handle if this node has children (is not terminal) */}
      {data.hasChildren && <Handle type="source" position={Position.Top} />}
    </div>
  );
} 