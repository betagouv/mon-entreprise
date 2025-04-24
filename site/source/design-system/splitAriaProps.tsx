type OnlyAriaType<T> = {
	[K in keyof T as K extends `aria-${string}` ? K : never]: T[K]
}

/**
 * Split props into aria and rest
 * @param props
 */
export const splitAriaProps = <T extends object>(props: T) =>
	Object.entries(props).reduce(
		(acc, [key, prop]) => {
			if (key.startsWith('aria-')) {
				acc.aria[key] = prop
			} else {
				acc.rest[key] = prop
			}

			return acc
		},
		{ aria: {}, rest: {} } as {
			aria: Record<string, unknown>
			rest: Record<string, unknown>
		},
	) as { aria: OnlyAriaType<T>; rest: Omit<T, keyof OnlyAriaType<T>> }
