import { DottedName } from '@/../../modele-social'
import Value, { Condition } from '@/components/EngineValue'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import Accordion from '@/design-system/accordion'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { Container, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol } from '@/design-system/typography/list'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { getMeta } from '@/utils'
import { Grid } from '@mui/material'
import { Item } from '@react-stately/collections'
import { Rule, RuleNode } from 'publicodes'
import { useContext, useMemo } from 'react'
import { Trans } from 'react-i18next'
import styled, { css } from 'styled-components'
import { SimpleField } from '../_components/Fields'
import { useProgress } from './_components/hooks'

interface Meta {
	facultatif?: 'oui' | 'non'
	section?: 'oui' | 'non'
	affichage?: string
	cases?: string[] | { défaut: string[] }
}

export function useObjectifs(): Array<DottedName> {
	return useLiasseFiscaleFields()
		.filter(
			([, rule]) =>
				getMeta<Meta>(rule.rawNode, {})?.facultatif !== 'oui' &&
				getMeta<Meta>(rule.rawNode, {})?.section !== 'oui'
		)
		.map(([dottedName]) => dottedName)
}

export default function Déclaration() {
	const engine = useEngine()
	const liasseDottedName = (
		[
			'DRI . liasse . réel simplifié',
			'DRI . liasse . réel normal',
			'DRI . liasse . déclaration contrôlée',
		] as const
	).find((dottedName) => engine.evaluate(dottedName).nodeValue !== null)
	if (!liasseDottedName) {
		return null // TODO : micro-fiscal
	}
	const liasse = engine.getRule(liasseDottedName)

	return (
		<>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<FromTop>
						<H2>Aide au remplissage de la déclaration de revenu</H2>
						<Trans i18nKey="assistant-DRI.imposition.intro">
							<Intro>
								Nous allons maintenant vous indiquer comment remplir votre
								déclaration de revenu personnelle à partir de la déclaration de
								résultat de votre entreprise.
							</Intro>
						</Trans>
						<H3>Où trouver la déclaration de résultat de l'entreprise ?</H3>

						<Body>
							C'est le comptable qui se charge de remplir la déclaration de
							résultat. Il s'occupe également de la transmettre aux impôts en
							début d'année.
						</Body>

						<Accordion>
							<Item
								title="Récupérer le formulaire complété sur «&nbsp;impot.gouv.fr&nbsp;»"
								key="impot.gouv.fr"
								hasChildItems={false}
							>
								<Body>
									Si le formulaire de déclaration de résultat de votre
									entreprise a déjà été envoyé aux impôts, vous pouvez y accéder
									en suivant ces étapes :{' '}
								</Body>
								<Ol>
									<Li>
										Connectez-vous à votre espace professionnel sur{' '}
										<Link
											href="https://cfspro.impots.gouv.fr/mire/accueil.do"
											title="Accéder à mon espace professionnel"
										>
											impot.gouv.fr
										</Link>
									</Li>
									<Li>
										Dans le menu «&nbsp;<Strong>consulter</Strong>&nbsp;»,
										cliquez sur «&nbsp;<Strong>compte fiscal</Strong>&nbsp;»
									</Li>
									<Li>
										Dans le menu «&nbsp;<Strong>Accès par impôt</Strong>&nbsp;»,
										allez sur «&nbsp;
										<Strong>
											<Condition expression="entreprise . imposition . IR . type de bénéfices . BNC">
												Bénéfices non commerciaux
											</Condition>
											<Condition expression="entreprise . imposition . IR . type de bénéfices . BIC">
												Bénéfices industriels et commerciaux
											</Condition>
											<Condition expression="entreprise . imposition . IS">
												Impôt sur les sociétés
											</Condition>
										</Strong>
										&nbsp;», puis sur «&nbsp;
										<Strong>Déclarations</Strong>&nbsp;»
									</Li>
									<Li>
										Cliquez sur la première ligne{' '}
										<Strong>«&nbsp;Exercice clos le 31/12/2021&nbsp;»</Strong>
									</Li>
									<Li>
										Cliquez sur la <Strong>date en gras</Strong> dans la colonne
										« date de dépôt&nbsp;»
									</Li>
								</Ol>
								<Spacing md />
								<Message type="info" icon border={false}>
									Si votre déclaration n'est pas présente, ou si vous n'avez pas
									accès à votre espace professionnel sur impot.gouv.fr, vous
									pouvez demander à votre comptable.
								</Message>
							</Item>

							<Item
								title="Demander à mon comptable la liste des cases"
								key="comptable"
								hasChildItems={false}
							>
								<Body>
									Si le formulaire de déclaration de résultat de votre
									entreprise n'apparaît pas encore sur le site des impôts, vous
									pouvez demander directement à votre comptable les montants
									nécessaire.
								</Body>
								<Body>Voici un modèle de message à transmettre :</Body>
								<Message type="secondary">
									<Markdown>{ModeleMessageComptable}</Markdown>
								</Message>
								<Button light size="XS">
									Copier le message
								</Button>
							</Item>
						</Accordion>
						<H2>{liasse.title}</H2>
						<Body>
							Pour connaître les cases à remplir dans votre déclaration de
							revenu personnelle, copiez les montant renseignés dans la
							déclaration de résultat de votre entreprise dans le formulaire
							suivant.
						</Body>
					</FromTop>
				</Grid>
				<LiasseFiscale />
			</Grid>
			<Spacing xxl />
			<ResultSection />
		</>
	)
}

const ModeleMessageComptable = `
Bonjour,

Je souhaite procéder à la déclaration de mes revenus
d'indépendant sur impot.gouv.fr. J'aurais besoin pour cela des
informations suivantes contenues dans les cases suivantes de
la déclaration de résultat de l'entreprise :

Case BV BT, BK, BZ, ... 

Je vous remercie de m'envoyer ces informations ou directement
un exemplaire de la déclaration déjà remplie.

Bien à vous,`

function useLiasseFiscaleFields(): Array<[DottedName, RuleNode]> {
	const engine = useEngine()
	const fields = useMemo(
		() =>
			(Object.entries(engine.getParsedRules()) as Array<[DottedName, RuleNode]>)
				.filter(([dottedName]) =>
					dottedName.match(/DRI \. liasse \. .* \. .*$/)
				)
				.filter(
					([dottedName]) => engine.evaluate(dottedName).nodeValue !== null
				),
		[engine.parsedSituation]
	)

	return fields
}

function LiasseFiscale() {
	const fields = useLiasseFiscaleFields()

	return (
		<>
			{fields.map(([dottedName, rule]) =>
				getMeta<Meta>(rule.rawNode, {})?.section === 'oui' ? (
					<Grid xs={12}>
						<H3
							css={`
								margin-bottom: 0rem;
							`}
						>
							{rule.title}
						</H3>
					</Grid>
				) : (
					<Grid md={4} sm={6} xs={12}>
						<SimpleField dottedName={dottedName} />
					</Grid>
				)
			)}
		</>
	)
}

function useDéclarationRevenuFields() {
	const engine = useEngine()
	const fields = useMemo(
		() =>
			Object.entries(engine.getParsedRules())
				.filter(
					([, rule]) => getMeta<Meta>(rule.rawNode, {})?.affichage !== 'non'
				)
				.filter(([dottedName]) =>
					dottedName.startsWith('DRI . déclaration revenus')
				)
				.filter(
					([dottedName]) => engine.evaluate(dottedName).nodeValue != null
				),
		[engine.parsedSituation]
	)

	return fields
}

function ResultSection() {
	const objectifs = useObjectifs()
	const fields = useDéclarationRevenuFields()
	const sitePaths = useContext(SitePathsContext)

	const isLiasseFiscaleCompleted = useProgress(objectifs) === 1
	if (!isLiasseFiscaleCompleted) {
		return null
	}

	const getCases = (rule: Rule): string[] => {
		const meta = getMeta<Meta>(rule, {})

		return (
			(Array.isArray(meta.cases) && meta.cases) ||
			(typeof meta.cases === 'object' && meta.cases.défaut) ||
			[]
		)
	}

	return (
		<Container
			darkMode
			backgroundColor={(theme) => theme.colors.bases.primary[600]}
		>
			<FromTop>
				<H2>Votre déclaration de revenu</H2>
				<Grid
					container
					spacing={3}
					alignItems="stretch"
					flexWrap={'wrap-reverse'}
				>
					<Grid item lg={8} xl={7}>
						<Message border={false}>
							<Grid
								container
								alignItems="flex-end"
								justifyContent={'space-between'}
							>
								{fields.map(([dottedName, rule]) =>
									getMeta<Meta>(rule.rawNode, {})?.section === 'oui' ? (
										<Grid xs={12}>
											{rule.dottedName.split(' . ').length === 3 ? (
												<H3>{rule.title}</H3>
											) : (
												<H4
													css={`
														margin-top: 0rem;
													`}
												>
													{rule.title}
												</H4>
											)}
										</Grid>
									) : (
										<>
											<Grid item xs={12} sm={8} md={9}>
												<Body>
													{rule.title} <em>{rule.rawNode.note}</em>
												</Body>
											</Grid>
											<Grid item xs="auto">
												<Body>
													<Strong>{getCases(rule.rawNode)[0]}</Strong>
													<StyledCase>
														<Value expression={dottedName} linkToRule={false} />
													</StyledCase>
												</Body>
											</Grid>
										</>
									)
								)}
							</Grid>
							<Spacing lg />

							<AnswerGroup justifyContent={'center'}>
								<Button size="XS" light isDisabled>
									Imprimer ou sauvegarder en PDF
								</Button>
								<Button size="XS" light isDisabled>
									Obtenir un lien de partage
								</Button>
							</AnswerGroup>
							<Spacing xl />

							<Grid
								xs={12}
								css={`
									text-align: center;
								`}
								item
							>
								<Button
									size="XL"
									to={sitePaths.gérer.déclarationIndépendant.cotisations}
								>
									Continuer vers l'estimation des cotisations pour 2022
								</Button>
							</Grid>
							<Spacing md />
						</Message>
					</Grid>

					<Grid item lg={4} xl={5}>
						<div
							css={`
								position: sticky !important;
								top: 1rem;
								padding-bottom: 0.001rem;
							`}
						>
							<Message type="info" border={false}>
								<Body>Ces informations sont fournies à titre indicatif.</Body>
								<SmallBody>
									Vous restez entièrement responsable d'éventuels oublis ou
									inexactitudes dans votre déclaration.
								</SmallBody>
								<SmallBody>
									En cas de doutes, rapprochez-vous de votre comptable.
								</SmallBody>
							</Message>
						</div>
					</Grid>
				</Grid>
				<Spacing xl />
			</FromTop>
		</Container>
	)
}

const StyledCase = styled.span`
	border: 1px solid ${({ theme }) => theme.colors.bases.primary[800]};
	border-top: none;
	background-color: white;
	padding: ${({ theme }) =>
		css`
			${theme.spacings.xxs} ${theme.spacings.sm}
		`};
	display: inline-block;
	width: 5.5rem;
	text-align: right;
	margin-left: ${({ theme }) => theme.spacings.sm};
`
