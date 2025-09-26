
import { cn } from "@/lib/utils"
import * as React from "react"
import TimePicker from 'react-time-picker'

export type TimePickerProps = React.ComponentProps<typeof TimePicker>

function Clock({ className, ...props }: TimePickerProps) {
    return (
        <TimePicker
            className={cn("p-3", className)}
            {...props}
        />
    )
}
Clock.displayName = "Clock"

export { Clock }
