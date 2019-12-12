import { SitePathsContext } from 'Components/utils/withSitePaths'
import logoEnSvg from 'Images/logo-mycompany.svg'
import logoSvg from 'Images/logo.svg'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

export default function Header() {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n
	return (
		<div
			className="ui__ container"
			style={{
				display: 'flex',
				alignItems: 'center'
			}}
		>
			<a style={{ height: '4rem' }} href={'https://onestla.tech'}>
				<img
					alt="logo mon-entreprise.fr"
					style={{
						padding: '0.5rem 0',
						height: '100%'
					}}
					src={language === 'fr' ? logoSvg : logoEnSvg}
				/>
			</a>
			<div style={{ flex: 1 }} />
		</div>
	)
}
