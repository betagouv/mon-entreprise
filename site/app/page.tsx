import i18next from '@/locales/i18n-server'

export default function Home() {
	return (
		<main>
			<h1>{i18next.t('app.titre', 'Mon entreprise — Next.js')}</h1>
			<p>
				{i18next.t(
					'app.description',
					'Migration en cours. Cette page confirme que Next.js est correctement configuré.'
				)}
			</p>
		</main>
	)
}
