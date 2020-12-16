import { Explicable } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import * as Animate from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import Engine, { evaluateRule, EvaluatedRule } from 'publicodes'
import { equals } from 'ramda'
import {
	lazy,
	createElement,
	Suspense,
	useCallback,
	useState,
	useContext,
} from 'react'
import emoji from 'react-easy-emoji'
import { hash } from '../../../../utils'
import formulaire from './formulaire-détachement.yaml'

const LazyEndBlock = lazy(() => import('./EndBlock'))

export default function FormulaireMobilitéIndépendant() {
	const engine = new Engine(formulaire)
	return (
		<EngineProvider value={engine}>
			<h1>Demande de mobilité internationale pour travailleur indépendant</h1>
			<h2>
				<small>
					Travailleur indépendant exerçant son activité à l’étranger : Régime de
					Sécurité sociale applicable{' '}
				</small>
			</h2>
			<p>
				Vous exercez une activité non salariée ou salariée dans un ou plusieurs
				Etats (pays) membres de l’UE, de l’
				<abbr title="Espace Économique Européen">EEE</abbr>*, en Suisse ou dans
				un pays lié à la France par convention bilatérale. A ce titre, vous
				devez <strong>compléter ce formulaire</strong> pour définir votre régime
				de Sécurité sociale applicable durant cette période et l’envoyer par
				email à{' '}
				<a href="mailto:relations.internationales@urssaf.fr">
					relations.internationales@urssaf.fr
				</a>
				.
			</p>
			<p>
				Après étude de votre demande, si les conditions le permettent, vous
				recevrez un certificat A1 (ou le formulaire spécifique) attestant du
				maintien à la Sécurité sociale française.
			</p>

			<p>
				<small>
					* Pays concernés : Allemagne, Autriche, Belgique, Bulgarie, Chypre,
					Croatie, Danemark, Espagne, Estonie, Finlande, Grèce, Hongrie,
					Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie,
					Luxembourg, Malte, Norvège, Pays-Bas, Pologne, Portugal, République
					Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède, Suisse
				</small>
			</p>

			<blockquote>
				<p className="ui__ lead">
					<strong>Attention, ce document doit être signé {emoji('✍️')}</strong>
				</p>
				<p>
					Aussi, nous vous invitons à utiliser un écran tactile pour le
					compléter (téléphone, tablette, etc.). Sinon, vous devrez l’imprimer,
					le signer et le scanner avant envoi par mail.
				</p>
			</blockquote>
			<p className="ui__ notice">
				En cas de difficultés pour{' '}
				<strong>remplir ce formulaire, contactez un conseiller</strong> par
				email{' '}
				<a href="mailto:relations.internationales@urssaf.fr">
					relations.internationales@urssaf.fr
				</a>{' '}
				ou par téléphone au{' '}
				<strong>
					<a href="tel:+33806804213">+33(0) 806 804 213</a>
				</strong>{' '}
				de 9h00 à 12h00 et de 13h00 à 16h00.
			</p>
			<FormulairePublicodes />
		</EngineProvider>
	)
}

const useFields = (
	engine: Engine<string>,
	fieldNames: Array<string>,
	situation: Record<string, unknown>
): Array<EvaluatedRule> => {
	const fields = fieldNames
		.map((name) => evaluateRule(engine, name))
		.filter(
			(node: EvaluatedRule) =>
				node.isNotApplicable !== true &&
				// TODO change this when not applicable value can be differenciated from false value
				(equals(node.missingVariables, { [node.dottedName]: 1 }) ||
					node.dottedName in situation ||
					(node.nodeValue !== false && node.nodeValue !== null)) &&
				(node.question || ((node.type || node.API) && node.nodeValue !== false))
		)
	return fields
}

const VERSION = hash(JSON.stringify(formulaire))
function FormulairePublicodes() {
	const engine = useContext(EngineContext)
	const [situation, setSituation] = usePersistingState<Record<string, string>>(
		`formulaire-détachement:${VERSION}`,
		{}
	)
	const onChange = useCallback(
		(dottedName, value) => {
			setSituation((situation) => ({
				...situation,
				[dottedName]: value,
			}))
		},
		[setSituation]
	)

	// This is a hack to reset value inside all uncontrolled fields input on clear
	const [clearFieldsKey, setKey] = useState(0)
	const handleClear = useCallback(() => {
		setSituation({})
		setKey(clearFieldsKey + 1)
	}, [clearFieldsKey, setSituation])

	engine.setSituation(situation)
	const fields = useFields(engine, Object.keys(formulaire), situation)
	const missingValues = fields.filter(
		({ dottedName, type }) =>
			type !== 'groupe' &&
			(situation[dottedName] == null || situation[dottedName] === '')
	)
	const isMissingValues = !!missingValues.length
	return (
		<Animate.fromTop key={clearFieldsKey}>
			{fields.map((field) => (
				<Animate.fromTop key={field.dottedName}>
					{field.type === 'groupe' ? (
						<>
							{createElement(
								`h${Math.min(field.dottedName.split(' . ').length + 1, 6)}`,
								{},
								field.title
							)}
							{field.description && <Markdown source={field.description} />}
						</>
					) : field.type === 'notification' && field.nodeValue === true ? (
						<small
							css={`
								color: #ff2d96;
							`}
						>
							{field.description}
						</small>
					) : (
						<>
							<label htmlFor={field.dottedName}>
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
							</label>
							{field.description && (
								<Explicable>
									<h3>{field.title}</h3>
									<Markdown source={field.description} />
								</Explicable>
							)}
							<RuleInput
								id={field.dottedName}
								dottedName={field.dottedName}
								onChange={(value) => onChange(field.dottedName, value)}
							/>
						</>
					)}
				</Animate.fromTop>
			))}

			<Suspense fallback={null}>
				<LazyEndBlock fields={fields} isMissingValues={isMissingValues} />
			</Suspense>
			{!!Object.keys(situation).length && (
				<div
					css={`
						text-align: right;
					`}
				>
					<button className="ui__  small button" onClick={handleClear}>
						<Emoji emoji={'🗑️'} /> Effacer mes réponses
					</button>
				</div>
			)}
		</Animate.fromTop>
	)
}
