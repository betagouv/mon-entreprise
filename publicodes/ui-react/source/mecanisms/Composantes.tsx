import Explanation from '../Explanation'
import writtenNumbers from '../writtenNumbers'
import { CapitalizeFirstLetter, InlineMecanismName, Mecanism } from './common'

export default function Composantes({ nodeValue, explanation, unit }) {
	return (
		<Mecanism
			name="composantes"
			displayName={false}
			value={nodeValue}
			unit={unit}
		>
			<CapitalizeFirstLetter>
				La somme de {writtenNumbers[explanation.length]}{' '}
				<InlineMecanismName name="composantes" /> :
			</CapitalizeFirstLetter>
			<ol>
				{explanation.map((c, i) => [
					<li key={i}>
						<Explanation node={c} />
						<div
							style={{
								textAlign: 'center',
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
