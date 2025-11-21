import { styled } from 'styled-components'

import { InstitutionLogo } from './InstitutionLogo'

export const InstitutionLine = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: ${({ theme }) => theme.spacings.md} 0;
	flex-wrap: nowrap;

	> ${InstitutionLogo} {
		display: block;
		width: 13ch;
		text-align: center;
	}

	> :nth-child(2) {
		flex: 1 1 0%;
		margin: 0;
		padding: 0 4rem 0 2rem;
	}

	@media (max-width: 680px) {
		flex-wrap: wrap;

		> :nth-child(1) {
			flex-basis: 50%;
			display: flex;
		}

		> :nth-child(2) {
			order: 3;
			padding: 0.5rem 0 0 0;
		}

		> :nth-child(3) {
			order: 2;
			flex-basis: 50%;
			display: flex;
			justify-content: flex-end;
		}
	}
`
