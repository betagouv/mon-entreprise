import { styled } from 'styled-components'

export const ValeurImportante = styled.div`
	display: inline-flex;
	align-items: center;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	border: 1px solid ${({ theme }) => theme.colors.bases.primary[300]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	font-weight: 600;
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	margin: ${({ theme }) => `0 ${theme.spacings.xxs}`};
`
