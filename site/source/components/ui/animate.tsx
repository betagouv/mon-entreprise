import React, { useContext } from 'react'
import {
	animated,
	config as configPresets,
	useSpring,
	useTrail,
} from 'react-spring'
import useMeasure from 'react-use-measure'

import { DisableAnimationContext } from '@/components/utils/DisableAnimationContext'

type Props = {
	children: React.ReactNode
}

export function FromBottom({ children }: Props) {
	const trail = useTrail(React.Children.count(children), {
		delay: 0,
		config: configPresets.stiff,
		from: { opacity: 0, y: 10 },
		to: { opacity: 1, y: 0 },
	})

	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}

	const childrenArray = React.Children.toArray(children)

	return (
		<>
			{trail.map((style, i) => (
				<animated.div
					// @ts-ignore Ignore type instantiation is excessively deep and possibly infinite.
					key={i}
					style={{
						...style,
						position: 'relative',
					}}
				>
					{childrenArray[i]}
				</animated.div>
			))}
		</>
	)
}

export function FromTop({ children }: Props) {
	const trail = useTrail(React.Children.count(children), {
		delay: 0,
		config: configPresets.stiff,
		from: { opacity: 0, y: -20 },
		to: { opacity: 1, y: 0 },
	})

	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}

	const childrenArray = React.Children.toArray(children)

	return (
		<>
			{trail.map((style, i) => (
				<animated.div
					key={i}
					style={{
						...style,
						position: 'relative',
					}}
				>
					{childrenArray[i]}
				</animated.div>
			))}
		</>
	)
}

export const FadeIn = ({ children }: Props) => {
	const style = useSpring({
		delay: 0,
		config: configPresets.default,
		from: { opacity: 0 },
		to: { opacity: 1 },
	})

	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}

	return <animated.div style={style}>{children}</animated.div>
}

type AnimProps = Props & {
	unless?: boolean
	id?: string
}

export const Appear = ({ children, unless, id }: AnimProps) => {
	const [ref, { height }] = useMeasure()
	const style = useSpring({
		delay: 0,
		config: configPresets.default,
		from: { opacity: 0, height: 0 },
		reset: false,
		to: { opacity: 1, height },
	})

	if (useContext(DisableAnimationContext) || unless) {
		return <>{children}</>
	}

	return (
		<animated.div
			id={id}
			style={{
				...style,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div ref={ref}>{children}</div>
		</animated.div>
	)
}
