import { Trans, useTranslation } from 'react-i18next'
import writtenNumbers from '../writtenNumbers'
import Explanation from '../Explanation'
import { CapitalizeFirstLetter, InlineMecanismName, Mecanism } from './common'

export default function Composantes({ nodeValue, explanation, unit }) {
	const { i18n } = useTranslation()
	return (
		<Mecanism
			name="composantes"
			displayName={false}
			value={nodeValue}
			unit={unit}
		>
			<CapitalizeFirstLetter>
				<Trans>La somme de</Trans>{' '}
				{writtenNumbers[i18n.language ?? 'fr'][explanation.length]}{' '}
				<InlineMecanismName name="composantes" /> :
			</CapitalizeFirstLetter>
			<ol>
				{explanation.map((c, i) => [
					<li key={i}>
						<Explanation node={c} />
						<div
							style={{
								textAlign: 'center',
								width: '100%',
								fontSize: '2.6rem',
								margin: '0.4em 0 0.2em',
							}}
						>
							{i === explanation.length - 1 ? null : '+'}
						</div>
					</li>,
				])}
			</ol>
		</Mecanism>
	)
}
