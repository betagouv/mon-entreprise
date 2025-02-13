import React from 'react'
import { useSelector } from 'react-redux'

import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { firstStepCompletedSelector } from '@/store/selectors/simulationSelectors'

import { FadeIn } from '../ui/animate'

type BannerProps = {
	children: React.ReactNode
	hidden?: boolean
	hideAfterFirstStep?: boolean
	icon?: string
	className?: string
}

export default function SimulationBanner({
	children,
	hidden: hiddenProp = false,
	hideAfterFirstStep = true,
	icon,
}: BannerProps) {
	const hiddenState = useSelector(firstStepCompletedSelector)

	const hidden = hiddenProp || (hideAfterFirstStep && hiddenState)

	return !hidden ? (
		<FadeIn>
			<Message
				border={false}
				mini
				icon={!!icon && <Emoji emoji={icon} />}
				className="print-hidden"
			>
				<SmallBody>{children}</SmallBody>
			</Message>
		</FadeIn>
	) : null
}
