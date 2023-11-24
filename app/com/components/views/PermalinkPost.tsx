import { updatePostLike } from '~/api/mutations/like-post.ts';
import type { SignalizedPost } from '~/api/stores/posts.ts';
import { getRecordId } from '~/api/utils/misc.ts';

import { formatCompact } from '~/utils/intl/number.ts';
import { formatAbsDateTime } from '~/utils/intl/time.ts';

import { Link, LinkingType } from '../Link.tsx';
import RichTextRenderer from '../RichTextRenderer.tsx';

import PostEmbedWarning from '../moderation/PostEmbedWarning.tsx';
import Embed from '../embeds/Embed.tsx';

import ChatBubbleOutlinedIcon from '../../icons/outline-chat-bubble.tsx';
import FavoriteIcon from '../../icons/baseline-favorite.tsx';
import FavoriteOutlinedIcon from '../../icons/outline-favorite.tsx';
import MoreHorizIcon from '../../icons/baseline-more-horiz.tsx';
import RepeatIcon from '../../icons/baseline-repeat.tsx';
import ShareIcon from '../../icons/baseline-share.tsx';

import DefaultAvatar from '../../assets/default-avatar.svg';

import PostOverflowAction from '../items/posts/PostOverflowAction.tsx';
import RepostAction from '../items/posts/RepostAction.tsx';

export interface PermalinkPostProps {
	post: SignalizedPost;
}

const PermalinkPost = (props: PermalinkPostProps) => {
	const post = () => props.post;

	const author = () => post().author;
	const record = () => post().record.value;

	const rkey = () => {
		return getRecordId(post().uri);
	};

	return (
		<div class="px-4 pt-3">
			<div class="mb-3 flex items-center text-sm text-muted-fg">
				<Link
					to={{ type: LinkingType.PROFILE, actor: author().did }}
					class="group pointer-events-none inline-flex max-w-full items-start overflow-hidden text-left"
				>
					<div class="pointer-events-auto z-2 mr-3 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted-fg">
						<img src={author().avatar.value || DefaultAvatar} class="h-full w-full" />
					</div>

					<span class="pointer-events-auto block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
						<bdi class="overflow-hidden text-ellipsis group-hover:underline">
							<span class="font-bold text-primary">
								{author().displayName.value || author().handle.value}
							</span>
						</bdi>
						<span class="block overflow-hidden text-ellipsis whitespace-nowrap">
							@{author().handle.value}
						</span>
					</span>
				</Link>

				<div class="flex shrink-0 grow justify-end">
					<PostOverflowAction post={post()}>
						<button class="-mx-2 -my-1.5 flex h-8 w-8 items-center justify-center rounded-full text-base text-muted-fg hover:bg-secondary/40">
							<MoreHorizIcon />
						</button>
					</PostOverflowAction>
				</div>
			</div>

			<div class="mt-3 overflow-hidden whitespace-pre-wrap break-words text-base empty:hidden">
				<RichTextRenderer
					item={post()}
					get={(item) => {
						const record = item.record.value;
						return { t: record.text, f: record.facets };
					}}
				/>
			</div>

			{post().embed.value && (
				<PostEmbedWarning post={post()}>
					<Embed embed={post().embed.value!} large />
				</PostEmbedWarning>
			)}

			<div class="my-3">
				<span class="text-sm text-muted-fg">{formatAbsDateTime(record().createdAt)}</span>
			</div>

			<hr class="border-divider" />

			<div class="flex flex-wrap gap-4 py-4 text-sm">
				<Link
					to={{ type: LinkingType.POST_LIKED_BY, actor: author().did, rkey: rkey() }}
					class="hover:underline"
				>
					<span class="font-bold">{formatCompact(post().repostCount.value)}</span>{' '}
					<span class="text-muted-fg">Reposts</span>
				</Link>

				<Link
					to={{ type: LinkingType.POST_REPOSTED_BY, actor: author().did, rkey: rkey() }}
					class="hover:underline"
				>
					<span class="font-bold">{formatCompact(post().likeCount.value)}</span>{' '}
					<span class="text-muted-fg">Likes</span>
				</Link>
			</div>

			<hr class="border-divider" />

			<div class="flex h-13 items-center justify-around text-muted-fg">
				<Link
					to={{ type: LinkingType.REPLY, actor: author().did, rkey: rkey() }}
					class="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-secondary/40"
				>
					<ChatBubbleOutlinedIcon />
				</Link>

				<RepostAction post={post()}>
					<button
						class="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-secondary/40"
						classList={{
							'text-green-600': !!post().viewer.repost.value,
						}}
					>
						<RepeatIcon />
					</button>
				</RepostAction>

				<button
					onClick={() => updatePostLike(post(), !post().viewer.like.value)}
					class="group flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-secondary/40"
					classList={{ 'is-active text-red-600': !!post().viewer.like.value }}
				>
					<FavoriteOutlinedIcon class="group-[.is-active]:hidden" />
					<FavoriteIcon class="hidden group-[.is-active]:block" />
				</button>

				<button
					class="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-secondary/40"
					onClick={() => {}}
				>
					<ShareIcon />
				</button>
			</div>
		</div>
	);
};

export default PermalinkPost;
