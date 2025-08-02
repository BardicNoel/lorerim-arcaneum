interface TestCardProps {
  item: {
    id: string
    title: string
    description: string
    height: number
    color: string
    tags: string[]
  }
}

export function TestCard({ item }: TestCardProps) {
  return (
    <div
      className={`w-full border-2 rounded-lg p-4 ${item.color} transition-all duration-200 hover:shadow-lg`}
      style={{ minHeight: `${item.height}px` }}
      data-testid={`test-card-${item.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
          <span className="text-xs text-gray-500">#{item.id.slice(-6)}</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-white/50 rounded-full text-gray-700 border"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-500">Height: {item.height}px</div>
      </div>
    </div>
  )
}
