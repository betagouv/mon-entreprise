import Distribution from '@/components/Distribution'
import PaySlip from '@/components/PaySlip'
import StackedBarChart from '@/components/StackedBarChart'
import { FromTop } from '@/components/ui/animate'
import Emoji from '@/components/utils/Emoji'
import { useInversionFail } from '@/components/utils/EngineContext'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'

import { useContext, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

export default function SalaryExplanation() {
	const payslipRef = useRef<HTMLDivElement>(null)

	const { t } = useTranslation()

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

			<DistributionSection />

			<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
				<div ref={payslipRef} />
				<Grid
					container
					css={`
						justify-content: center;
					`}
				>
					<Grid
						item
						xl={9}
						lg={10}
						css={`
							overflow: auto;
						`}
					>
						<H2>
							<Trans>Fiche de paie</Trans>
						</H2>
						<PaySlip />
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
	const { colors } = useContext(ThemeContext)

	return (
		<section>
			<div
				css={`
					display: flex;
					align-items: baseline;
				`}
			>
				<H2
					css={`
						flex: 1;
					`}
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
						title: t('impôt'),
						color: colors.bases.secondary[500],
					},
					{
						dottedName: 'salarié . cotisations',
						color: colors.bases.secondary[300],
					},
				]}
			/>
		</section>
	)
}

export const DistributionSection = ({
	children = <Distribution />,
}: {
	children?: React.ReactNode
}) => (
	<section className="print-no-break-inside">
		<H2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</H2>
		{children}
		<SmallBody>
			<Trans>
				Pour en savoir plus, rendez-vous sur le site{' '}
				<Link
					href="https://www.aquoiserventlescotisations.urssaf.fr/"
					aria-label="aquoiserventlescotisations.urssaf.fr, nouvelle fenêtre"
				>
					aquoiserventlescotisations.urssaf.fr
				</Link>
			</Trans>
		</SmallBody>
	</section>
)
