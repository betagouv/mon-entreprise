import { Explicable } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import { Condition } from 'Components/EngineValue'
import * as Animate from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import { DottedName } from 'modele-social'
import Engine, { UNSAFE_isNotApplicable } from 'publicodes'
import { equals, isEmpty } from 'ramda'
import {
	createElement,
	lazy,
	Suspense,
	useCallback,
	useContext,
	useState,
} from 'react'
import emoji from 'react-easy-emoji'
import { hash } from '../../../utils'
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
				<a href="mailto:mobilite-internationale@urssaf.fr@urssaf.fr">
					mobilite-internationale@urssaf.fr@urssaf.fr
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
					<strong>Attention : ce document doit être signé {emoji('✍️')}</strong>
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
				<a href="mailto:mobilite-internationale@urssaf.fr@urssaf.fr">
					mobilite-internationale@urssaf.fr@urssaf.fr
				</a>{' '}
				ou par téléphone au{' '}
				<strong>
					<a href="tel:+33806804213">+33(0) 806 804 213</a>
				</strong>{' '}
				de 9h00 à 12h00 et de 13h00 à 16h00 (service gratuit + prix appel).
			</p>
			<FormulairePublicodes />
		</EngineProvider>
	)
}

const useFields = (
	engine: Engine<string>,
	fieldNames: Array<string>
): Array<ReturnType<Engine['getRule']>> => {
	return fieldNames
		.filter((dottedName) => {
			const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
			const evaluation = engine.evaluate(dottedName)
			const rule = engine.getRule(dottedName)
			return (
				isNotApplicable === false &&
				(equals(evaluation.missingVariables, { [dottedName]: 1 }) ||
					isEmpty(evaluation.missingVariables)) &&
				(rule.rawNode.question ||
					rule.rawNode.API ||
					rule.rawNode.type ||
					rule.rawNode.description)
			)
		})
		.map((dottedName) => engine.getRule(dottedName))
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
	const fields = useFields(engine, Object.keys(formulaire))

	const isMissingValues = fields.some(
		({ dottedName }) => !isEmpty(engine.evaluate(dottedName).missingVariables)
	)
	return (
		<Animate.fromTop key={clearFieldsKey}>
			{fields.map(
				({ rawNode: { description, type, question }, title, dottedName }) => (
					<Animate.fromTop key={dottedName}>
						{type === 'groupe' ? (
							<>
								{createElement(
									`h${Math.min(dottedName.split(' . ').length + 1, 6)}`,
									{},
									title
								)}
								{description && <Markdown source={description} />}
							</>
						) : type === 'notification' ? (
							<Condition expression={dottedName}>
								<small
									css={`
										color: #ff2d96;
									`}
								>
									{description}
								</small>
							</Condition>
						) : (
							<>
								<label htmlFor={dottedName}>
									{question ? (
										<span
											css={`
												margin-top: 0.6rem;
											`}
										>
											{question}
										</span>
									) : (
										<small>{title}</small>
									)}{' '}
								</label>
								{description && (
									<Explicable>
										<h3>{title}</h3>
										<Markdown source={description} />
									</Explicable>
								)}
								<RuleInput
									id={dottedName}
									dottedName={dottedName as DottedName}
									onChange={(value) => onChange(dottedName, value)}
								/>
							</>
						)}
					</Animate.fromTop>
				)
			)}

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
