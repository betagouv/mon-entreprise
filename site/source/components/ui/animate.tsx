import React, { useContext } from 'react'
import {
	animated,
	config as configPresets,
	SpringConfig,
	useSpring,
	useTrail,
} from 'react-spring'
import useMeasure from 'react-use-measure'
import { styled } from 'styled-components'

import { DisableAnimationContext } from '@/components/utils/DisableAnimationContext'

type Props = {
	children: React.ReactNode
	config?: SpringConfig
	style?: React.CSSProperties
	className?: string
	id?: string
	delay?: number
}

const AnimatedDiv = styled(animated.div)``

export function FromBottom({
	children,
	config = configPresets.stiff,
	style: inheritedStyle = {},
	delay = 0,
	className,
}: Props) {
	const trail = useTrail(React.Children.count(children), {
		delay,
		config,
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
				<AnimatedDiv
					// @ts-ignore Ignore type instantiation is excessively deep and possibly infinite.
					key={i}
					style={{
						...inheritedStyle,
						...style,
						position: 'relative',
					}}
					className={className}
				>
					{childrenArray[i]}
				</AnimatedDiv>
			))}
		</>
	)
}

export function FromTop({
	children,
	config = configPresets.stiff,
	style: inheritedStyle = {},
	delay = 0,
	className,
	id,
}: Props) {
	const trail = useTrail(React.Children.count(children), {
		delay,
		config,
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
				<AnimatedDiv
					key={i}
					style={{
						...inheritedStyle,
						...style,
						position: 'relative',
					}}
					className={className}
					id={id}
				>
					{childrenArray[i]}
				</AnimatedDiv>
			))}
		</>
	)
}

export const FadeIn = ({
	children,
	config = configPresets.default,
	delay = 0,
	className,
}: Props) => {
	const style = useSpring({
		delay,
		config,
		from: { opacity: 0 },
		to: { opacity: 1 },
	})
	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}

	return (
		<animated.div className={className} style={style}>
			{children}
		</animated.div>
	)
}

function AppearAnim({
	children,
	className,
	unless = false,
	config = configPresets.default,
	delay = 0,
	style,
}: Props & { unless?: boolean }) {
	const [ref, { height }] = useMeasure()
	const animatedStyle = useSpring({
		delay,
		config,
		from: { opacity: 0, height: 0 },
		reset: false,
		to: { opacity: 1, height },
	})

	if (useContext(DisableAnimationContext) || unless) {
		return <>{children}</>
	}

	return (
		<animated.div
			style={{
				...style,
				...animatedStyle,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
			className={className}
		>
			<div ref={ref}>{children}</div>
		</animated.div>
	)
}

export const Appear = (props: Parameters<typeof AppearAnim>[0]) =>
	// eslint-disable-next-line react/jsx-props-no-spreading
	import.meta.env.SSR ? props.children : <AppearAnim {...props} />
