import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { EnchantmentGrid } from './EnchantmentGrid'
import { Button } from '@/shared/ui/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentGridWithPaginationProps {
  enchantments: EnchantmentWithComputed[]
  itemsPerPage?: number
  className?: string
}

export const EnchantmentGridWithPagination: React.FC<EnchantmentGridWithPaginationProps> = ({
  enchantments,
  itemsPerPage = 20,
  className
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(enchantments.length / itemsPerPage)
  
  const paginatedEnchantments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return enchantments.slice(startIndex, endIndex)
  }, [enchantments, currentPage, itemsPerPage])
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }
  
  return (
    <div className={cn('space-y-6', className)}>
      <EnchantmentGrid
        enchantments={paginatedEnchantments}
        emptyMessage="No enchantments found on this page"
      />
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, enchantments.length)} of{' '}
            {enchantments.length} enchantments
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                const isCurrentPage = page === currentPage
                const isNearCurrent = Math.abs(page - currentPage) <= 2
                const isFirstOrLast = page === 1 || page === totalPages
                
                if (isCurrentPage || isNearCurrent || isFirstOrLast) {
                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageClick(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

