import { DisableAnimationContext } from 'Components/utils/DisableAnimationContext'
import React, { useContext, useEffect, useState } from 'react'
import {
	animated,
	config as configPresets,
	interpolate,
	Spring,
	SpringConfig,
	Trail,
} from 'react-spring/renderprops'

type Props = {
	children: React.ReactNode
	config?: SpringConfig
	style?: React.CSSProperties
	className?: string
	delay?: number
}

// Todo : better animate with fromRight on desktop
export function FromBottom({
	children,
	config = configPresets.stiff,
	style: inheritedStyle = {},
	delay = 0,
}: Props) {
	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}
	return (
		<Trail
			keys={React.Children.map(children, (_, i) => i) ?? []}
			native={true}
			delay={delay}
			config={config}
			from={{ opacity: 0, y: 10 }}
			to={{ opacity: 1, y: 0 }}
			items={children}
		>
			{(item) =>
				({ y, ...style }) =>
					(
						<animated.div
							style={{
								transform: interpolate([y], (y) =>
									y !== 0 ? `translate3d(0, ${y}px,0)` : 'none'
								),
								...style,
								...inheritedStyle,
							}}
						>
							{item}
						</animated.div>
					)}
		</Trail>
	)
}
export function FromTop({
	children,
	config = configPresets.stiff,
	style: inheritedStyle = {},
	delay = 0,
}: Props) {
	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}
	return (
		<Trail
			keys={React.Children.map(children, (_, i) => i) ?? []}
			native={true}
			delay={delay}
			config={config}
			from={{ opacity: 0, y: -20 }}
			to={{ opacity: 1, y: 0 }}
			items={children}
		>
			{(item) =>
				({ y, ...style }) =>
					(
						<animated.div
							style={{
								transform: interpolate([y], (y) =>
									y !== 0 ? `translate3d(0, ${y}px,0)` : 'none'
								),
								...style,
								...inheritedStyle,
							}}
						>
							{item}
						</animated.div>
					)}
		</Trail>
	)
}
export const FadeIn = ({
	children,
	config = configPresets.default,
	delay = 0,
}: Props) =>
	useContext(DisableAnimationContext) ? (
		<>{children}</>
	) : (
		<Spring
			native={true}
			delay={delay}
			config={config}
			from={{ opacity: 0 }}
			to={{
				opacity: 1,
			}}
		>
			{(style) => <animated.div style={style}>{children}</animated.div>}
		</Spring>
	)

export function Appear({
	children,
	className,
	unless = false,
	config = configPresets.default,
	delay = 0,
	style,
}: Props & { unless?: boolean }) {
	const [show, setShow] = useState(unless)
	useEffect(() => {
		window.setTimeout(() => setShow(true), 0)
	}, [])
	if (useContext(DisableAnimationContext)) {
		return <>{children}</>
	}

	return (
		<Spring
			delay={delay}
			native
			config={config}
			to={{
				opacity: show ? 1 : 0,
				height: show ? 'auto' : '0px',
			}}
		>
			{(animStyle) => (
				<animated.div style={{ ...style, ...animStyle }} className={className}>
					{children}
				</animated.div>
			)}
		</Spring>
	)
}
