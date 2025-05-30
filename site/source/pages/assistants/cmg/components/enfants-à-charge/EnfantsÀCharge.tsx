import * as A from 'effect/Array'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { Enfant, useCMG } from '@/contextes/cmg'
import { Button, H2 } from '@/design-system'

import EnfantInput from './EnfantInput'
import QuestionAeeH from './QuestionAeeH'

export default function EnfantsÀCharge() {
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
		</>
	)
}
