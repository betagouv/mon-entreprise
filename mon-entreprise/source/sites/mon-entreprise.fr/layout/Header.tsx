import { SitePathsContext } from 'Components/utils/SitePathsContext'
import logoEnSvg from 'Images/logo-mycompany.svg'
import logoSvg from 'Images/logo.svg'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import urssafWhite from 'Images/urssaf-white.png'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import NewsBanner from './NewsBanner'

export default function Header() {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n
	return (
		<>
			<div
				className="ui__ container"
				style={{
					display: 'flex',
					alignItems: 'center'
				}}
			>
				<Link style={{ height: '4rem' }} to={sitePaths.index}>
					<img
						alt="logo mon-entreprise.fr"
						style={{
							padding: '0.5rem 0',
							height: '100%'
						}}
						src={language === 'fr' ? logoSvg : logoEnSvg}
					/>
				</Link>
				<div style={{ flex: 1 }} />
				<a
					href="https://beta.gouv.fr"
					target="_blank"
					style={{
						height: '4rem',
						padding: '1rem'
					}}
				>
					<img
						alt="logo marianne"
						style={{ height: '100%' }}
						src={marianneSvg}
					/>
				</a>
				<a
					href="https://www.urssaf.fr"
					target="_blank"
					style={{
						height: '4rem',
						padding: '1rem'
					}}
					className="landing-header__institutional-logo"
				>
					<picture alt="logo urssaf">
						<source
							srcSet={urssafSvg}
							media="(prefers-color-scheme: light) or (prefers-color-scheme: no-preference)"
						/>
						<source srcSet={urssafWhite} media="(prefers-color-scheme: dark)" />
					</picture>
				</a>
			</div>
			<NewsBanner />
		</>
	)
}
