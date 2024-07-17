import { DottedName } from 'modele-social'
import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { SmallBody } from '@/design-system/typography/paragraphs'

export function DroitsRetraite() {
	const { t } = useTranslation()
	const exonérationRetraiteActive = {
		'une de ces conditions': [
			'dirigeant . indépendant . cotisations et contributions . exonérations . ACRE',
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . PL . CIPAV . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<Trans i18nKey="pages.simulateurs.indépendant.retraite-droits-acquis">
			<H3 as="h2">Retraite : droits acquis sur l'année</H3>
			<WhenApplicable dottedName="dirigeant . auto-entrepreneur . DROM">
				<Message type="info" border>
					Les exonérations DROM n'ont aucune incidence sur la détermination des
					droits à la retraite de base et complémentaire des auto-entrepreneurs
				</Message>
			</WhenApplicable>
			<WhenApplicable dottedName="dirigeant . exonérations . ACRE">
				<Message type="info" border>
					L’exonération ACRE n'a aucune incidence sur la détermination des
					droits à la retraite de base et complémentaire des auto-entrepreneurs
				</Message>
			</WhenApplicable>

			<Condition expression={exonérationRetraiteActive}>
				<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
					Le calcul des droits ouverts à la retraite n'est pas encore implémenté
					pour les cas incluants des d'exonérations de cotisations (ACRE,
					pension invalidité, etc).
				</Message>
			</Condition>
			<Condition expression={{ '=': [exonérationRetraiteActive, 'non'] }}>
				<Ul>
					<Li>
						Retraite de base :{' '}
						<Value
							expression="protection sociale . retraite . trimestres"
							displayedUnit={t('trimestres acquis')}
						/>
					</Li>
					<WhenApplicable dottedName="protection sociale . retraite . base . CNAVPL">
						<Li>
							Points de retraite de base acquis (CNAVPL) :{' '}
							<Value
								linkToRule
								expression="protection sociale . retraite . base . CNAVPL"
								displayedUnit={t('points')}
							/>
						</Li>
					</WhenApplicable>
					<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
						<Li>
							Revenu cotisé pris en compte pour la retraite de base :{' '}
							<Value
								linkToRule
								unit="€/an"
								expression="protection sociale . retraite . base"
							/>
						</Li>
					</WhenNotApplicable>
					<Li>
						Points de retraite complémentaire acquis :{' '}
						<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
							<Value
								expression="protection sociale . retraite . complémentaire . RCI . points acquis"
								displayedUnit=""
							/>{' '}
							points acquis
						</WhenApplicable>
						<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
							<Strong>non connue</Strong>
							<WhenApplicable dottedName="dirigeant . indépendant . PL">
								<SmallBody>
									Ce simulateur ne gère pas les droits acquis de retraite
									complémentaire pour les professions libérales
								</SmallBody>
							</WhenApplicable>
						</WhenNotApplicable>
					</Li>
				</Ul>
			</Condition>
		</Trans>
	)
}
