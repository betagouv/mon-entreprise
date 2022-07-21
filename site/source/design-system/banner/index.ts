import { Button } from '@/design-system/buttons'
import { GenericButtonOrNavLinkProps } from '@/design-system/typography/link'
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
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	border: 2px solid;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]};
	border-radius: 0.375rem;
`

export const HideButton = styled(Button)<GenericButtonOrNavLinkProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 1.5rem;
	width: 1.5rem;
	padding: 0;
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	color: ${({ theme }) => theme.colors.bases.primary[600]};
	font-weight: bold;
	margin-left: 1rem;

	&:hover {
		background: ${({ theme }) => theme.colors.bases.primary[300]};
	}
`
