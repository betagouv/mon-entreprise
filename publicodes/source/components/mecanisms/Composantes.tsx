import { toPairs } from 'ramda'
import { Trans, useTranslation } from 'react-i18next'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import colors from './colors'
import Explanation from '../Explanation'
import { InlineMecanismName, Mecanism } from './common'

export default function Composantes({ nodeValue, explanation, unit }) {
	const { i18n } = useTranslation()
	console.log(explanation)
	return (
		<Mecanism
			name="composantes"
			displayName={false}
			value={nodeValue}
			unit={unit}
		>
			<div
				css={`
					font-weight: bold;
					:first-letter {
						text-transform: capitalize;
					}
				`}
			>
				<Trans>La somme de</Trans>{' '}
				{writtenNumbers[i18n.language ?? 'fr'][explanation.length]}{' '}
				<InlineMecanismName name="composantes" /> :
			</div>
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
