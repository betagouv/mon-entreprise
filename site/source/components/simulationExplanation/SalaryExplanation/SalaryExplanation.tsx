import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisations/ÀQuoiServentMesCotisationsSection'
import { FromTop } from '@/components/ui/animate'
import {
	Body,
	Container,
	Grid,
	H2,
	Link,
	Message,
	Spacing,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useInversionFail } from '@/hooks/useInversionFail'

import FicheDePaie from '../../FicheDePaie/FicheDePaie'
import { BarType } from '../StackedRulesChart/InnerStackedBarChart'
import RevenueRepartitionSection from './RevenueRepartitionSection'

type Props = {
	cotisationsSection: Partial<Record<DottedName, Array<string>>>
	répartitionRevenuData: Record<
		BarType,
		{ dottedName: DottedName; title: string }
	>
	avecFicheDePaie?: boolean
}

export default function SalaryExplanation({
	cotisationsSection,
	répartitionRevenuData,
	avecFicheDePaie = false,
}: Props) {
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
				data={répartitionRevenuData}
			/>
			<Spacing lg />

			<ÀQuoiServentMesCotisationsSection regroupement={cotisationsSection} />

			{avecFicheDePaie && (
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

							<Message type="info" icon>
								<Body>
									<Trans i18nKey="payslip.disclaimer">
										Cette fiche de paie est issue de la simulation que vous avez
										faite. Elle vous aide à comprendre votre bulletin de paie :
										vous pouvez cliquer sur les liens pour comprendre le calcul
										de chaque montant. Cette fiche de paie ne peut pas de
										substituer à une fiche de paie réelle. Pour plus
										d'informations, rendez-vous sur{' '}
										<Link
											href="https://www.service-public.fr/particuliers/vosdroits/F559"
											aria-label={t(
												'aria-label.service-public',
												'service-public.fr, nouvelle fenêtre'
											)}
										>
											service-public.fr
										</Link>
										.
									</Trans>
								</Body>
							</Message>

							<FicheDePaie />
						</Grid>
					</Grid>
				</Container>
			)}
		</FromTop>
	)
}
