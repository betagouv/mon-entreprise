import React from 'react'

import { Emoji, Message, SmallBody } from '@/design-system'

import { FadeIn } from '../ui/animate'

type BannerProps = {
	children: React.ReactNode
	hidden?: boolean
	hideAfterFirstStep?: boolean
	icon?: string
	className?: string
	type?: 'error' | 'info'
}

export default function SimulationBanner({
	children,
	hidden = false,
	icon,
	type,
}: BannerProps) {
	return !hidden ? (
		<FadeIn>
			<Message
				border={false}
				mini
				type={type}
				icon={!!icon && <Emoji emoji={icon} />}
				className="print-hidden"
			>
				<SmallBody>{children}</SmallBody>
			</Message>
		</FadeIn>
	) : null
}
