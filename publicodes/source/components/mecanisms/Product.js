import React from 'react'
import { Trans } from 'react-i18next'
import { makeJsx } from '../../evaluation'
import { Node } from './common'
import './InversionNumérique.css'

export default function ProductView({ nodeValue, explanation, unit }) {
	return (
		// The rate and factor and threshold are given defaut neutral values. If there is nothing to explain, don't display them at all
		<Node
			classes="mecanism produit"
			name="produit"
			value={nodeValue}
			unit={unit}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexWrap: 'wrap'
				}}
			>
				<div style={{ textAlign: 'right' }}>
					{makeJsx(explanation.assiette)}
					{!explanation.plafond.isDefault && (
						<div
							className="ui__ notice"
							style={{
								display: 'flex',
								alignItems: 'baseline',
								flexWrap: 'wrap'
							}}
						>
							<span
								style={{
									...(explanation.plafondActif ? { background: 'yellow' } : {})
								}}
							>
								<Trans>Plafonnée à :</Trans>&nbsp;
								{makeJsx(explanation.plafond)}
							</span>
						</div>
					)}
				</div>
				{!explanation.facteur.isDefault && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<div style={{ fontSize: '1.6rem', margin: '0.5rem 1rem' }}> × </div>
						<div>{makeJsx(explanation.facteur)}</div>
					</div>
				)}
				{!explanation.taux.isDefault && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<div style={{ fontSize: '1.6rem', margin: '0 1rem' }}> × </div>
						{makeJsx(explanation.taux)}
					</div>
				)}
			</div>
		</Node>
	)
}
