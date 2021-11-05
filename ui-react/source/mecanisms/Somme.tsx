import styled from 'styled-components'
import { EvaluatedNode } from 'publicodes/source/AST/types'
import Explanation from '../Explanation'
import { Mecanism, UnfoldIsEnabledContext } from './common'

const SommeNode = ({ explanation, nodeValue, unit }) => (
	<StyledSomme>
		<Mecanism name="somme" value={nodeValue} unit={unit}>
			<Table explanation={explanation} />
		</Mecanism>
	</StyledSomme>
)
export default SommeNode

// We want to put non applicable rules a the bottom of list #1055
function sortByApplicability(a: EvaluatedNode, b: EvaluatedNode): 1 | 0 | -1 {
	const isApplicable = (x) => x.nodeValue === false
	if (isApplicable(a) === isApplicable(b)) {
		return 0
	}
	return isApplicable(a) ? 1 : -1
}

const Table = ({ explanation }) => (
	<StyledContainer>
		{explanation.sort(sortByApplicability).map((node: EvaluatedNode, i) => (
			<Row key={i} node={node} />
		))}
	</StyledContainer>
)

const StyledContainer = styled.div`
	display: flex;
	max-width: 100%;
	flex-direction: column;
`

/* La colonne peut au clic afficher une nouvelle colonne qui sera une autre somme imbriquée */
function Row({ node }: { node: EvaluatedNode }) {
	return (
		<StyledRow className={node.nodeValue === false ? 'notApplicable' : ''}>
			<div className="element">
				<UnfoldIsEnabledContext.Provider value={true}>
					<Explanation node={node} />
				</UnfoldIsEnabledContext.Provider>
			</div>
		</StyledRow>
	)
}

const StyledSomme = styled.div`
	/* mécanisme somme */
	table {
		width: 100%;
		border-collapse: collapse;
	}
	tr .element {
		text-align: left;
		padding: 0.2rem 0.4rem;
	}
	tr .value span {
		text-align: right;
	}
	.nested {
		padding: 0;
	}
`
const StyledRow = styled.div`
	display: flex;
	align-items: center;
	flex-flow: row nowrap;
	:nth-child(2n) {
		background-color: var(--lightestColor);
	}

	&.notApplicable {
		opacity: 0.6;
	}

	.element .result,
	:first-child {
		border-top: none;
	}

	.element {
		flex: 1;
		display: flex;
		max-width: 100%;
		align-items: baseline;

		padding: 0.1em 0.4em;
		padding-top: 0.2em;
		overflow: hidden;
		flex-wrap: wrap;
	}

	.element > * {
		flex: 1;
		display: flex;
		text-overflow: ellipsis;
	}
`
