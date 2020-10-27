import { ScrollToTop } from 'Components/utils/Scroll'
import { Header } from './Header'
import api from '../../../../publicodes/docs/api.md'
import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import styled from 'styled-components'

// TODO Améliorer l'affichage des blocs de code JS et les rendre executables

export default function Api() {
	return (
		<>
			<div className="app-content ui__ container" css="margin: 2rem 0">
				<ScrollToTop />
				<Header />
				<ReferenceStyle>
					<MarkdownWithAnchorLinks source={api} />
				</ReferenceStyle>
			</div>
		</>
	)
}

const ReferenceStyle = styled.div`
	h4 {
		font-family: Menlo, Monaco, Lucida Console, Consolas, Liberation Mono,
			Courier New, monospace;
		margin-top: 1rem;
		padding-top: 2rem;
		border-top: 1px solid var(--lighterColor);
		em {
			color: var(--color);
		}
	}
`
