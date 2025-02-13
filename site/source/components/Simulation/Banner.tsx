import React from 'react'

import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { SmallBody } from '@/design-system/typography/paragraphs'

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
