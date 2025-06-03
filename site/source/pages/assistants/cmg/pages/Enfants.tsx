import * as A from 'effect/Array'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { Enfant, useCMG } from '@/contextes/cmg'
import { Button, H2 } from '@/design-system'

import EnfantInput from '../components/enfants-à-charge/EnfantInput'
import QuestionAeeH from '../components/enfants-à-charge/QuestionAeeH'
import Navigation from '../components/Navigation'

export default function Enfants() {
	const { t } = useTranslation()
	const { enfants, set } = useCMG()

	const onChange = (index: number) => (enfant: Enfant) => {
		set.enfants(A.replace(enfants, index, enfant))
	}

	const onDelete = (index: number) => () => {
		set.enfants(A.remove(enfants, index))
	}

	const isButtonDisabled = enfants.some((enfant) => O.isNone(enfant.prénom))

	return (
		<>
			<H2>{t('pages.assistants.cmg.enfants.h2', 'Enfants à charge')}</H2>

			{enfants.map((enfant, index) => (
				<EnfantInput
					key={index}
					idSuffix={`${index}`}
					enfant={enfant}
					onChange={onChange(index)}
					onDelete={onDelete(index)}
				/>
			))}

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

			<QuestionAeeH />

			<Navigation précédent="informations" suivant="GED" />
		</>
	)
}
