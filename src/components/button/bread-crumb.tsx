import { Link } from 'react-router-dom'
import { useBreadcrumbStore } from '@/store/ui'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const BreadCrumb = () => {
    const { breadcrumbItems, customBreadcrumbItems, isCustomOverride } = useBreadcrumbStore()
    
    // Use custom breadcrumbs if override is active, otherwise use default breadcrumbs
    const displayItems = isCustomOverride && customBreadcrumbItems ? customBreadcrumbItems : breadcrumbItems;
    
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {displayItems.map((breadcrumbItem, index) => {
                    const isLastItem = index === displayItems.length - 1;   
                    const isCurrentPage = !breadcrumbItem.href || breadcrumbItem.href === '';
                    
                    return (
                        <div key={index} className='flex flex-wrap items-center gap-1.5 break-words text-sm text-slate-500 sm:gap-2.5 dark:text-slate-400'>
                            <BreadcrumbItem>
                                {isCurrentPage || isLastItem ? (
                                    <span className='text-sm text-[#070B14]'>{breadcrumbItem.name}</span>
                                ) : (
                                    <Link className='text-sm text-[#070B14] hover:text-blue-600' to={breadcrumbItem.href}>{breadcrumbItem.name}</Link>
                                )}
                            </BreadcrumbItem>
                            {!isLastItem && <BreadcrumbSeparator />}
                        </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb