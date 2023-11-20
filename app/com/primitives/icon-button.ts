export interface IconButtonProps {
	class?: string;
	size?: 'md';
	color?: 'primary' | 'muted';
	edge?: 'left' | 'right';
}

export const IconButton = (props: IconButtonProps = {}) => {
	const { class: className, size = 'md', color = 'primary', edge } = props;

	let cn = `grid shrink-0 place-items-center rounded-full text-muted-fg hover:bg-secondary disabled:pointer-events-none disabled:opacity-50`;

	if (size === 'md') {
		cn += ` h-8 w-8 text-lg`;
	}

	if (color === 'primary') {
		cn += ` text-primary`;
	} else if (color === 'muted') {
		cn += ` text-muted-fg`;
	}

	if (edge === 'left') {
		cn += ` -ml-2`;
	} else if (edge === 'right') {
		cn += ` -mr-2`;
	}

	if (className) {
		return `${cn} ${className}`;
	} else {
		return cn;
	}
};
