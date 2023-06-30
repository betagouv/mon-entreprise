import { PublicodesExpression } from 'publicodes'
import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { SwitchInput } from '@/components/conversation/ChoicesInput'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Drawer } from '@/design-system/drawer'
import { ArrowRightIcon, InfoIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H4, H5 } from '@/design-system/typography/heading'
import { Link, StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { answerQuestion } from '@/store/actions/actions'

import { useCasParticuliers } from '../contexts/CasParticuliers'
import { EngineComparison } from './Comparateur'

const DOTTEDNAME_SOCIETE_IMPOT = 'entreprise . imposition'
const DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'
const DOTTEDNAME_ACRE = 'dirigeant . exonérations . ACRE'

const ModifierOptions = ({
	namedEngines,
}: {
	namedEngines: EngineComparison
}) => {
	const notAutoEntrepreneur = namedEngines.find(({ name }) =>
		['EI', 'EURL', 'SARL', 'SELARL', 'SELARLU'].includes(name)
	)

	const defaultValueImpot = notAutoEntrepreneur?.engine.evaluate(
		DOTTEDNAME_SOCIETE_IMPOT
	).nodeValue

	const autoEntrepreneurEngine = namedEngines.find(
		({ name }) => name === 'AE'
	)?.engine
	const defaultValueVersementLiberatoire = autoEntrepreneurEngine?.evaluate(
		DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE
	).nodeValue

	const defaultValueACRE =
		notAutoEntrepreneur?.engine.evaluate(DOTTEDNAME_ACRE).nodeValue

	const [impotValue, setImpotValue] = useState(
		`'${String(defaultValueImpot)}'` || "'IS'"
	)
	const [versementLiberatoireValue, setVersementLiberatoireValue] = useState(
		defaultValueVersementLiberatoire
	)
	const [acreValue, setAcreValue] = useState(defaultValueACRE)
	const { isAutoEntrepreneurACREEnabled, setIsAutoEntrepreneurACREEnabled } =
		useCasParticuliers()

	const [AEAcreValue, setAEAcreValue] = useState<boolean | null>(null)

	const { t } = useTranslation()

	const dispatch = useDispatch()

	const onCancel = useCallback(() => {
		setAcreValue(null)
		setVersementLiberatoireValue(null)
	}, [])

	return (
		<Drawer
			trigger={(buttonProps) => (
				<Button
					color="secondary"
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...buttonProps}
				>
					<Trans>Modifier mes options</Trans> <StyledArrowRightIcon />
				</Button>
			)}
			confirmLabel="Enregistrer les options"
			onConfirm={() => {
				dispatch(
					answerQuestion(
						DOTTEDNAME_SOCIETE_IMPOT,
						impotValue as PublicodesExpression
					)
				)

				const versementLibératoireValuePassed =
					versementLiberatoireValue === null
						? defaultValueVersementLiberatoire
						: versementLiberatoireValue
				dispatch(
					answerQuestion(
						DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE,
						versementLibératoireValuePassed ? 'oui' : 'non'
					)
				)

				const acreValuePassed =
					acreValue === null ? defaultValueACRE : acreValue
				dispatch(
					answerQuestion(DOTTEDNAME_ACRE, acreValuePassed ? 'oui' : 'non')
				)

				if (!acreValuePassed) {
					setIsAutoEntrepreneurACREEnabled(false)
				} else if (AEAcreValue !== null) {
					setIsAutoEntrepreneurACREEnabled(AEAcreValue)
				}
			}}
			onCancel={onCancel}
		>
			<>
				<H2>
					<Trans>Modifier mes options</Trans>
				</H2>

				<Spacing md />
				<Flex>
					<H4 as="h2">Bénéficier de l'ACRE</H4>
					<ExplicableRule
						dottedName="dirigeant . exonérations . ACRE"
						title="Bénéficier de l'ACRE"
					/>
				</Flex>

				<Body>
					L'aide à la création ou à la reprise d'une entreprise (Acre) consiste
					en une <Strong>exonération partielle de charges sociales</Strong>,
					dite exonération de début d'activité <Strong>pendant 12 mois</Strong>.
				</Body>
				{
					// TODO : décommenter une fois le simulateur créé
					<Button
						href="https://entreprendre.service-public.fr/vosdroits/F23282"
						aria-label={t('En savoir plus, nouvelle fenêtre')}
						color="secondary"
						light
						size="XS"
					>
						<Trans>En savoir plus</Trans>
					</Button>
				}
				<H5 as="h3">Choisir mon option de simulation</H5>
				<div aria-live="polite">
					<FlexCentered>
						<SwitchInput
							id="activation-acre"
							onChange={(value: boolean) => setAcreValue(value)}
							defaultSelected={defaultValueACRE as boolean}
							label="Activer l'ACRE dans la simulation"
							invertLabel
						/>
					</FlexCentered>

					{autoEntrepreneurEngine && (acreValue || defaultValueACRE) && (
						<>
							<Body>
								Les{' '}
								<StyledLink href="https://www.urssaf.fr/portail/home/independant/je-beneficie-dexonerations/accre/qui-peut-en-beneficier.html">
									conditions d'accès
								</StyledLink>{' '}
								à l'ACRE sont plus restrictives pour les auto-entrepreneurs.
							</Body>
							<FlexCentered>
								<SwitchInput
									id="activation-acre-ae"
									onChange={(value: boolean) => setAEAcreValue(value)}
									defaultSelected={isAutoEntrepreneurACREEnabled}
									label="Je suis éligible à l'ACRE pour mon auto-entreprise"
									invertLabel
								/>
							</FlexCentered>
						</>
					)}
				</div>

				<Spacing md />
				<H4 as="h2">Quelle imposition pour mon entreprise ?</H4>
				<Body>
					Vous pouvez{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années.
					{autoEntrepreneurEngine && (
						<>
							En auto-entreprise (AE), c’est l’
							<Strong>impôt sur le revenu</Strong> qui est appliqué
							automatiquement ; dans certaines situations, vous pouvez aussi
							opter pour le{' '}
							<Strong>
								<Link href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire">
									versement libératoire
								</Link>
							</Strong>
							.
						</>
					)}
				</Body>
				<H5 as="h3">
					Choisir mon option de simulation (pour {notAutoEntrepreneur?.name})
				</H5>
				<Message type="secondary">
					<Grid
						container
						css={`
							flex-wrap: nowrap;
							align-items: baseline;
						`}
						spacing={3}
					>
						<Grid item>
							<InfoIcon
								css={`
									padding-top: 0.15rem;
									display: inline-block;
								`}
								aria-label={t('Message à caractère informatif')}
							/>
						</Grid>
						<Grid item>
							<Body
								css={`
									font-size: 0.875rem;
								`}
							>
								<Trans>
									À ce jour, ce comparateur ne prend pas en compte le calcul de
									l'impôt sur le revenu pour les SAS(U).
								</Trans>
							</Body>
						</Grid>
					</Grid>
				</Message>
				<RuleInput
					dottedName={DOTTEDNAME_SOCIETE_IMPOT}
					onChange={(value: PublicodesExpression | undefined) => {
						setImpotValue(String(value))
					}}
					key="imposition"
					aria-labelledby="questionHeader"
					engine={namedEngines[0].engine}
				/>
				{autoEntrepreneurEngine && (
					<>
						<H5 as="h3">
							Choisir mon option de versement libératoire (pour AE){' '}
							<ExplicableRule
								dottedName={DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE}
							/>
						</H5>
						<FlexCentered>
							<SwitchInput
								id="versement-liberatoire"
								onChange={setVersementLiberatoireValue}
								defaultSelected={defaultValueVersementLiberatoire as boolean}
								label="Activer le versement libératoire dans la simulation."
								invertLabel
							/>
						</FlexCentered>
					</>
				)}
			</>
		</Drawer>
	)
}

const Flex = styled.div`
	display: flex;
	align-items: baseline;
`

const FlexCentered = styled.div`
	display: flex;
	align-items: center;
`

const StyledArrowRightIcon = styled(ArrowRightIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`

export default ModifierOptions
