/* @flow */
import * as React from 'react'
import {
	animated,
	config as configPresets,
	Trail,
	Transition
} from 'react-spring'
import type { SpringConfig } from 'react-spring'

type Props = {
	children: Array<React.Node>,
	config?: SpringConfig,
	delay?: number
}
export const fromBottom = ({
	children,
	config = configPresets.default,
	delay = 0
}: Props) => (
	<Trail
		keys={children.map((_, i) => i)}
		native={true}
		delay={delay}
		config={config}
		from={{ opacity: 0, y: 50 }}
		to={{ opacity: 1, y: 0 }}>
		{/* eslint-disable-next-line react/display-name */}
		{children.map((item, i) => ({ y, ...style }) => (
			<animated.div
				key={i}
				style={{
					transform: y.interpolate(y => `translate3d(0, ${y}px,0)`),
					...style
				}}>
				{item}
			</animated.div>
		))}
	</Trail>
)

export const leftToRight = ({
	children,
	config = configPresets.default,
	delay = 0
}: Props) => (
	<Transition
		keys={children.map((_, i) => i)}
		native={true}
		delay={delay}
		config={config}
		from={{ opacity: 0, x: -100 }}
		enter={{ opacity: 1, x: 0 }}
		leave={{ opacity: 0, x: 100 }}>
		{/* eslint-disable-next-line react/display-name */}
		{children.map((item, i) => ({ x, ...style }) => (
			<animated.div
				key={i}
				style={{
					transform: x.interpolate(x => `translate3d(${x}px,0, 0)`),
					...style
				}}>
				{item}
			</animated.div>
		))}
	</Transition>
)
