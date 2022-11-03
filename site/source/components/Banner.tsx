import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Body } from '@/design-system/typography/paragraphs'
import { firstStepCompletedSelector } from '@/selectors/simulationSelectors'

import { FadeIn } from './ui/animate'
import Emoji from './utils/Emoji'

type BannerProps = {
	children: React.ReactNode
	hidden?: boolean
	hideAfterFirstStep?: boolean
	icon?: string
	className?: string
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`
const Content = styled(Body)`
	margin: 0.5rem;
	margin-left: 1rem;
`

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
		<FadeIn>
			<Container className={className}>
				<Emoji emoji={icon} />
				<Content as={typeof children === 'string' ? undefined : 'div'}>
					{children}
				</Content>
			</Container>
		</FadeIn>
	) : null
}
