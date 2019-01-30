import React from 'react'
import { Node } from './common'
import { Trans } from 'react-i18next'
import './InversionNumérique.css'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'
import { toPairs } from 'ramda'
import { makeJsx } from 'Engine/evaluation'
import { Leaf } from 'Engine/mecanismViews/common'

let Comp = withLanguage(function InversionNumérique({
	nodeValue,
	explanation
}) {
	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism inversionNumérique"
					name="inversion numérique"
					value={nodeValue}
					child={
						!showValues || explanation.inversedWith?.value == null ? (
							<>
								<p>
									Cette formule de calcul n'existe pas ! Mais on peut faire une
									estimation à partir de&nbsp;:
								</p>
								<ul id="inversionsPossibles">
									{explanation.avec.map(el => (
										<li key={el.name}>{makeJsx(el)}</li>
									))}
								</ul>
							</>
						) : (
							<>
								{' '}
								<p>
									Cette valeur a été estimée à partir d'une autre variable qui
									possède une formule de calcul et dont la valeur a été fixée
									dans la simulation :
								</p>
								<Leaf
									classes="variable"
									dottedName={explanation.inversedWith.rule.dottedName}
									value={explanation.inversedWith.value}
								/>
							</>
						)
					}
				/>
			)}
		</ShowValuesConsumer>
	)
})

//eslint-disable-next-line
export default (nodeValue, explanation) => (
	<Comp {...{ nodeValue, explanation }} />
)
