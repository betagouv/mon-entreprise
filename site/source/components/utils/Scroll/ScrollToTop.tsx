import { useEffect, useRef } from 'react'

type Props = {
	behavior?: ScrollBehavior
}

export default function ScrollToTop({ behavior = 'auto' }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		forEachParent(ref.current, (elem) => {
			if (!elem) {
				return
			}
			;(elem as HTMLElement).scrollTop = 0
		})
		try {
			window.scroll({
				top: 0,
				behavior,
			})
		} catch (e) {
			window.scroll(0, 0)
		}
	}, [])

	return <div ref={ref} />
}

const forEachParent = (node: Node | null, fn: (node: Node) => void) => {
	if (!node) {
		return
	}
	fn(node)
	forEachParent(node.parentNode, fn)
}
