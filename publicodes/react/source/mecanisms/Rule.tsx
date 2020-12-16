import { capitalise0 } from 'publicodes'
import styled from 'styled-components'
import Explanation from '../Explanation'

export default function RuleMecanism({ rawNode, explanation }) {
	return (
		<Styled>
			<code className="ui__ light-bg">{capitalise0(rawNode.nom)}</code>
			<Explanation node={explanation.valeur} />
		</Styled>
	)
}

const Styled = styled.div`
	display: flex;
	flex-direction: column;

	code {
		align-self: flex-start;
		margin: 0;
		margin-bottom: 0.2rem;
	}
`
