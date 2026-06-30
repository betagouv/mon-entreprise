import { useTranslation } from 'react-i18next'

import { Button, LinkIcon, PopoverWithTrigger } from '@/design-system'
import { useTracking } from '@/hooks/useTracking'
import { useUrl } from '@/hooks/useUrl'

import { ShareSimulationPopup } from '../../ShareSimulationBanner/ShareSimulationPopup'

export const BoutonPartage = () => {
	const { t } = useTranslation()
	const { trackClick } = useTracking()
	const url = useUrl()
	const shareAPIAvailable = !!window?.navigator?.share
	const startSharing = async () => {
		if (shareAPIAvailable) {
			try {
				await window.navigator.share({
					title: document.title,
					text: t(
						'shareSimulation.navigatorShare',
						'Ma simulation Mon Entreprise'
					),
					url,
				})
			} catch (e) {
				if (
					e instanceof Error &&
					(e.toString().includes('AbortError') || /permission/i.test(e.message))
				) {
					return
				}
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
	}

	return (
		<PopoverWithTrigger
			title={t(
				'components.simulateur.partage.modale.titre',
				'Votre lien de partage'
			)}
			trigger={(buttonProps) => (
				<Button
					size="XXS"
					light
					onPress={(e) => {
						trackClick({
							action: 'démarré',
							feature: 'feature:partage',
						})
						startSharing().catch(
							// eslint-disable-next-line no-console
							(err) => console.error(err)
						)
						buttonProps?.onPress?.(e)
					}}
					aria-haspopup="dialog"
				>
					<LinkIcon />
					{t(
						'components.simulateur.partage.bouton',
						'Générer un lien de partage'
					)}
				</Button>
			)}
			small
		>
			<ShareSimulationPopup url={url} />
		</PopoverWithTrigger>
	)
}
