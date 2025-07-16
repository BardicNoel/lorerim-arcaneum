import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { PerkNode as PerkNodeType } from "../types";

interface PerkNodeProps {
  data: PerkNodeType;
  selected: boolean;
}

export function PerkNode({ data, selected }: PerkNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getNodeStyle = () => {
    const baseStyle = {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "2px solid",
      fontSize: "12px",
      fontWeight: "500",
      minWidth: "80px",
      textAlign: "center" as const,
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
    };

    if (selected) {
      return {
        ...baseStyle,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        boxShadow: "0 0 0 2px hsl(var(--ring))",
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
    <div
      style={getNodeStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="font-medium">
        {data.perkName}
      </div>
      
      {data.ranks > 1 && (
        <div className="text-xs text-muted-foreground mt-1">
          {data.currentRank}/{data.ranks}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />

      {/* Hover Tooltip */}
      {isHovered && (
        <div
          className="absolute z-50 bg-popover text-popover-foreground p-3 rounded-md shadow-lg border max-w-xs"
          style={{
            top: "-100%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <div className="font-semibold mb-2">{data.perkName}</div>
          <div 
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: data.perkDescription }}
          />
          {data.level > 0 && (
            <div className="text-xs mt-2 text-primary">
              Level {data.level} required
            </div>
          )}
        </div>
      )}
    </div>
  );
} 