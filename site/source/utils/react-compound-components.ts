import React, { ComponentType, ReactNode } from 'react'

/**
 * Utilitaire pour extraire les sous-composants spécifiques des children
 * dans le pattern Compound Components.
 *
 * @param children - Les children du composant parent
 * @param componentType - Le type de composant à rechercher
 * @returns Le premier enfant correspondant au type, ou undefined
 */
export const findChildByType = <
	T extends ComponentType<{ children: ReactNode }>,
>(
	children: ReactNode,
	componentType: T
): React.ReactElement | undefined => {
	return React.Children.toArray(children).find(
		(child): child is React.ReactElement =>
			React.isValidElement(child) && child.type === componentType
	)
}

/**
 * Utilitaire pour extraire tous les sous-composants spécifiques des children
 * dans le pattern Compound Components.
 *
 * @param children - Les children du composant parent
 * @param componentType - Le type de composant à rechercher
 * @returns Tous les enfants correspondant au type
 */
export const findChildrenByType = <
	T extends ComponentType<{ children: ReactNode }>,
>(
	children: ReactNode,
	componentType: T
): React.ReactElement[] => {
	return React.Children.toArray(children).filter(
		(child): child is React.ReactElement =>
			React.isValidElement(child) && child.type === componentType
	)
}
