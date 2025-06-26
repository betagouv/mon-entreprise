import React, { createContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export const DisableAnimationContext = createContext(false)

const useIsPrintContext = () => {
	const [isPrintContext, setPrintContext] = useState(false)
	useEffect(() => {
		const matchListener = (matchMedia: MediaQueryListEvent) => {
			flushSync(() => setPrintContext(matchMedia.matches))
		}
		const matchMediaPrint = window.matchMedia('print')

		setPrintContext(matchMediaPrint.matches)
		// `addEventListener` isn't supported by old versions of Safari and throws a
		// fatal error. See #1790 and https://stackoverflow.com/a/56466334
		matchMediaPrint.addEventListener?.('change', matchListener)

		return () => {
			matchMediaPrint.removeEventListener?.('change', matchListener)
		}
	}, [])

	// Fix for Firefox (see https://bugzilla.mozilla.org/show_bug.cgi?id=774398)
	useEffect(() => {
		window.onbeforeprint = () => {
			flushSync(() => {
				setPrintContext(true)
			})
		}

		return () => {
			window.onbeforeprint = null
		}
	}, [setPrintContext])

	return isPrintContext
}

export function DisableAnimationOnPrintProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const isPrintContext = useIsPrintContext()

	return (
		<DisableAnimationContext.Provider
			value={isPrintContext || import.meta.env.SSR}
		>
			{children}
		</DisableAnimationContext.Provider>
	)
}
