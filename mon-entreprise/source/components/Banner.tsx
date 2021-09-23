import React from 'react'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import './Banner.css'
import { FadeIn } from './ui/animate'
import Emoji from './utils/Emoji'

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
		<FadeIn className={className}>
			<div className={'ui__ banner ' + className}>
				<Emoji emoji={icon} />
				<div className="ui__ banner-content">{children}</div>
			</div>
		</FadeIn>
	) : null
}
