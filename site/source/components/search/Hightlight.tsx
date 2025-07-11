import { Highlight as ISHighlight } from 'react-instantsearch-dom'
import { styled } from 'styled-components'

export const Highlight = styled(ISHighlight)`
	& .ais-Highlight-highlighted,
	& .ais-Snippet-highlighted {
		background: #eff1ff;
		color: #0522ff;
		font-style: normal;
	}
`
