import { Trans } from 'react-i18next'
import { makeJsx } from '../../evaluation'
import { Mecanism } from './common'

export default function ProductView({ nodeValue, explanation, unit }) {
	return (
		// The rate and factor and threshold are given defaut neutral values. If there is nothing to explain, don't display them at all
		<Mecanism name="produit" value={nodeValue} unit={unit}>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					flexWrap: 'wrap'
				}}
			>
				<div style={{ textAlign: 'right' }}>
					{makeJsx(explanation.assiette)}
					{!explanation.plafond.isDefault && (
						<small
							css={`
								display: flex;
								align-items: baseline;
								justify-content: flex-end;
								flex-wrap: wrap;
							`}
						>
							<span>
								<Trans>Plafonnée à :</Trans>&nbsp;
							</span>
							{makeJsx(explanation.plafond)}
						</small>
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
						<div style={{ margin: '0 0.6rem' }}> × </div>
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
						<div style={{ margin: '0 0.6rem' }}> × </div>
						{makeJsx(explanation.taux)}
					</div>
				)}
			</div>
		</Mecanism>
	)
}
