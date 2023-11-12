export interface ButtonProps {
	class?: string;
	size?: 'xs' | 'sm' | null;
	variant?: 'primary' | 'danger' | 'secondary' | 'outline' | 'ghost' | null;
}

const button = (props: ButtonProps = {}) => {
	const { class: className, size = 'sm', variant = 'secondary' } = props;

	let cn = `inline-flex items-center rounded-md text-sm font-medium outline-2 -outline-offset-1 outline-primary focus-visible:outline disabled:pointer-events-none disabled:opacity-50`;

	if (size === 'xs') {
		cn += ` h-8 px-4 leading-none`;
	} else if (size === 'sm') {
		cn += ` h-9 px-4`;
	}

	if (variant === 'primary') {
		cn += ` bg-primary text-primary-fg hover:bg-primary/90 outline-offset-2`;
	} else if (variant === 'danger') {
		cn += ` bg-red-600 text-primary hover:bg-red-700 outline-offset-2`;
	} else if (variant === 'secondary') {
		cn += ` bg-secondary text-secondary-fg hover:bg-secondary/80`;
	} else if (variant === 'outline') {
		cn += ` border border-input hover:bg-hinted hover:text-hinted-fg`;
	} else if (variant === 'ghost') {
		cn += ` hover:bg-hinted hover:text-hinted-fg`;
	}

	if (className) {
		return `${cn} ${className}`;
	} else {
		return cn;
	}
};

export default button;
