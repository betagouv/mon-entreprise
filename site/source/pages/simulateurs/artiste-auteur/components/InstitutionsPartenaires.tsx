import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Grid, H3, Message, Spacing } from '@/design-system'

import CotisationsIrcec from './CotisationsIrcec'
import CotisationsUrssaf from './CotisationsUrssaf'

export default function InstitutionsPartenaires() {
	const { t } = useTranslation()

	return (
		<section>
			<Spacing md />
			<Grid container>
				<Grid item lg={12}>
					<Message border={false} role="list">
						<H3>
							{t(
								'pages.simulateurs.artiste-auteur.explications.cotisations.titre',
								'Vos cotisations'
							)}
						</H3>
						<CotisationsUrssaf role="listitem" />
						<Condition expression="artiste-auteur . cotisations . IRCEC > 0">
							<CotisationsIrcec role="listitem" />
						</Condition>
					</Message>
				</Grid>
			</Grid>
		</section>
	)
}
