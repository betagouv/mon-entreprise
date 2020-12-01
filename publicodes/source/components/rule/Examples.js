import classNames from 'classnames'
import { Trans } from 'react-i18next'

export default function Examples({ rule, setCurrentExample, currentExample }) {
	let { examples } = rule

	if (!examples) return null
	return (
		<>
			<h2>
				<Trans i18nKey="examples">Exemples</Trans>{' '}
			</h2>
			<ul>
				{examples.map((ex) => (
					<Example
						key={ex.nom}
						{...{ ex, rule, currentExample, setCurrentExample }}
					/>
				))}
			</ul>

			{currentExample && (
				<button
					className="ui__ button small"
					onClick={() => setCurrentExample(null)}
				>
					<Trans i18nKey="cancelExample">Enlever l'exemple</Trans>
				</button>
			)}
		</>
	)
}

let Example = ({
	ex: { nom, situation },
	rule,
	currentExample,
	setCurrentExample,
}) => {
	let selected = currentExample && currentExample.name == nom
	return (
		<li key={nom}>
			<button
				onClick={() =>
					selected
						? setCurrentExample(null)
						: setCurrentExample(nom, situation, rule.dottedName)
				}
				className={classNames('ui__ button small', {
					selected,
				})}
			>
				{nom}
			</button>
		</li>
	)
}
