import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import React from 'react'
import styled from 'styled-components'

export type IndicatorProps = {
	main?: React.ReactNode
	subTitle?: React.ReactNode
	footnote?: React.ReactNode
}
export function Indicator({ main, subTitle, footnote }: IndicatorProps) {
	return (
		<StyledIndicator>
			<H4 as="h2">{subTitle}</H4>
			<Intro>
				<Strong>{main}</Strong>
			</Intro>
			{footnote && (
				<SmallBody
					css={`
						margin-top: -1rem;
					`}
				>
					{footnote}
				</SmallBody>
			)}
		</StyledIndicator>
	)
}
export function formatDay(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})
}
export function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
	})
}

const StyledIndicator = styled.div`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	height: 100%;
	box-shadow: ${({ theme }) => theme.elevations[2]};
	padding: ${({ theme }) => theme.spacings.xs}
		${({ theme }) => theme.spacings.md};
`
