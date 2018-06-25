/* @flow */
import * as React from 'react'
import { animated, config as configPresets, Trail } from 'react-spring'
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
