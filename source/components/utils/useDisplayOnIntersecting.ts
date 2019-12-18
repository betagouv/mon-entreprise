import { useEffect, useRef, useState } from 'react'

export default function({
	root = null,
	rootMargin,
	threshold = 0
}: IntersectionObserverInit): [React.RefObject<HTMLDivElement>, boolean] {
	const ref = useRef<HTMLDivElement>(null)
	const [wasOnScreen, setWasOnScreen] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setWasOnScreen(entry.isIntersecting)
					ref.current && observer.unobserve(ref.current)
				}
			},
			{
				root,
				rootMargin,
				threshold
			}
		)
		const node = ref.current
		if (node) {
			observer.observe(node)
		}
		return () => {
			node && observer.unobserve(node)
		}
	}, [root, rootMargin, threshold])

	return [ref, wasOnScreen]
}
