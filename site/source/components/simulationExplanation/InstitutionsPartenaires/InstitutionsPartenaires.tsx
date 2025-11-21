import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { FromBottom } from '@/components/ui/animate'
import { Grid, H2, Message } from '@/design-system'

type Props = {
	role?: string
	children: ReactNode
}

export default function InstitutionsPartenaires({ role, children }: Props) {
	const { t } = useTranslation()

	return (
		<section role={role}>
			<FromBottom>
				<H2>
					{t(
						'simulateurs.explanation.institutions.titre',
						'Vos institutions partenaires'
					)}
				</H2>
				<Grid container>
					<Grid item lg={12} xl={10}>
						<Message border={false} role="list">
							{children}
						</Message>
					</Grid>
				</Grid>
			</FromBottom>
		</section>
	)
}
