import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import StackedBarChart from 'Components/StackedBarChart'
import * as Animate from 'Components/ui/animate'
import { ThemeColorsContext } from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import { useInversionFail } from 'Components/utils/EngineContext'
import { useContext, useRef } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'

interface SalaryExplanationProps {
	disableAnimation: boolean
}

export default function SalaryExplanation({disableAnimation,}: SalaryExplanationProps) {
	const payslipRef = useRef<HTMLDivElement>(null)

	if (useInversionFail()) {
		return null
	}

	return (
		<Animate.fromTop>
			<RevenueRepartitionSection
				onSeePayslip={() =>
					payslipRef.current?.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				}
				disableAnimation={disableAnimation}
			/>

			<DistributionSection disableAnimation={disableAnimation}/>
			<div ref={payslipRef}>
				<PaySlipSection />
			</div>
			<br />
			<p className="ui__ notice">
				<Trans i18nKey="payslip.notice">
					Le simulateur vous aide à comprendre votre bulletin de paie, sans lui
					être opposable. Pour plus d&apos;informations, rendez vous sur&nbsp;
					<a href="https://www.service-public.fr/particuliers/vosdroits/F559">
						service-public.fr
					</a>
					.
				</Trans>
			</p>
			<p className="ui__ notice">
				<Trans i18nKey="payslip.disclaimer">
					Il ne prend pour l'instant pas en compte les accords et conventions
					collectives, ni la myriade d'aides aux entreprises. Trouvez votre
					convention collective{' '}
					<a href="https://socialgouv.github.io/conventions-collectives">ici</a>
					, et explorez les aides sur&nbsp;
					<a href="https://www.aides-entreprises.fr">aides-entreprises.fr</a>.
				</Trans>
			</p>
		</Animate.fromTop>
	)
}

function RevenueRepartitionSection(props: { onSeePayslip: () => void; disableAnimation:boolean }) {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<div
				css={`
					display: flex;
					align-items: baseline;
				`}
			>
				<h2
					css={`
						flex: 1;
					`}
				>
					<Trans i18nKey="payslip.repartition">
						Répartition du total chargé
					</Trans>
				</h2>
				<button
					className="ui__ small simple button print-display-none"
					onClick={props.onSeePayslip}
				>
					{emoji('📊')} <Trans>Voir la fiche de paie</Trans>
				</button>
			</div>
			<StackedBarChart
				data={[
					{
						dottedName: 'contrat salarié . rémunération . net après impôt',
						title: t('Revenu disponible'),
						color: palettes[0][0],
					},
					{
						dottedName: 'impôt',
						title: t('impôt'),
						color: palettes[1][0],
					},
					{
						dottedName: 'contrat salarié . cotisations',
						color: palettes[1][1],
					},
				]}
				disableAnimation={props.disableAnimation}
			/>
		</section>
	)
}

function PaySlipSection() {
	return (
		<section className="print-break-avoid">
			<h2>
				<Trans>Fiche de paie</Trans>
			</h2>
			<PaySlip />
		</section>
	)
}

export const DistributionSection = ({
	disableAnimation,
	children = <Distribution disableAnimation={disableAnimation} />,
}: {
	disableAnimation:boolean
	children?: React.ReactNode
}) => (
	<section className="print-break-avoid">
		<h2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</h2>
		{children}
		<p className="ui__ notice">
			<Trans>
				<Emoji emoji="ℹ" /> Pour en savoir plus, rendez-vous sur le site{' '}
				<a href="https://www.aquoiserventlescotisations.urssaf.fr/">
					aquoiserventlescotisations.urssaf.fr
				</a>
			</Trans>
		</p>
	</section>

)
