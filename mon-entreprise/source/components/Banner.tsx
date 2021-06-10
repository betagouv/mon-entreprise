import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import Animate from 'Components/ui/animate'
import './Banner.css'

type BannerProps = {
	children: React.ReactNode
	hidden?: boolean
	hideAfterFirstStep?: boolean
	icon?: string
	className?: string
}

export default function Banner({
	children,
	hidden: hiddenProp = false,
	hideAfterFirstStep = true,
	icon,
	className,
}: BannerProps) {
	const hiddenState = useSelector(firstStepCompletedSelector)

	const hidden = hiddenProp || (hideAfterFirstStep && hiddenState)
	return !hidden ? (
		<Animate.fadeIn className={className}>
			<div className={'ui__ banner '+ className} >
				{icon && emoji(icon)}
				<div className="ui__ banner-content">{children}</div>
			</div>
		</Animate.fadeIn>
	) : null
}
