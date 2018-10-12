import React from 'react'
import { Node, NodeValuePointer, formatNumber } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'
import { trancheValue } from 'Engine/mecanisms/barème'
import './Barème.css'
import classNames from 'classnames'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'

export default function Barème(nodeValue, explanation) {
	let Comp = withLanguage(({ language }) => (
		<ShowValuesConsumer>
			{showValues => (
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
											<Trans>Tranche de l&apos;assiette</Trans>
										</th>
										<th>
											<Trans>Taux</Trans>
										</th>
										{showValues && (
											<th>
												<Trans>Résultat</Trans>
											</th>
										)}
									</tr>
									{explanation.tranches.map(tranche => (
										<Tranche
											key={tranche['de'] + tranche['à']}
											{...{
												language,
												tranche,
												showValues,
												trancheValue: trancheValue(
													explanation['assiette'],
													explanation['multiplicateur des tranches']
												)(tranche)
											}}
										/>
									))}
								</thead>
							</table>
							{showValues && (
								<>
									<b>
										<Trans>Taux final</Trans> :{' '}
									</b>
									{formatNumber(
										(nodeValue / explanation['assiette'].nodeValue) * 100,
										language
									)}{' '}
									%
								</>
							)}
						</ul>
					}
				/>
			)}
		</ShowValuesConsumer>
	))
	return <Comp />
}

let Tranche = ({
	tranche: {
		'en-dessous de': maxOnly,
		'au-dessus de': minOnly,
		de: min,
		à: max,
		taux
	},
	trancheValue,
	showValues,
	language
}) => (
	<tr className={classNames('tranche', { activated: trancheValue > 0 })}>
		<td key="tranche">
			{maxOnly ? (
				<>
					<Trans>En-dessous de</Trans> {formatNumber(maxOnly, language)}
				</>
			) : minOnly ? (
				<>
					<Trans>Au-dessus de</Trans> {formatNumber(minOnly, language)}
				</>
			) : (
				<>
					<Trans>De</Trans> {formatNumber(min, language)} <Trans>à</Trans>{' '}
					{formatNumber(max, language)}
				</>
			)}
		</td>
		<td key="taux"> {makeJsx(taux)}</td>
		{showValues && (
			<td key="value">
				<NodeValuePointer data={trancheValue} />
			</td>
		)}
	</tr>
)
