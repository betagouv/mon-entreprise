import { Trans } from 'react-i18next'
import { BarèmeAttributes, TrancheTable, StyledComponent } from './Barème'
import { Mecanism, NodeValuePointer } from './common'

export default function TauxProgressif({ nodeValue, explanation, unit }) {
	return (
		<StyledComponent>
			<Mecanism name="taux progressif" value={nodeValue} unit={unit}>
				<ul className="properties">
					<BarèmeAttributes explanation={explanation} />
					<TrancheTable
						tranches={explanation.tranches}
						multiplicateur={explanation.multiplicateur}
					/>
					{nodeValue != null && (
						<>
							<b>
								<Trans>Taux calculé</Trans> :{' '}
							</b>{' '}
							<NodeValuePointer data={nodeValue * 100} unit={unit} />
						</>
					)}
				</ul>
			</Mecanism>
		</StyledComponent>
	)
}
