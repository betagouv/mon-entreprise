import { path } from 'ramda'
import { useState } from 'react'
import Explanation from '../Explanation'
import { Mecanism, NodeValuePointer } from './common'
import styled from 'styled-components'

const SommeNode = ({ explanation, nodeValue, unit }) => (
	<StyledSomme>
		<Mecanism name="somme" value={nodeValue} unit={unit}>
			<Table explanation={explanation} unit={unit} />
		</Mecanism>
	</StyledSomme>
)
export default SommeNode

// We want to put non applicable rules a the bottom of list #1055
function sortByApplicability(a, b) {
	const isApplicable = (x) => x.nodeValue === false
	if (isApplicable(a) === isApplicable(b)) {
		return 0
	}
	return isApplicable(a) ? 1 : -1
}

let Table = ({ explanation, unit }) => (
	<div
		css={`
			display: flex;
			max-width: 100%;
			flex-direction: column;
		`}
	>
		<div>
			{explanation.sort(sortByApplicability).map((v, i) => (
				<Row key={i} {...{ v, i }} unit={unit} />
			))}
		</div>
	</div>
)

/* La colonne peut au clic afficher une nouvelle colonne qui sera une autre somme imbriquée */
function Row({ v, i, unit }) {
	let [folded, setFolded] = useState(true),
		rowFormula = path(['explanation', 'formule', 'explanation'], v),
		isSomme = rowFormula && rowFormula.name == 'somme'

	return [
		<StyledRow
			key={v.name || i}
			// className={isSomme ? '' : 'noNest'}
			className={v.nodeValue === false ? 'notApplicable' : ''}
			onClick={() => setFolded(!folded)}
		>
			<div className="element">
				<Explanation node={v} />
				{isSomme && (
					<button className="unfoldIndication ui__ notice small static simple button">
						{folded ? 'déplier' : 'replier'}
					</button>
				)}
			</div>
			{v.nodeValue != null && (
				<div className="situationValue value">
					<NodeValuePointer data={v.nodeValue} unit={v.unit} />
				</div>
			)}
		</StyledRow>,
		...(isSomme && !folded
			? [
					<div className="nested" key={v.name + '-nest'}>
						<Table explanation={rowFormula.explanation} unit={v.unit || unit} />
					</div>,
			  ]
			: []),
	]
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
	.element > .variable > .nodeHead > .nodeValue {
		display: none;
	}
	:first-child {
		border-top: none;
	}

	.element {
		flex: 1;
		max-width: 100%;
		display: flex;
		align-items: baseline;
		padding: 0.1em 0.4em;
		padding-top: 0.2em;
		overflow: hidden;
	}
	.element .unfoldIndication {
		text-transform: capitalize;
		flex: 1;
		margin-left: 0.6rem;
		text-align: left;
	}

	.element .variable,
	.element .nodeHead {
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.element .situationValue {
		display: none !important;
	}

	/* Nested Mecanism */
	+ .nested {
		padding-left: 2em;
		border-top: 1px dashed rgba(51, 51, 80, 0.15);
	}
`
