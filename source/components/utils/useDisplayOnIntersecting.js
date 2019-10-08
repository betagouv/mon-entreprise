import { useEffect, useRef, useState } from 'react'

export default function({ root = null, rootMargin, threshold = 0 }) {
	const ref = useRef()
	const [wasOnScreen, setWasOnScreen] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setWasOnScreen(entry.isIntersecting)
					observer.unobserve(ref.current)
				}
			},
			{
				root,
				rootMargin,
				threshold
			}
		)
		const node = ref.current
		if (ref.current) {
			observer.observe(node)
		}
		return () => {
			observer.unobserve(node)
		}
	}, [root, rootMargin, threshold]) // Empty array ensures that effect is only run on mount and unmount

	return [ref, wasOnScreen]
}
