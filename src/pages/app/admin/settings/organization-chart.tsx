"use client"

import { useEffect } from "react"
import { 
  OrganizationHeader, 
  OrganizationLoading, 
  OrganizationError, 
  OrganizationEmpty, 
  OrganizationTree 
} from "@/components/organization"
import { usePositionStore } from "@/store/organization"
import { useCreatePosition, useGetOrganizationTree } from "@/hooks/organization"

export default function OrganizationalChart() {
    const { data: positions, isLoading, error, refetch } = useGetOrganizationTree()

    const { mutate: createPosition } = useCreatePosition()
    const { setPositions } = usePositionStore()

    useEffect(() => {
        if (positions && Array.isArray(positions)) {
            setPositions(positions)
        }
    }, [positions, setPositions])

    const handleAddRoot = (data: { userId: string; title: string }) => {
        createPosition({
                ...data,
                superiorId: null,
        });
    }

    const handleRefresh = () => {
        refetch?.()
    }

    // Ensure positions is always an array
    const safePositions = Array.isArray(positions) ? positions : []

    if (isLoading) {
        return <OrganizationLoading />
    }

    if (error) {
        return <OrganizationError error={error} onRetry={handleRefresh} />
    }

    if (safePositions.length === 0) {
        return (
            <OrganizationEmpty 
                onRefresh={handleRefresh} 
                onAddRoot={handleAddRoot} 
            />
        )
    }

    return (
        <div>
            <OrganizationHeader onRefresh={handleRefresh} />
            <OrganizationTree positions={safePositions} />
        </div>
    )
}