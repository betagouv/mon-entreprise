import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Grid, Message, Spacing } from '@/design-system'

import SeeAnswersButton from '../conversation/SeeAnswersButton'
import EntrepriseDetails from './EntrepriseDetails'

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
						<SeeAnswersButton label={t('Afficher le détail')} />
						<Spacing sm />
					</Grid>
				)}
			</Grid>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
