import styled from 'styled-components'

export const Banner = styled.div`
	display: flex;
	width: 100%;
	margin: auto;
	align-items: center;
	justify-content: center;
	font-family: ${({ theme }) => theme.fonts.main};
`

export const InnerBanner = styled.div`
	display: flex;
	margin: auto;
	align-items: center;
	justify-content: center;
	padding: 0.5rem 1rem;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[700]
			: theme.colors.bases.primary[100]};
	border: 2px solid;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]};
	border-radius: 0.375rem;
`
