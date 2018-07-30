import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'
import { trancheValue } from 'Engine/mecanisms/barème'
import './Barème.css'

export default function Barème(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism barème"
			name="barème"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">
							<Trans>assiette</Trans>:{' '}
						</span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					{explanation['multiplicateur des tranches'].nodeValue !== 1 && (
						<li key="multiplicateur">
							<span className="key">
								<Trans>multiplicateur des tranches</Trans>:{' '}
							</span>
							<span className="value">
								{makeJsx(explanation['multiplicateur des tranches'])}
							</span>
						</li>
					)}
					<table className="tranches">
						<thead>
							<tr>
								<th>
									<Trans>Tranches de l&apos;assiette</Trans>
								</th>
								<th>
									<Trans>Taux</Trans>
								</th>
							</tr>
							{explanation.tranches.map(t => (
								<Tranche
									key={t['de'] + t['à']}
									tranche={t}
									trancheValue={trancheValue(
										explanation['assiette'],
										explanation['multiplicateur de tranches']
									)(t)}
								/>
							))}
						</thead>
					</table>
				</ul>
			}
		/>
	)
}

function Tranche({
	tranche: {
		'en-dessous de': maxOnly,
		'au-dessus de': minOnly,
		de: min,
		à: max,
		taux
	},
	trancheValue
}) {
	return (
		<tr className={trancheValue > 0 ? 'activated' : ''}>
			<td key="tranche">
				{maxOnly
					? `En-dessous de ${maxOnly}`
					: minOnly
						? `Au-dessus de ${minOnly}`
						: `De ${min} à ${max}`}
			</td>
			<td key="taux"> {makeJsx(taux)} </td>
		</tr>
	)
}
