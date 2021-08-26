import React, { createContext, useCallback, useEffect, useState } from 'react'
export const DisableAnimationContext = createContext(false)

export function DisableAnimationOnPrintProvider({
	children,
}: {
	children: React.ReactNode
}) {
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

	return (
		<DisableAnimationContext.Provider value={isPrintContext}>
			{children}
		</DisableAnimationContext.Provider>
	)
}
