import RuleInput from 'Components/conversation/RuleInput'
import * as Animate from 'Components/ui/animate'
import InfoBulle from 'Components/ui/InfoBulle'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import Engine from 'publicodes'
import React, { Suspense, useCallback } from 'react'
import emoji from 'react-easy-emoji'
import { hash } from '../../../../../utils'
import formulaire from './formulaire-détachement.yaml'
import { Explicable } from 'Components/conversation/Explicable'

const LazyEndBlock = React.lazy(() => import('./EndBlock'))

export default function formulaireMobilitéIndépendant() {
	const engine = new Engine(formulaire)
	return (
		<>
			<h1>Demande de mobilité en Europe pour travailleur indépendant</h1>
			<p>
				Vous exercez une activité non salariée ou salariée dans un ou plusieurs
				Etats (pays) membres de l’UE, de l’EEE ou en Suisse. Remplissez ce
				formulaire pour définir votre régime de Sécurité sociale applicable, et
				envoyez la demande générée à l'adresse :{' '}
				<a href="mailto:relations.internationales@urssaf.fr">
					relations.internationales@urssaf.fr
				</a>
				.
			</p>
			<blockquote>
				<p className="ui__ lead">
					<strong>Ce document nécessite votre signature {emoji('✍️')}</strong>
				</p>
				<p>
					Nous vous suggérons d'utiliser un appareil avec écran tactile pour
					compléter ce formulaire (téléphone, tablette, etc.).{' '}
				</p>
				<p>
					Autremenent, il vous faudra imprimer, signer et scanner le document
					généré.
				</p>
			</blockquote>
			<FormulairePublicodes engine={engine} />
		</>
	)
}

const useFields = (engine: Engine<string>, fieldNames: Array<string>) => {
	const fields = fieldNames
		.map(name => engine.evaluate(name))
		.filter(
			node =>
				node.isApplicable !== false &&
				node.isApplicable !== null &&
				(node.question || node.type || node.API)
		)
	return fields
}

const VERSION = hash(JSON.stringify(formulaire))
function FormulairePublicodes({ engine }) {
	const [situation, setSituation] = usePersistingState(
		`formulaire-détachement:${VERSION}`,
		{}
	)
	const onChange = useCallback(
		(dottedName, value) => {
			setSituation(situation => ({
				...situation,
				[dottedName]: value
			}))
		},
		[setSituation]
	)
	engine.setSituation(situation)
	const fields = useFields(engine, Object.keys(formulaire))
	const isMissingValues = fields.some(
		({ dottedName, type }) =>
			type !== 'groupe' &&
			(situation[dottedName] == null || situation[dottedName] === '')
	)
	return (
		<Animate.fromTop>
			{fields.map(field => (
				<Animate.fromTop key={field.dottedName}>
					{field.type === 'groupe' ? (
						<>
							{React.createElement(
								`h${Math.min(field.dottedName.split(' . ').length + 1, 6)}`,
								{},
								field.title
							)}
							{field.description && <Markdown source={field.description} />}
						</>
					) : (
						<label
							css={`
								display: block;
							`}
						>
							{field.question ? (
								<span
									css={`
										margin-top: 0.6rem;
									`}
								>
									{field.question}
								</span>
							) : (
								<small>{field.title}</small>
							)}{' '}
							{field.description && (
								<Explicable>
									<h3>{field.title}</h3>
									<Markdown source={field.description} />
								</Explicable>
							)}
							<RuleInput
								dottedName={field.dottedName}
								rules={engine.getParsedRules()}
								value={situation[field.dottedName]}
								onChange={value => onChange(field.dottedName, value)}
							/>
						</label>
					)}
				</Animate.fromTop>
			))}
			<Suspense fallback={null}>
				<LazyEndBlock fields={fields} isMissingValues={isMissingValues} />
			</Suspense>
		</Animate.fromTop>
	)
}
