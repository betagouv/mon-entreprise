import { PublicodesExpression } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Drawer } from '@/design-system/drawer'
import { ArrowRightIcon, InfoIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Strong } from '@/design-system/typography'
import { H2, H3, H5 } from '@/design-system/typography/heading'
import { Link, StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useStatefulRulesEdit } from '@/hooks/useStatefulRulesEdit'

const DOTTEDNAME_ENTREPRISE_IMPOSITION = 'entreprise . imposition'
const DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'
const DOTTEDNAME_ACRE = 'dirigeant . exonérations . ACRE'
const DOTTEDNAME_AUTOENTREPRENEUR_ELIGIBLE_ACRE =
	"dirigeant . auto-entrepreneur . éligible à l'ACRE"

type IRouIS = "'IR'" | "'IS'"

const ModifierOptions = () => {
	const { set, cancel, confirm, values } = useStatefulRulesEdit([
		DOTTEDNAME_ACRE,
		DOTTEDNAME_AUTOENTREPRENEUR_ELIGIBLE_ACRE,
		DOTTEDNAME_ENTREPRISE_IMPOSITION,
		DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE,
	] as const)

	const { t } = useTranslation()

	return (
		<Drawer
			trigger={(buttonProps) => (
				<Button
					color="secondary"
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...buttonProps}
				>
					{t('modifier-options.texte', 'Modifier mes options')}{' '}
					<StyledArrowRightIcon />
				</Button>
			)}
			confirmLabel="Enregistrer les options"
			onConfirm={confirm}
			onCancel={cancel}
		>
			<>
				<H2>{t('modifier-options.texte', 'Modifier mes options')}</H2>

				<H3>
					{t('modifier-options.acre.title', 'Bénéficier de l’Acre')}{' '}
					<ExplicableRule
						dottedName={DOTTEDNAME_ACRE}
						title={t('modifier-options.acre.title', 'Bénéficier de l’Acre')}
					/>
				</H3>

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
						{t('En savoir plus')}
					</Button>
				}
				<H5 as="h4">Choisir mon option de simulation</H5>
				<div aria-live="polite">
					<FlexCentered>
						<Switch
							id="activation-acre"
							onChange={(value: boolean) => set[DOTTEDNAME_ACRE](value)}
							defaultSelected={values[DOTTEDNAME_ACRE] as boolean}
							light
							/* Need this useless aria-label to silence a React-Aria warning */
							aria-label=""
						>
							{t(
								'modifier-options.activer-acre',
								'Activer l’Acre dans la simulation'
							)}
						</Switch>
					</FlexCentered>

					{values[DOTTEDNAME_ACRE] && (
						<>
							<Body>
								Les{' '}
								<StyledLink href="https://www.urssaf.fr/portail/home/independant/je-beneficie-dexonerations/accre/qui-peut-en-beneficier.html">
									conditions d'accès
								</StyledLink>{' '}
								à l’Acre sont plus restrictives pour les auto-entrepreneurs.
							</Body>
							<FlexCentered>
								<Switch
									id="activation-acre-ae"
									onChange={(value: boolean) =>
										set[DOTTEDNAME_AUTOENTREPRENEUR_ELIGIBLE_ACRE](value)
									}
									defaultSelected={
										values[DOTTEDNAME_AUTOENTREPRENEUR_ELIGIBLE_ACRE] as boolean
									}
									light
									/* Need this useless aria-label to silence a React-Aria warning */
									aria-label=""
								>
									{t(
										'modifier-options.éligible-acre',
										'Je suis éligible à l’Acre pour mon auto-entreprise'
									)}
								</Switch>
							</FlexCentered>
						</>
					)}
				</div>

				<Spacing md />
				<H3>Quelle imposition pour mon entreprise ?</H3>
				<Body>
					Vous pouvez{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années. En auto-entreprise (AE), c’est l’
					<Strong>impôt sur le revenu</Strong> qui est appliqué automatiquement
					; dans certaines situations, vous pouvez aussi opter pour le{' '}
					<Strong>
						<Link href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire">
							versement libératoire
						</Link>
					</Strong>
					.
				</Body>
				<H5 as="h4">Choisir mon option de simulation (hors AE)</H5>
				<Message type="secondary">
					<Grid
						container
						style={{
							flexWrap: 'nowrap',
							alignItems: 'baseline',
						}}
						spacing={3}
					>
						<Grid item>
							<InfoIcon
								style={{
									paddingTop: '0.15rem',
									display: 'inline-block',
								}}
								aria-label={t('Message à caractère informatif')}
							/>
						</Grid>
						<Grid item>
							<Body
								style={{
									fontSize: '0.875rem',
								}}
							>
								{t(
									'modifier-options.disclaimer',
									'À ce jour, ce comparateur ne prend pas en compte le calcul de l’impôt sur le revenu pour les SAS(U).'
								)}
							</Body>
						</Grid>
					</Grid>
				</Message>
				<RuleInput
					dottedName={DOTTEDNAME_ENTREPRISE_IMPOSITION}
					onChange={(value: PublicodesExpression | undefined) => {
						set[DOTTEDNAME_ENTREPRISE_IMPOSITION](value as undefined | IRouIS)
					}}
					key="imposition"
					aria-labelledby="questionHeader"
				/>
				<H5 as="h3">
					Choisir mon option de versement libératoire (pour AE){' '}
					<ExplicableRule
						dottedName={DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE}
					/>
				</H5>
				<FlexCentered>
					<Switch
						id="versement-liberatoire"
						onChange={set[DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE]}
						defaultSelected={
							values[
								DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE
							] as boolean
						}
						light
						/* Need this useless aria-label to silence a React-Aria warning */
						aria-label=""
					>
						{t(
							'modifier-options.versement-libératoire',
							'Activer le versement libératoire dans la simulation'
						)}
					</Switch>
				</FlexCentered>
			</>
		</Drawer>
	)
}

const FlexCentered = styled.div`
	display: flex;
	align-items: center;
`

const StyledArrowRightIcon = styled(ArrowRightIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`

export default ModifierOptions
