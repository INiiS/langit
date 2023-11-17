import { requiredKeys } from './requiredKeys.js';

export const assertEmojiData = (emojiData) => {
	if (
		!emojiData ||
		!Array.isArray(emojiData) ||
		!emojiData[0] ||
		typeof emojiData[0] !== 'object' ||
		requiredKeys.some((key) => !(key in emojiData[0]))
	) {
		throw new Error('Emoji data is in the wrong format');
	}
};
