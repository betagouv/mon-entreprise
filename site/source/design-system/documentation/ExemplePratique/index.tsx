import { styled } from 'styled-components'

import { ContenuInteractif } from '@/design-system'

export const ExemplePratique = styled(ContenuInteractif)`
	border-left: 4px solid ${({ theme }) => theme.colors.bases.secondary[500]};

	&::before {
		content: '📊 Exemple pratique';
		display: block;
		font-weight: 700;
		color: ${({ theme }) => theme.colors.bases.secondary[700]};
		margin-bottom: ${({ theme }) => theme.spacings.sm};
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
`
