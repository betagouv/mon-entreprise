import { useEffect } from 'react'

import { useNavigation } from '@/lib/navigation'
import { debounce, getSessionStorage } from '@/utils'

const POP_ACTION_LABEL = 'POP'
const REPLACE_ACTION_LABEL = 'REPLACE'
const sessionStorage = getSessionStorage()

export const useSaveAndRestoreScrollPosition = () => {
	const { currentPath, navigationType } = useNavigation()

	useEffect(() => {
		const scrollPosition = sessionStorage?.getItem(currentPath)

		if (
			scrollPosition &&
			(navigationType === POP_ACTION_LABEL ||
				navigationType === REPLACE_ACTION_LABEL)
		) {
			window.scrollTo(0, parseInt(scrollPosition))
		}
	}, [currentPath, navigationType])

	useEffect(() => {
		const saveScrollYPosition = debounce(100, () => {
			sessionStorage?.setItem(currentPath, String(window.scrollY))
		}) as (this: Window, ev: Event) => void

		window.addEventListener('scroll', saveScrollYPosition)

		return () => {
			window.removeEventListener('scroll', saveScrollYPosition)
		}
	}, [currentPath])
}
