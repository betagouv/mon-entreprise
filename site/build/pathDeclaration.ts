type PathDeclaration = { englishPath: string }

const isPathDeclaration = (
	declaration: unknown
): declaration is PathDeclaration =>
	typeof declaration === 'object' &&
	declaration !== null &&
	'englishPath' in declaration &&
	typeof declaration.englishPath === 'string' &&
	declaration.englishPath.length > 0

export const translatedPathFrom = (
	declaration: unknown,
	file: string
): string => {
	if (!isPathDeclaration(declaration)) {
		throw new Error(`${file} must export a non-empty englishPath string`)
	}

	return declaration.englishPath
}
