import styled from 'styled-components'

const baseParagraphStyle = `
	font-family: 'Roboto', sans-serif;
`

export const Intro = styled.p`
	${baseParagraphStyle}
	font-size: 1.25rem;
	line-height: 2rem;
`

export const Body = styled.p`
	${baseParagraphStyle}
	font-size: 1rem;
	line-height: 1.5rem;
`

export const SmallBody = styled.p`
	${baseParagraphStyle}
	font-size: 0.875rem;
	line-height: 1.25rem;
`

export const ExtraSmallBody = styled.p`
	${baseParagraphStyle}
	font-size: 0.75rem;
	line-height: 1rem;
`
