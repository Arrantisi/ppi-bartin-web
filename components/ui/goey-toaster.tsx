"use client"

import { GoeyToaster as GoeyToasterPrimitive, goeyToast } from "goey-toast"
import type { GoeyToasterProps } from "goey-toast"
import "goey-toast/styles.css"

export { goeyToast }
export type { GoeyToasterProps }
export type {
  GoeyToastOptions,
  GoeyPromiseData,
  GoeyToastAction,
  GoeyToastClassNames,
  GoeyToastTimings,
} from "goey-toast"

function GoeyToaster(props: GoeyToasterProps) {
  return <GoeyToasterPrimitive position="bottom-right" {...props} />
}

export { GoeyToaster }
