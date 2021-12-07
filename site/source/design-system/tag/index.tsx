import styled from 'styled-components'

export const Tag = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	display: flex;
	width: fit-content;
	padding: 0.25rem 1rem;
	border-radius: 0.25rem;
	color: ${({ theme }) => theme.colors.extended.grey[800]};
	font-weight: 500;
`
