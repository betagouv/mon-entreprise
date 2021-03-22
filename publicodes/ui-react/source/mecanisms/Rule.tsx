import { capitalise0 } from 'publicodes'
import styled from 'styled-components'
import Explanation from '../Explanation'

export default function RuleMecanism({
	rawNode,
	explanation,
	title,
	virtualRule,
}) {
	return (
		<Styled>
			<span className="ui__ small label">
				{capitalise0(virtualRule ? rawNode.nom : title)}
			</span>
			<Explanation node={explanation.valeur} />
		</Styled>
	)
}

const Styled = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	padding-top: 0rem;
	margin: 1rem 0;
	border: 1px solid var(--darkColor);
	border-radius: 3px;
	> .label {
		margin: 0 -1rem;
		margin-bottom: 1rem;
		border-radius: 0rem;
	}
`
