import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import Animate from 'Components/ui/animate'
import './Banner.css'

type BannerProps = {
	children: React.ReactNode
	hidden?: boolean
	icon?: string
}

export default function Banner({
	children,
	hidden: hiddenProp = false,
	icon
}: BannerProps) {
	const hiddenState = useSelector(firstStepCompletedSelector)
	const hidden = hiddenProp || hiddenState
	return !hidden ? (
		<Animate.fadeIn>
			<div className="ui__ banner">
				{icon && emoji(icon)}
				<p>{children}</p>
			</div>
		</Animate.fadeIn>
	) : null
}
