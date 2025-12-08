import { css, styled } from 'styled-components'

import { ToggleGroup, ToggleGroupContainer } from './ToggleGroup'

export const RadioCardGroup = styled(ToggleGroup).withConfig({
	shouldForwardProp: (prop) => prop !== 'isSubGroup',
})<{ isSubGroup?: boolean }>`
	${ToggleGroupContainer} {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: stretch;
		${({ isSubGroup }) =>
			isSubGroup &&
			css`
				padding-left: ${({ theme }) => theme.spacings.md};
				border-left: 2px dotted
					${({ theme }) => theme.colors.extended.grey[500]};
			`}
	}
`
