import * as A from 'effect/Array'
import * as O from 'effect/Option'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Enfant, RaisonInéligibilité, useCMG } from '@/contextes/cmg'
import { Button, H2, Spacing } from '@/design-system'

import AeeH from '../components/enfants/AeeH'
import EnfantInput from '../components/enfants/EnfantInput'
import Navigation from '../components/Navigation'
import { Question } from '../components/styled-components'
import NonÉligible from './NonÉligible'

export default function Enfants() {
	const { t } = useTranslation()
	const { raisonsInéligibilité, enfants, set } = useCMG()
	const raisonsInéligibilitéValables: Array<RaisonInéligibilité> = [
		'CMG-perçu',
		'déclarations',
	]

	useEffect(() => {
		if (!enfants.length) {
			set.nouvelEnfant()
		}
	}, [])

	const onChange = (index: number) => (enfant: Enfant) => {
		set.enfants(A.replace(enfants, index, enfant))
	}

	const onDelete = (index: number) => () => {
		set.enfants(A.remove(enfants, index))
	}

	const isButtonDisabled = enfants.some((enfant) => O.isNone(enfant.prénom))

	if (
		raisonsInéligibilitéValables.some((raison) =>
			raisonsInéligibilité.includes(raison)
		)
	) {
		return <NonÉligible précédent="informations" />
	}

	return (
		<>
			<H2>{t('pages.assistants.cmg.enfants.h2', 'Enfants à charge')}</H2>

			<fieldset>
				<legend>
					<Question>
						{t(
							'pages.assistants.cmg.enfants.question',
							'Quels sont vos enfants à charge ?'
						)}
					</Question>
				</legend>

				<Spacing md />

				{enfants.map((enfant, index) => (
					<EnfantInput
						key={index}
						idSuffix={`${index}`}
						enfant={enfant}
						onChange={onChange(index)}
						onDelete={enfants.length > 1 ? onDelete(index) : undefined}
					/>
				))}
			</fieldset>

			<Button
				size="XXS"
				light
				onPress={set.nouvelEnfant}
				isDisabled={isButtonDisabled}
			>
				{t(
					'pages.assistants.cmg.enfants.add-button-label',
					'Ajouter un enfant'
				)}
			</Button>

			<AeeH />

			<Navigation précédent="informations" suivant="déclarations" />
		</>
	)
}
