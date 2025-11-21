import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import { Body, Grid, H3, Message, Spacing } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import * as logosSrc from '@/utils/logos'

import CotisationsUrssaf from './CotisationsUrssaf'

export default function InstitutionsPartenaires() {
	const { t } = useTranslation()
	const unit = useSelector(targetUnitSelector)
	const { description: descriptionIRCEC } = useEngine().getRule(
		'artiste-auteur . cotisations . IRCEC'
	).rawNode

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
						<CotisationsUrssaf
							rule="artiste-auteur . cotisations"
							extraNotice={
								<Condition expression="artiste-auteur . revenus . traitements et salaires > 0">
									{t(
										'pages.simulateurs.artiste-auteur.explications.cotisations.précompte',
										'Pour vos revenus en traitement et salaires, ces cotisations sont « précomptées », c’est-à-dire payées à la source par le diffuseur.'
									)}
								</Condition>
							}
							role="listitem"
						/>
						<Condition expression="artiste-auteur . cotisations . IRCEC > 0">
							<InstitutionLine role="listitem">
								<InstitutionLogo
									href="http://www.ircec.fr/"
									target="_blank"
									rel="noreferrer"
									aria-label="Logo IRCEC, accéder à ircec.fr, nouvelle fenêtre"
								>
									<img src={logosSrc.IRCEC} alt="Logo IRCEC" />
								</InstitutionLogo>
								<Body>{descriptionIRCEC}</Body>
								<Value
									displayedUnit="€"
									unit={unit}
									expression="artiste-auteur . cotisations . IRCEC"
								/>
							</InstitutionLine>
						</Condition>
					</Message>
				</Grid>
			</Grid>
		</section>
	)
}
