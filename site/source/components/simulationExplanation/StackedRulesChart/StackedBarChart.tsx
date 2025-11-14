import { useContext } from 'react'
import { animated, useSpring } from 'react-spring'

import { DisableAnimationContext } from '@/components/utils/DisableAnimationContext'
import useDisplayOnIntersecting from '@/hooks/useDisplayOnIntersecting'

import InnerStackedBarChart, {
	InnerStackedBarChartProps,
} from './InnerStackedBarChart'

export default function StackedBarChart({ data }: InnerStackedBarChartProps) {
	const [intersectionRef, displayChart] = useDisplayOnIntersecting({
		threshold: 0.5,
	})

	const styles = useSpring({ opacity: displayChart ? 1 : 0 })

	return !useContext(DisableAnimationContext) ? (
		<animated.div ref={intersectionRef} style={styles}>
			<InnerStackedBarChart data={data} />
		</animated.div>
	) : (
		<InnerStackedBarChart data={data} />
	)
}
