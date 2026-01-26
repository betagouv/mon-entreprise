import { Trans } from 'react-i18next'

import { DarkLi, Strong, Ul } from '@/design-system'

type Props = {
	Professionnelles?: () => JSX.Element
}

export const Avertissement = ({ Professionnelles }: Props) => {
	return (
		<Ul>
			<DarkLi>
				{Professionnelles ? (
					<Trans i18nKey="pages.simulateurs.profession-libérale.warning.général.spécifique">
						Ce simulateur est à destination des <Professionnelles /> en{' '}
						<Strong>BNC</Strong>. Il ne prend pas en compte les sociétés
						d’exercice libéral.
					</Trans>
				) : (
					<Trans i18nKey="pages.simulateurs.profession-libérale.warning.général.générique">
						Ce simulateur est à destination des professions libérales en{' '}
						<Strong>BNC</Strong>. Il ne prend pas en compte les sociétés
						d’exercice libéral.
					</Trans>
				)}
			</DarkLi>
			<DarkLi>
				{Professionnelles ? (
					<Trans i18nKey="pages.simulateurs.profession-libérale.warning.cotisations-ordinales.spécifique">
						Le simulateur ne calcule pas le montant des{' '}
						<Strong>cotisations à l’ordre</Strong>. Elles doivent être ajoutées
						manuellement dans la case «&nbsp;Charges&nbsp;».
					</Trans>
				) : (
					<Trans i18nKey="pages.simulateurs.profession-libérale.warning.cotisations-ordinales.générique">
						Pour les professions réglementées, le simulateur ne calcule pas le
						montant des <Strong>cotisations à l’ordre</Strong>. Elles doivent
						être ajoutées manuellement dans la case «&nbsp;Charges&nbsp;».
					</Trans>
				)}
			</DarkLi>
		</Ul>
	)
}
