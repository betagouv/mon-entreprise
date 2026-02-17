import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { Body, Emoji, Grid, Intro, Message } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { SimulateurCard } from './SimulateurCard'

export function CurrentSimulatorCard({
	fromGérer = false,
}: {
	fromGérer?: boolean
}) {
	const dirigeantSimulateur = infereSimulateurRevenuFromSituation(useEngine())
	const simulateurs = useSimulatorsData()

	return dirigeantSimulateur ? (
		<SimulateurCard
			fromGérer={fromGérer}
			{...simulateurs[dirigeantSimulateur]}
		/>
	) : (
		<Grid
			item
			md={12}
			lg={8}
			style={{
				marginBottom: '-1rem',
			}}
		>
			<Message border={false} type="info">
				<Trans i18nKey="pages.assistants.pour-mon-entreprise.avertissement-entreprise-non-traitée">
					<Intro>
						Il n'existe pas encore de simulateur de revenu pour votre type
						d'entreprise sur ce site.
					</Intro>
					<Body>
						Si vous souhaitez que nous développions un nouveau simulateur,
						laissez-nous message en cliquant sur le bouton "<Emoji emoji="👋" />
						" à droite de votre écran.
					</Body>
				</Trans>
			</Message>
		</Grid>
	)
}

function infereSimulateurRevenuFromSituation(
	engine: Engine<DottedName>
): keyof SimulatorData | null {
	if (
		engine.evaluate('entreprise . catégorie juridique . EI . auto-entrepreneur')
			.nodeValue
	) {
		return 'auto-entrepreneur'
	}

	if (
		engine.evaluate('entreprise . catégorie juridique . SARL . EURL').nodeValue
	) {
		return 'eurl'
	}
	if (
		engine.evaluate('entreprise . catégorie juridique . SAS').nodeValue ||
		engine.evaluate('entreprise . catégorie juridique . SAS . SASU')
			.nodeValue ||
		engine.evaluate('entreprise . catégorie juridique . SAS . SAS').nodeValue
	) {
		return 'sasu'
	}
	if (engine.evaluate('entreprise . catégorie juridique . EI').nodeValue) {
		return 'entreprise-individuelle'
	}
	if (engine.evaluate('entreprise . catégorie juridique . EI').nodeValue) {
		const métierProfessionLibéral = engine.evaluate(
			'dirigeant . indépendant . PL . métier'
		).nodeValue
		switch (métierProfessionLibéral) {
			case 'avocat':
				return 'avocat'
			case 'expert-comptable':
				return 'expert-comptable'
			case 'santé . médecin':
				return 'médecin'
			case 'santé . chirurgien-dentiste':
				return 'chirurgien-dentiste'
			case 'santé . sage-femme':
				return 'sage-femme'
			case 'santé . auxiliaire médical':
				return 'auxiliaire-médical'
			case 'santé . pharmacien':
				return 'pharmacien'
		}
		if (engine.evaluate('dirigeant . indépendant . PL').nodeValue) {
			return 'profession-libérale'
		}

		return 'entreprise-individuelle'
	}
	const régimeSocial = engine.evaluate('dirigeant . régime social').nodeValue

	if (régimeSocial === 'indépendant') {
		return 'indépendant'
	}

	// TODO : assimilé-salarié
	// if (
	// 	régimeSocial === 'assimilé-salarié'
	// ) {
	// 	return 'assimilé-salarié'
	// }
	return null
}
