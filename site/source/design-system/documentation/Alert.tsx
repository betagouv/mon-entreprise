import { styled } from 'styled-components'

export const Alert = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== 'type',
})<{
	type?: 'info' | 'success' | 'warning' | 'error'
}>`
	padding: ${({ theme }) => `${theme.spacings.md} ${theme.spacings.lg}`};
	margin: ${({ theme }) => `${theme.spacings.md} 0`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border-left: 4px solid;

	${({ type = 'info', theme }) => {
		switch (type) {
			case 'success':
				return `
					background-color: ${theme.colors.extended.success[100]};
					border-left-color: ${theme.colors.extended.success[500]};
					color: ${theme.colors.extended.success[600]};
				`
			case 'warning':
				return `
					background-color: ${theme.colors.extended.info[100]};
					border-left-color: ${theme.colors.extended.info[500]};
					color: ${theme.colors.extended.info[600]};
				`
			case 'error':
				return `
					background-color: ${theme.colors.extended.error[100]};
					border-left-color: ${theme.colors.extended.error[400]};
					color: ${theme.colors.extended.error[600]};
				`
			default:
				return `
					background-color: ${theme.colors.bases.primary[100]};
					border-left-color: ${theme.colors.bases.primary[500]};
					color: ${theme.colors.bases.primary[700]};
				`
		}
	}}

	p:last-child {
		margin-bottom: 0;
	}
`
