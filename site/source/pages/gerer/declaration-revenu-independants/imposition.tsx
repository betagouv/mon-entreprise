import { DottedName } from '@/../../modele-social'
import {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from '@/components/EngineValue'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import Accordion from '@/design-system/accordion'
import { Button } from '@/design-system/buttons'
import { Container, Spacing } from '@/design-system/layout'
import PopoverWithTrigger from '@/design-system/popover/PopoverWithTrigger'
import { Strong } from '@/design-system/typography'
import { H2, H3, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { getMeta } from '@/utils'
import { Grid } from '@mui/material'
import { Item } from '@react-stately/collections'
import { formatValue } from 'publicodes'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SimpleField } from '../_components/Fields'
import FormulaireTitle from './_components/FormulaireTitle'
import { useProgress } from './_components/hooks'
import ModeAccompagnement from './_components/ModeAccompagnement'

export const OBJECTIFS: Array<DottedName> = [
	'entreprise . imposition',
	'entreprise . imposition . IR . type de bénéfices',
	'entreprise . imposition . régime',
]
export default function Imposition() {
	const progress = useProgress(OBJECTIFS)
	const engine = useEngine()
	const { t } = useTranslation()

	return (
		<>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<Trans i18nKey="assistant-DRI.imposition.intro">
						<Intro>
							Dans cette étape, nous allons déterminer les{' '}
							<Strong>déclarations qui vous concernent</Strong> et la{' '}
							<Strong>liste des cases que vous aurez à remplir</Strong>.
						</Intro>
					</Trans>
					<ModeAccompagnement />
					<Condition expression="DRI . accompagnement imposition">
						<FromTop>
							<H2>Type d'imposition</H2>
							<Markdown components={{ p: Intro }}>
								{formatValue(
									engine.evaluate('DRI . accompagnement imposition . type')
								)}
							</Markdown>
							<Accordion>
								<Item
									key="explications"
									title={t("Qu'est ce que ça veut dire ?")}
									hasChildItems={false}
								>
									<Condition expression="entreprise . imposition . IR">
										<Markdown>
											{engine.getRule('entreprise . imposition . IR').rawNode
												.description ?? ''}
										</Markdown>
									</Condition>
									<Condition expression="entreprise . imposition . IS">
										<Markdown>
											{engine.getRule('entreprise . imposition . IS').rawNode
												.description ?? ''}
										</Markdown>
									</Condition>
								</Item>
								<Item
									key="exceptions"
									title={t(
										"Dans quels cas mon entreprise n'est pas imposée à l'impôt sur le revenu ?"
									)}
									hasChildItems={false}
								>
									<Markdown>
										{formatValue(
											engine.evaluate(
												'DRI . accompagnement imposition . type . exceptions'
											)
										)}
									</Markdown>
								</Item>
							</Accordion>
							<ModifyInformation dottedName="entreprise . imposition">
								Modifier le type d'imposition
							</ModifyInformation>
							<Condition expression="entreprise . imposition . IR">
								<H2>Type de bénéfice</H2>
								<Markdown components={{ p: Intro }}>
									{formatValue(
										engine.evaluate(
											'DRI . accompagnement imposition . bénéfice'
										)
									)}
								</Markdown>
								<Accordion>
									<Item
										key="explications"
										title={t("Qu'est ce que ça veut dire ?")}
										hasChildItems={false}
									>
										<Markdown>
											{formatValue(
												engine.evaluate(
													'DRI . accompagnement imposition . bénéfice . explications'
												)
											)}
										</Markdown>
									</Item>
									{engine.evaluate(
										'DRI . accompagnement imposition . bénéfice . exceptions'
									).nodeValue !== null ? (
										<Item
											key="exceptions"
											title={t(
												'Dans quels cas mes bénéfices ne sont pas de type BNC ?'
											)}
											hasChildItems={false}
										>
											<Markdown>
												{formatValue(
													engine.evaluate(
														'DRI . accompagnement imposition . bénéfice . exceptions'
													)
												)}
											</Markdown>
										</Item>
									) : (
										(null as any) // Problem with AriaAccordionProps type
									)}
								</Accordion>
								<WhenApplicable dottedName="DRI . accompagnement imposition . bénéfice . exceptions">
									<ModifyInformation dottedName="entreprise . imposition . IR . type de bénéfices">
										Modifier le type de bénéfice
									</ModifyInformation>
								</WhenApplicable>
							</Condition>
							<H2>Régime d'imposition</H2>
							<Intro>
								Il est possible de retrouver le régime d'imposition de votre
								entreprise avec le <Strong>memento fiscal</Strong>. C'est un
								document envoyé par le service des impôts qui résume la
								situation de votre entreprise.
							</Intro>
							<Message type="info" icon>
								<Body>
									Si vous ne retrouvez pas ce document, ou si il n'est plus à
									jour, vous pouvez{' '}
									<Strong>contacter le service des impôt</Strong> pour qu'il
									vous transmette à nouveau ces informations.
								</Body>
								<Body>
									<Link href="https://www.impots.gouv.fr/contacts">
										Contacter le service des impôts
									</Link>
								</Body>
								<SmallBody>
									Vous pouvez également vous rapprocher de votre comptable pour
									avoir cette information.
								</SmallBody>
							</Message>

							<SimpleField dottedName="DRI . accompagnement imposition . régime memento fiscal" />
							<Spacing lg />

							<WhenApplicable dottedName="DRI . accompagnement imposition . régime">
								<Markdown components={{ p: Intro }}>
									{formatValue(
										engine.evaluate('DRI . accompagnement imposition . régime')
									)}
								</Markdown>
								<Accordion>
									<Item
										key="explications"
										title={t("Qu'est ce que ça veut dire ?")}
										hasChildItems={false}
									>
										<Markdown>
											{formatValue(
												engine.evaluate(
													'DRI . accompagnement imposition . explications'
												)
											)}
										</Markdown>
									</Item>
								</Accordion>
							</WhenApplicable>
						</FromTop>
					</Condition>
					<Condition expression="DRI . accompagnement imposition = non">
						<FromTop>
							{OBJECTIFS.map((dottedName) => (
								<SimpleField key={dottedName} dottedName={dottedName} />
							))}
						</FromTop>
					</Condition>
				</Grid>
			</Grid>
			<Spacing xl />
			{progress === 1 && <ResultSection />}
		</>
	)
}

function ModifyInformation(props: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Button light {...buttonProps}>
					{props.children}
				</Button>
			)}
			small
		>
			{(close) => (
				<>
					<SimpleField dottedName={props.dottedName} />
					<Spacing lg />
					<Button onPress={close}>Continuer</Button>
					<Spacing md />
				</>
			)}
		</PopoverWithTrigger>
	)
}

function ResultSection() {
	const sitePaths = useContext(SitePathsContext)
	const engine = useEngine()

	return (
		<FromTop>
			<Container
				darkMode
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<H2>Vos déclarations fiscales</H2>

				<Grid container spacing={4}>
					<Grid item lg={6}>
						<H3>Pour vous</H3>

						<Message border={false}>
							<FormulaireTitle formulaire="Formulaire 2042">
								<H3 as="h4">Déclaration de revenus</H3>
							</FormulaireTitle>
							<Body>
								C'est la déclaration de revenu qui est effectuée chaque année
								sur{' '}
								<Link href="https://www.impots.gouv.fr/accueil">
									impot.gouv.fr
								</Link>
								. Elle est utilisée pour calculer{' '}
								<Strong>
									le montant de votre impôt et de vos cotisations sociales
								</Strong>
								.
							</Body>
							<Body>
								Vous pouvez demander à votre comptable de s'en charger, mais ce
								n'est pas automatique.
							</Body>
							<Body>
								En tant qu'indépendant vous aurez à remplir une section spéciale
								sur le montant des cotisations.
							</Body>

							<WhenNotApplicable dottedName="DRI . imposition cas exclus">
								<Spacing md />
								<div
									css={`
										text-align: center;
									`}
								>
									<Button
										to={sitePaths.gérer.déclarationIndépendant.déclaration}
									>
										Continuer vers l'aide au remplissage
									</Button>
								</div>
								<Spacing sm />
							</WhenNotApplicable>
							<SmallBody>
								Je connais déjà les cases et montants à remplir :{' '}
								<Link to={sitePaths.index} isDisabled>
									accéder directement à l'estimation de mes cotisations en 2022.
								</Link>
							</SmallBody>
							<Spacing md />
						</Message>
						<WhenApplicable dottedName="DRI . imposition cas exclus">
							<FromTop>
								<Message type="info" border={false}>
									<Markdown>
										{
											engine.evaluate('DRI . imposition cas exclus')
												.nodeValue as string
										}
									</Markdown>
									<Condition expression="entreprise . imposition . régime . micro-entreprise">
										<H5>Calculer le montant des cotisations sociales 2021</H5>
										<SmallBody>
											Nous mettons à votre disposition un assistant pour
											connaître le montant des cotisations sociales à renseigner
											dans la section spéciale travailleurs indépendant de la
											déclaration de revenu.
										</SmallBody>
										<div
											css={`
												text-align: center;
											`}
										>
											<Button
												light
												size="XS"
												color="tertiary"
												to={
													sitePaths.gérer[
														'déclaration-charges-sociales-indépendant'
													]
												}
											>
												Accéder à l'assistant
											</Button>
										</div>
										<Spacing sm />
									</Condition>
								</Message>
							</FromTop>
						</WhenApplicable>
					</Grid>
					<Grid item lg={6}>
						<H3>Pour votre entreprise</H3>
						<WhenApplicable dottedName="DRI . liasse">
							<Message border={false}>
								<LiasseFiscaleTitle />
								<Body>
									C'est le formulaire qui permet de déclarer le{' '}
									<Strong>résultat détaillé</Strong> de votre entreprise.
								</Body>
								<Condition expression="entreprise . imposition . IS">
									<Body>
										Il permet de calculer le montant de l'impôt sur les
										sociétés.
									</Body>
								</Condition>
								<Body>
									Si vous avez un comptable, il se chargera de la remplir et de
									l'envoyer à l'administration fiscale.
								</Body>

								<Body>
									Si vous n'avez pas de comptable, nous mettons à votre
									disposition un assistant pour{' '}
									<Strong>
										calculer le montant de vos charges sociales déductibles
									</Strong>
									.
								</Body>

								<Body
									css={`
										text-align: center;
									`}
								>
									<Button
										light
										size="XS"
										to={
											sitePaths.gérer[
												'déclaration-charges-sociales-indépendant'
											]
										}
									>
										Accéder à l'assistant
									</Button>
								</Body>
							</Message>
						</WhenApplicable>

						<Condition expression="entreprise . imposition . régime . micro-entreprise">
							<Message border={false} icon type="info">
								Comme vous êtes au régime micro-fiscal, il n'y a pas de
								formulaire de déclaration spécifique
							</Message>
						</Condition>
					</Grid>
				</Grid>
				<Spacing lg />
			</Container>
		</FromTop>
	)
}

function LiasseFiscaleTitle() {
	const engine = useEngine()
	const liasseDottedName = (
		[
			'DRI . liasse . réel simplifié',
			'DRI . liasse . réel normal',
			'DRI . liasse . déclaration contrôlée',
		] as const
	).find((dottedName) => engine.evaluate(dottedName).nodeValue !== null)
	if (!liasseDottedName) {
		return null
	}
	const liasse = engine.getRule(liasseDottedName)

	return (
		<FormulaireTitle
			formulaire={
				getMeta<{ formulaire?: string }>(liasse.rawNode, {}).formulaire ?? ''
			}
		>
			<H3 as="h4">{liasse.title}</H3>
		</FormulaireTitle>
	)
}
