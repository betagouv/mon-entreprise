import { DottedName } from 'modele-social'
import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisationsSection'
import StackedBarChart from '@/components/StackedBarChart'
import { FromTop } from '@/components/ui/animate'
import { useInversionFail } from '@/components/utils/EngineContext'
import { Emoji } from '@/design-system/emoji'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

import FicheDePaie from '../FicheDePaie/FicheDePaie'

export default function SalaryExplanation() {
	const payslipRef = useRef<HTMLDivElement>(null)

	if (useInversionFail()) {
		return null
	}

	return (
		<FromTop>
			<RevenueRepartitionSection
				onSeePayslip={() =>
					payslipRef.current?.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				}
			/>
			<Spacing lg />

			<ÀQuoiServentMesCotisationsSection regroupement={CotisationsSection} />

			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				<div ref={payslipRef} />
				<Grid
					container
					style={{
						justifyContent: 'center',
					}}
				>
					<Grid
						item
						xl={9}
						lg={10}
						style={{
							overflow: 'auto',
						}}
					>
						<H2>
							<Trans>Fiche de paie</Trans>
						</H2>
						<FicheDePaie />
						<SmallBody>
							<Trans i18nKey="payslip.notice">
								Le simulateur vous aide à comprendre votre bulletin de paie,
								sans lui être opposable. Pour plus d&apos;informations, rendez
								vous sur&nbsp;
								<Link
									href="https://www.service-public.fr/particuliers/vosdroits/F559"
									aria-label="service-public.fr, nouvelle fenêtre"
								>
									service-public.fr
								</Link>
								.
							</Trans>
						</SmallBody>
						<SmallBody>
							<Trans i18nKey="payslip.disclaimer">
								Il ne prend pour l'instant pas en compte les accords et
								conventions collectives, ni la myriade d'aides aux entreprises.
								Trouvez votre convention collective{' '}
								<Link
									href="https://code.travail.gouv.fr/outils/convention-collective#entreprise"
									aria-label="ici, trouvez votre convention collective sur code.travail.gouv.fr, nouvelle fenêtre"
								>
									ici
								</Link>
								, et explorez les aides sur&nbsp;
								<Link
									href="https://www.aides-entreprises.fr"
									aria-label="aides-entreprises.fr, nouvelle fenêtre"
								>
									aides-entreprises.fr
								</Link>
								.
							</Trans>
						</SmallBody>
					</Grid>
				</Grid>
			</Container>
		</FromTop>
	)
}

function RevenueRepartitionSection(props: { onSeePayslip: () => void }) {
	const { t } = useTranslation()
	const { colors } = useTheme()
	const { currentSimulatorData } = useCurrentSimulatorData()

	return (
		<section>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
				}}
			>
				<H2
					style={{
						flex: '1',
					}}
				>
					<Trans i18nKey="payslip.repartition">
						Répartition du total chargé
					</Trans>
				</H2>
				<Link onPress={props.onSeePayslip}>
					<Emoji emoji="📊" /> <Trans>Voir la fiche de paie</Trans>
				</Link>
			</div>
			<StackedBarChart
				data={[
					{
						dottedName: 'salarié . rémunération . net . payé après impôt',
						title: t('Revenu disponible'),
						color: colors.bases.primary[600],
					},
					{
						dottedName: 'impôt . montant',
						title: t('Impôt'),
						color: colors.bases.secondary[500],
					},
					{
						title: t('Cotisations'),
						dottedName:
							currentSimulatorData?.pathId === 'simulateurs.sasu'
								? 'dirigeant . assimilé salarié . cotisations'
								: 'salarié . cotisations',
						color: colors.extended.grey[700],
					},
				]}
			/>
		</section>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . maladie': [
		'salarié . cotisations . maladie',
		'salarié . cotisations . prévoyances',
		'salarié . cotisations . prévoyances . santé',
		'salarié . cotisations . ATMP',
	],
	'protection sociale . retraite': [
		'salarié . cotisations . vieillesse',
		'salarié . cotisations . retraite complémentaire',
		'salarié . cotisations . CEG',
		'salarié . cotisations . CET',
		// 'salarié . cotisations . retraite supplémentaire',
	],
	'protection sociale . famille': [
		'salarié . cotisations . allocations familiales',
	],
	'protection sociale . assurance chômage': [
		'salarié . cotisations . AGS',
		'salarié . cotisations . chômage',
	],
	'protection sociale . formation': [
		"salarié . cotisations . taxe d'apprentissage",
		'salarié . cotisations . formation professionnelle',
		'salarié . cotisations . CPF CDD',
	],
	'protection sociale . transport': [
		'salarié . cotisations . versement mobilité',
	],
	'protection sociale . autres': [
		'salarié . cotisations . CSG-CRDS',
		'salarié . cotisations . APEC',
		'salarié . cotisations . FNAL',
		'salarié . cotisations . CSA',
		'salarié . cotisations . forfait social',
		'salarié . cotisations . PEEC',
		'salarié . cotisations . contribution au dialogue social',
	],
}
