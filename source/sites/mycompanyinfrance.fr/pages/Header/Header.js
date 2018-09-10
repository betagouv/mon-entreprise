import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import './Header.css'

const Header = () => (
	<header className="header">
		<img alt="logo marianne" src={marianneSvg} />
		<img alt="logo urssaf" src={urssafSvg} />
	</header>
)

export default Header
