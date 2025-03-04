export const relativeDottedName = (
	rootDottedName: string,
	childDottedName: string
) => childDottedName.replace(rootDottedName + ' . ', '')
