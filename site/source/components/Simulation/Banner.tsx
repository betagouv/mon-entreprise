import React from 'react'

import { Emoji, Message, SmallBody } from '@/design-system'

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
	hidden = false,
	icon,
}: BannerProps) {
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
