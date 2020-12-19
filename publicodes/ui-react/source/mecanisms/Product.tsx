import { Trans } from 'react-i18next'
import { EvaluatedNode } from 'publicodes/source/AST/types'
import Explanation from '../Explanation'
import { Mecanism } from './common'
import styled from 'styled-components'

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
					<Explanation node={node.explanation.assiette} />
					{!node.explanation.plafond.isDefault && (
						<PlafondSmall>
							<span>
								<Trans>Plafonnée à :</Trans>&nbsp;
							</span>
							<Explanation node={node.explanation.plafond} />
						</PlafondSmall>
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
						<div>
							<Explanation node={node.explanation.facteur} />
						</div>
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
						<Explanation node={node.explanation.taux} />
					</div>
				)}
			</div>
		</Mecanism>
	)
}

const PlafondSmall = styled.small`
	display: flex;
	align-items: baseline;
	justify-content: flex-end;
	flex-wrap: wrap;
`
