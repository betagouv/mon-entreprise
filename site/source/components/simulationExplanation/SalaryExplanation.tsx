import { Grid } from '@mui/material'
import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import StackedBarChart from 'Components/StackedBarChart'
import { FromTop } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useInversionFail } from 'Components/utils/EngineContext'
import { Container, Spacing } from 'DesignSystem/layout'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { useContext, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

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

			<DistributionSection />

			<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
				<div ref={payslipRef} />
				<Grid container justifyContent="center">
					<Grid item xl={9} lg={10}>
						<H2>
							<Trans>Fiche de paie</Trans>
						</H2>
						<PaySlip />
						<SmallBody>
							<Trans i18nKey="payslip.notice">
								Le simulateur vous aide à comprendre votre bulletin de paie,
								sans lui être opposable. Pour plus d&apos;informations, rendez
								vous sur&nbsp;
								<Link href="https://www.service-public.fr/particuliers/vosdroits/F559">
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
								<Link href="https://code.travail.gouv.fr/outils/convention-collective#entreprise">
									ici
								</Link>
								, et explorez les aides sur&nbsp;
								<Link href="https://www.aides-entreprises.fr">
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
						dottedName: 'contrat salarié . rémunération . net après impôt',
						title: t('Revenu disponible'),
						color: colors.bases.primary[600],
					},
					{
						dottedName: 'impôt . montant',
						title: t('impôt'),
						color: colors.bases.secondary[500],
					},
					{
						dottedName: 'contrat salarié . cotisations',
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
	<section>
		<H2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</H2>
		{children}
		<SmallBody>
			<Trans>
				Pour en savoir plus, rendez-vous sur le site{' '}
				<Link href="https://www.aquoiserventlescotisations.urssaf.fr/">
					aquoiserventlescotisations.urssaf.fr
				</Link>
			</Trans>
		</SmallBody>
	</section>
)
