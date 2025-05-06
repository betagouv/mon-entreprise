import React, { useEffect, useRef } from 'react'

const forEachParent = (node: Node | null, fn: (node: Node) => void) => {
	if (!node) {
		return
	}
	fn(node)
	forEachParent(node.parentNode, fn)
}

export function ScrollToTop({
	behavior = 'auto',
}: {
	behavior?: ScrollBehavior
}) {
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

type ScrollToElementProps = React.ComponentProps<'div'> & {
	onlyIfNotVisible?: boolean
	when?: boolean
	behavior?: ScrollBehavior
	style?: React.CSSProperties
}

export function ScrollToElement({
	onlyIfNotVisible = false,
	when,
	behavior = 'smooth',
	children,
	style,
	...otherProps
}: ScrollToElementProps) {
	const ref = useRef<HTMLDivElement>(null)
	const scrollIfNeeded = () => {
		if (
			when === false ||
			(onlyIfNotVisible &&
				ref.current &&
				ref.current.getBoundingClientRect().top >= 0 &&
				ref.current.getBoundingClientRect().bottom <= window.innerHeight)
		) {
			return
		}
		try {
			ref.current?.scrollIntoView({
				behavior,
				block: 'nearest',
				inline: 'nearest',
			})
		} catch (error) {
			ref.current?.scrollIntoView({
				behavior,
			})
		}
	}
	useEffect(scrollIfNeeded)

	return (
		<div
			{...otherProps}
			style={{
				...style,
				...(!children ? { position: 'absolute' } : {}),
			}}
			ref={ref}
		>
			{children}
		</div>
	)
}

export default {
	toElement: ScrollToElement,
	toTop: ScrollToTop,
}
