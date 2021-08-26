import React, { createContext, useCallback, useEffect, useState } from 'react'
export const DisableAnimationContext = createContext(false)

export const useIsPrintContext = () => {
	const [isPrintContext, setPrintContext] = useState(false)
	const onPrintContextChange = useCallback(
		(matchMedia: MediaQueryListEvent | MediaQueryList) => {
			setPrintContext(matchMedia.matches)
		},
		[setPrintContext]
	)
	useEffect(() => {
		const matchMediaPrint = window.matchMedia('print')
		onPrintContextChange(matchMediaPrint)
		matchMediaPrint.addEventListener('change', onPrintContextChange)
		return () => {
			matchMediaPrint.removeEventListener('change', onPrintContextChange)
		}
	}, [onPrintContextChange])

	// Fix for Firefox (see https://bugzilla.mozilla.org/show_bug.cgi?id=774398)
	useEffect(() => {
		window.onbeforeprint = () => setPrintContext(true)
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
	console.log(isPrintContext)
	return (
		<DisableAnimationContext.Provider value={isPrintContext}>
			{children}
		</DisableAnimationContext.Provider>
	)
}
