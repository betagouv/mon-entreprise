import { Body } from 'DesignSystem/typography/paragraphs'
import React from 'react'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
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
		<FadeIn className={className}>
			<Container>
				<Emoji emoji={icon} />
				<Content>{children}</Content>
			</Container>
		</FadeIn>
	) : null
}
