import { Grid } from '@mui/material'
import RuleInput from 'Components/conversation/RuleInput'
import { Condition } from 'Components/EngineValue'
import { FromTop } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import { Button } from 'DesignSystem/buttons'
import { headings } from 'DesignSystem/typography'
import { H1 } from 'DesignSystem/typography/heading'
import { Body, Intro, SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import Engine, { UNSAFE_isNotApplicable } from 'publicodes'
import { equals, isEmpty, omit } from 'ramda'
import { lazy, Suspense, useCallback, useContext, useState } from 'react'
import { TrackPage } from '../../../ATInternetTracking'
import { hash } from '../../../utils'
import formulaire from './demande-mobilité.yaml'

const LazyEndBlock = lazy(() => import('./EndBlock'))

export default function FormulaireMobilitéIndépendant() {
	const engine = new Engine(formulaire)
	return (
		<EngineProvider value={engine}>
			<H1>Demande de mobilité internationale pour travailleur indépendant</H1>
			<Intro>
				Travailleur indépendant exerçant son activité à l’étranger : Régime de
				Sécurité sociale applicable
			</Intro>
			<Body>
				Vous exercez une activité non salariée ou salariée dans un ou plusieurs
				Etats (pays) membres de l’UE, de l’
				<abbr title="Espace Économique Européen">EEE</abbr>*, en Suisse ou dans
				un pays lié à la France par convention bilatérale. A ce titre, vous
				devez <strong>compléter ce formulaire</strong> pour définir votre régime
				de Sécurité sociale applicable durant cette période et l’envoyer par
				email à{' '}
				<a href="mailto:mobilite-internationale@urssaf.fr">
					mobilite-internationale@urssaf.fr
				</a>
				.
			</Body>
			<Body>
				Après étude de votre demande, si les conditions le permettent, vous
				recevrez un certificat A1 (ou le formulaire spécifique) attestant du
				maintien à la Sécurité sociale française.
			</Body>

			<SmallBody>
				* Pays concernés : Allemagne, Autriche, Belgique, Bulgarie, Chypre,
				Croatie, Danemark, Espagne, Estonie, Finlande, Grèce, Hongrie, Irlande,
				Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte,
				Norvège, Pays-Bas, Pologne, Portugal, République Tchèque, Roumanie,
				Royaume-Uni, Slovaquie, Slovénie, Suède, Suisse
			</SmallBody>

			<blockquote>
				<Intro>
					<strong>
						Attention : ce document doit être signé <Emoji emoji="✍️" />
					</strong>
				</Intro>
				<Body>
					Aussi, nous vous invitons à utiliser un écran tactile pour le
					compléter (téléphone, tablette, etc.). Sinon, vous devrez l’imprimer,
					le signer et le scanner avant envoi par mail.
				</Body>
			</blockquote>
			<Body>
				En cas de difficultés pour{' '}
				<strong>remplir ce formulaire, contactez un conseiller</strong> par
				email{' '}
				<a href="mailto:mobilite-internationale@urssaf.fr">
					mobilite-internationale@urssaf.fr
				</a>{' '}
				ou par téléphone au{' '}
				<strong>
					<a href="tel:+33806804213">+33(0) 806 804 213</a>
				</strong>{' '}
				de 9h00 à 12h00 et de 13h00 à 16h00 (service gratuit + prix appel).
			</Body>
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
			if (value === undefined) {
				setSituation((situation) => omit([dottedName], situation))
			} else {
				setSituation((situation) => ({
					...situation,
					[dottedName]: value,
				}))
			}
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
		<FromTop key={clearFieldsKey}>
			<Grid container spacing={2}>
				{fields.map(
					({ rawNode: { description, type, question }, title, dottedName }) => {
						const headerLevel = Math.min(dottedName.split(' . ').length + 1, 6)
						const HeaderComponent = headings.fromLevel(headerLevel)

						return type === 'groupe' ? (
							<Grid item xs={12}>
								<FromTop key={dottedName}>
									<HeaderComponent>{title}</HeaderComponent>
									{description && <Markdown source={description} />}
								</FromTop>
							</Grid>
						) : type === 'notification' ? (
							<Condition expression={dottedName}>
								<Grid item xs={12}>
									<FromTop key={dottedName}>
										<SmallBody
											css={`
												color: #ff2d96;
											`}
										>
											{description}
										</SmallBody>
									</FromTop>
								</Grid>
							</Condition>
						) : (
							<Grid
								item
								xs={12}
								md={question || type === 'booléen' || !type ? 12 : 6}
							>
								<FromTop key={dottedName}>
									{question && <SmallBody>{question}</SmallBody>}
									<RuleInput
										id={dottedName}
										dottedName={dottedName as DottedName}
										onChange={(value) => onChange(dottedName, value)}
									/>
								</FromTop>
							</Grid>
						)
					}
				)}
			</Grid>

			<Suspense fallback={null}>
				<LazyEndBlock fields={fields} isMissingValues={isMissingValues} />
			</Suspense>
			{!!Object.keys(situation).length && (
				<div
					css={`
						text-align: right;
					`}
				>
					<Button size="XS" light onPress={handleClear}>
						<Emoji emoji={'🗑️'} /> Effacer mes réponses
					</Button>
				</div>
			)}
			{!Object.keys(situation).length ? (
				<TrackPage name="accueil" />
			) : isMissingValues ? (
				<TrackPage name="commence" />
			) : null}
		</FromTop>
	)
}
