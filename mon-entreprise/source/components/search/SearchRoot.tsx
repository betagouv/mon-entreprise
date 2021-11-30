import { InstantSearch, InstantSearchProps } from 'react-instantsearch-dom'
import styled from 'styled-components'

export const SearchRoot = styled(InstantSearch)<InstantSearchProps>`
	& .ais-Highlight-highlighted,
	& .ais-Snippet-highlighted {
		background-color: rgba(84, 104, 255, 0.1);
		color: #5468ff;
		font-style: normal;
	}
`
