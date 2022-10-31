import React from 'react'
import styled from 'styled-components'

const QuestionMark = styled.span`
	color: var(--color);
	background-color: inherit;
	border: 1px solid var(--color);
	display: inline-block;
	font-weight: bold;
	user-select: none;
	font-size: 75%;
	width: 2.8ex;
	line-height: initial;
	border-radius: 50%;
	padding: 1px;
	text-align: center;
	text-decoration: none;
	&:focus {
		outline: 1px dotted var(--darkColor);
		position: relative;
	}
`

const InfoBulleText = styled.span`
	text-align: left;
	position: absolute;
	line-height: 1.2rem !important;
	z-index: -1;
	padding: 0.4rem;
	min-width: 10rem;
	font-weight: normal;
	display: block;
	border-radius: 3px;
	font-family: 'Roboto';
	background-color: white;
	color: inherit;
	transition: opacity 0.2s, transform 0.2s;
	opacity: 0;
	box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2),
		0px 4px 5px 0px rgba(41, 117, 209, 0.14),
		0px 1px 10px 0px rgba(41, 117, 209, 0.12);
	pointer-events: none;
	transform: translate(2.8ex, -5px);

	${QuestionMark}:hover + &,
	${QuestionMark}:focus + & {
		transform: translate(2.8ex, 1px);
		z-index: 1;
		opacity: 1;
	}
`

const Container = styled.span`
	position: relative;
	vertical-align: bottom;
`

export default function InfoBulle({ children }: { children: React.ReactNode }) {
	return (
		<Container>
			<QuestionMark tabIndex={0}>?</QuestionMark>
			<InfoBulleText>{children}</InfoBulleText>
		</Container>
	)
}
