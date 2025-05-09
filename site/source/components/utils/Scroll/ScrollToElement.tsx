import { useEffect, useRef } from 'react'

type Props = React.ComponentProps<'div'> & {
	onlyIfNotVisible?: boolean
	when?: boolean
	behavior?: ScrollBehavior
	style?: React.CSSProperties
}

export default function ScrollToElement({
	onlyIfNotVisible = false,
	when,
	behavior = 'smooth',
	children,
	style,
	...otherProps
}: Props) {
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
