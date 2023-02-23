import { DottedName } from 'modele-social'
import { PublicodesExpression, Rule, RuleNode } from 'publicodes'
import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'

import { updateSituation } from '@/actions/actions'
import { TrackPage } from '@/components/ATInternetTracking'
import Value, { Condition } from '@/components/EngineValue'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3, H4 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { getMeta } from '@/utils'

import { SimpleField } from '../../components/Fields'
import { Meta } from '../declaration'
import Exceptions from './Exceptions'
import { useApplicableFields } from './hooks'

const RuleInputWithTitle = ({
	title,
	dottedName,
}: {
	title?: string
	dottedName: string
}) => {
	const dispatch = useDispatch()

	const { t } = useTranslation()

	const dispatchValue = useCallback(
		(value: PublicodesExpression | undefined, dottedName: DottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)

	return (
		<>
			{title && (
				<H3
					css={`
						margin-top: 1rem;
					`}
				>
					{title}
					<ExplicableRule
						dottedName={dottedName}
						aria-label={t('En savoir plus')}
					/>
				</H3>
			)}
			<RuleInput
				dottedName={dottedName as DottedName}
				onChange={dispatchValue}
			/>
		</>
	)
}

export function useDéclarationRevenuFields(): Array<[DottedName, RuleNode]> {
	const déclarationRevenusManuel = useEngine().evaluate(
		'DRI . déclaration revenus manuelle'
	).nodeValue
	const engine = useEngine()

	return useApplicableFields('DRI . déclaration revenus').filter(
		([dottedName, rule]) => {
			const meta = getMeta<Meta>(rule.rawNode, {})
			if (meta?.affichage === 'non') {
				return false
			}
			if (déclarationRevenusManuel) {
				return meta?.requis === 'oui' || meta?.section === 'oui'
			}

			return engine.evaluate(dottedName).nodeValue !== undefined
		}
	)
}

function getAllCases(rule: RuleNode): string[] {
	const cases = getMeta<Meta>(rule.rawNode, {}).cases ?? []
	if (Array.isArray(cases)) {
		return cases
	}

	return [...cases['défaut'], ...cases['sans OGA']]
}

export function DéclarationRevenuSection({ progress }: { progress: number }) {
	const { absoluteSitePaths } = useSitePaths()
	const engine = useEngine()

	const déclarationRevenusManuel = engine.evaluate(
		'DRI . déclaration revenus manuelle'
	).nodeValue as boolean

	if (!déclarationRevenusManuel && progress !== 1) {
		return null
	}

	return (
		<Container
			forceTheme={!déclarationRevenusManuel ? 'dark' : undefined}
			backgroundColor={
				!déclarationRevenusManuel
					? (theme) => theme.colors.bases.primary[600]
					: undefined
			}
		>
			<TrackPage name="declaration_revenu" />
			<FromTop>
				{déclarationRevenusManuel && (
					<Body>
						Pour accéder à l'estimation des cotisations, il vous faut saisir les
						éléments de votre déclaration de revenu.
					</Body>
				)}
				<H2>Votre déclaration de revenu</H2>
				<Grid
					container
					spacing={3}
					css={`
						align-items: stretch;
						flex-wrap: wrap-reverse;
					`}
				>
					<Grid
						item
						lg={déclarationRevenusManuel ? 11 : 8}
						xl={déclarationRevenusManuel ? 9 : 7}
					>
						<Condition expression="entreprise . imposition . IS">
							<Message type="info" icon>
								Cet assistant ne gère pas encore le cas des dividendes. En cas
								de doute, demandez à votre expert comptable.
							</Message>
						</Condition>
						<Message border={false}>
							<Grid
								container
								css={`
									align-items: center;
									justify-content: space-between;
								`}
								spacing={1}
							>
								<SimpleField dottedName="DRI . déclarant" />
								<DéclarationRevenu editable={déclarationRevenusManuel} />
							</Grid>
							{déclarationRevenusManuel && (
								<SmallBody>
									* Champs requis. Vous devez compléter tous les champs pour
									continuer. Si un champs est vide, inscrivez la valeur 0.
								</SmallBody>
							)}

							<Spacing lg />

							<Grid
								xs={12}
								css={`
									text-align: center;
								`}
								item
							>
								<Button
									size="XL"
									isDisabled={progress !== 1}
									to={
										absoluteSitePaths.gérer.déclarationIndépendant.beta
											.cotisations
									}
								>
									Continuer vers l'estimation des cotisations pour 2022
								</Button>
							</Grid>
							<Spacing md />

							<ShareOrSaveSimulationBanner share print />
							<Spacing lg />
						</Message>
					</Grid>
					{!déclarationRevenusManuel && (
						<Grid item lg={4} xl={5}>
							<div
								css={`
									position: sticky !important;
									top: 1rem;
									padding-bottom: 0.001rem;
								`}
							>
								<Message type="info" border={false}>
									<Body>
										Ces informations sont fournies à titre indicatif.
										<Exceptions />
									</Body>
									<SmallBody>
										Vous restez entièrement responsable d'éventuels oublis ou
										inexactitudes dans votre déclaration.
									</SmallBody>

									<SmallBody>
										En cas de doutes, rapprochez-vous de votre expert-comptable.
									</SmallBody>
								</Message>
							</div>
						</Grid>
					)}
				</Grid>
				<Spacing xl />
			</FromTop>
		</Container>
	)
}

export function DéclarationRevenu({
	editable = false,
}: {
	editable?: boolean
}) {
	const fields = useDéclarationRevenuFields()
	const engine = useEngine()

	const caseName =
		engine.evaluate('DRI . informations complémentaires . OGA').nodeValue ===
		false
			? 'sans OGA'
			: 'défaut'

	const getCases = useCallback(
		(rule: Rule): string[] => {
			const meta = getMeta<Meta>(rule, {})

			return (
				(Array.isArray(meta.cases) && meta.cases) ||
				(typeof meta.cases === 'object' && meta.cases[caseName]) ||
				[]
			)
		},
		[caseName]
	)
	const declarant =
		engine.evaluate('DRI . déclarant').nodeValue === 'déclarant 2' ? 1 : 0

	return (
		<>
			{fields.map(([dottedName, rule]) =>
				getMeta<Meta>(rule.rawNode, {})?.section === 'oui' ? (
					<Grid item xs={12} key={dottedName}>
						{rule.dottedName.split(' . ').length === 2 ? (
							<RuleInputWithTitle
								title={rule.rawNode.question}
								dottedName={dottedName}
							/>
						) : rule.dottedName.split(' . ').length === 3 ? (
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
					<Fragment key={dottedName}>
						<Grid item xs={12} md={8}>
							<Body>
								{rule.title} <em>{rule.rawNode.note}</em>
							</Body>
						</Grid>
						{editable ? (
							<Grid item sm={12} md>
								<SimpleField
									label={getAllCases(rule).join(' / ')}
									dottedName={dottedName}
								/>
							</Grid>
						) : (
							<Grid item xs="auto">
								<Body>
									<Strong>{getCases(rule.rawNode)[declarant]}</Strong>
									<StyledCase>
										<Value expression={dottedName} linkToRule={false} />
									</StyledCase>
								</Body>
							</Grid>
						)}
					</Fragment>
				)
			)}
		</>
	)
}

const StyledCase = styled.span`
	border: 1px solid ${({ theme }) => theme.colors.bases.primary[800]};
	border-top: none;
	background-color: white;
	color: inherit;
	padding: ${({ theme }) =>
		css`
			${theme.spacings.xxs} ${theme.spacings.sm}
		`};
	display: inline-block;
	width: 5.5rem;
	text-align: right;
	margin-left: ${({ theme }) => theme.spacings.sm};
`
