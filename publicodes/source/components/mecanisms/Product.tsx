import { Trans } from 'react-i18next'
import { EvaluatedNode } from '../../AST/types'
import { makeJsx } from '../../evaluation'
import { Mecanism } from './common'
export default function Product(node: EvaluatedNode & { nodeKind: 'produit' }) {
	return (
		<Mecanism name="produit" value={node.nodeValue} unit={node.unit}>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					flexWrap: 'wrap',
				}}
			>
				<div style={{ textAlign: 'right' }}>
					{makeJsx(node.explanation.assiette)}
					{!node.explanation.plafond.isDefault && (
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
							{makeJsx(node.explanation.plafond)}
						</small>
					)}
				</div>
				{!node.explanation.facteur.isDefault && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div style={{ margin: '0 0.6rem' }}> × </div>
						<div>{makeJsx(node.explanation.facteur)}</div>
					</div>
				)}
				{!node.explanation.taux.isDefault && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div style={{ margin: '0 0.6rem' }}> × </div>
						{makeJsx(node.explanation.taux)}
					</div>
				)}
			</div>
		</Mecanism>
	)
}
