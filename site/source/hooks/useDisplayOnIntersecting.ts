import { useEffect, useRef, useState } from 'react'

export default function ({
	root = null,
	rootMargin,
	threshold = 0,
	unobserve = true,
}: IntersectionObserverInit & { unobserve?: boolean }): [
	React.RefObject<HTMLDivElement>,
	boolean,
] {
	const ref = useRef<HTMLDivElement>(null)
	const [wasOnScreen, setWasOnScreen] = useState(false)

	useEffect(() => {
		if (typeof IntersectionObserver === 'undefined') {
			setWasOnScreen(true) // No effect for old browsers

			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setWasOnScreen(entry.isIntersecting)
					ref.current && unobserve && observer.unobserve(ref.current)
				}
				if (!entry.isIntersecting && !unobserve) {
					setWasOnScreen(entry.isIntersecting)
				}
			},
			{
				root,
				rootMargin,
				threshold,
			}
		)
		const node = ref.current
		if (node) {
			observer.observe(node)
		}

		return () => {
			node && unobserve && observer.unobserve(node)
		}
	}, [root, rootMargin, threshold, unobserve])

	return [ref, wasOnScreen]
}
