import React from 'react'
import styled from 'styled-components'

export const Indicators = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin: 2rem 0;
`
type IndicatorProps = {
	main?: React.ReactNode
	subTitle?: React.ReactNode
	footnote?: string
	width?: string
}
export function Indicator({ main, subTitle, footnote, width }: IndicatorProps) {
	return (
		<div
			className="ui__ card lighter-bg"
			css={`
				text-align: center;
				padding: 1rem;
				width: ${width || '210px'};
				font-size: 110%;
			`}
		>
			<small
				css={`
					display: block;
				`}
			>
				{subTitle}
			</small>
			<strong
				css={`
					display: block;
				`}
			>
				{main}
			</strong>
			{footnote && (
				<span
					css={`
						font-size: small;
						display: block;
					`}
				>
					<i>{footnote}</i>
				</span>
			)}
		</div>
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
