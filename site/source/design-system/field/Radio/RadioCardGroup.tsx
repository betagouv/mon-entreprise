import styled from 'styled-components'

import { ToggleGroup, ToggleGroupContainer } from './ToggleGroup'

export const RadioCardGroup = styled(ToggleGroup)`
	${ToggleGroupContainer} {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: stretch;
	}
`
