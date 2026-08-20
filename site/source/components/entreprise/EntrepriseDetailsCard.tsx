import { ComponentType, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Grid, Message, Spacing } from '@/design-system'

import EntrepriseDetails from './EntrepriseDetails'

const SeeAnswersButton = lazy(() => import('../conversation/SeeAnswersButton'))

export function EntrepriseDetailsCard({
	showSituation = false,
	headingTag = 'h3',
}: {
	showSituation?: boolean
	headingTag?: string | ComponentType | undefined
}) {
	const { t } = useTranslation()

	return (
		<StyledCompanyContainer>
			<Grid
				container
				style={{
					alignItems: 'flex-end',
					justifyContent: 'center',
				}}
				spacing={3}
			>
				<Grid item xs={12} lg>
					<EntrepriseDetails headingTag={headingTag} />
				</Grid>
				{showSituation && (
					<Grid item xs={12} sm="auto">
						<Suspense fallback={null}>
							<SeeAnswersButton label={t('Afficher le détail')} />
						</Suspense>
						<Spacing sm />
					</Grid>
				)}
			</Grid>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
