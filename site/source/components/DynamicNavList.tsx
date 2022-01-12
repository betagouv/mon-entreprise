import { Ul, Li } from 'DesignSystem/typography/list'
import { Link } from 'DesignSystem/typography/link'
import { useScrollToHash } from 'Hooks/useScrollToHash'
import React, { useEffect, useState } from 'react'

export type DynamicNavListProps = {
	contentElement: React.RefObject<HTMLElement>
}

function convertTextToSeoId(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replaceAll(' ', '-')
}


export const DynamicNavList = ({ contentElement }: DynamicNavListProps) => {
	const [titles, setTitles] = useState<HTMLHeadingElement[] | null>(null)
	useScrollToHash()
	useEffect(() => {
		setTitles(
			contentElement.current && [
				...contentElement.current.getElementsByTagName('h2'),
			]
		)
	}, [contentElement.current])

  titles?.forEach(
		(value) => {
      if(value.textContent) {
        value.id = convertTextToSeoId(value.textContent)
      } else {
				throw new Error('Le title d\'un element ne peut pas être = à vide')
      }
    }
	)
	

	return (
		<Ul>
			{titles &&
				titles.map((value) => {
					return (
						<Li key={value.id}>
							<Link to={{ hash: value.id }}>{value.textContent}</Link>
						</Li>
					)
				})}
		</Ul>
	)
}
