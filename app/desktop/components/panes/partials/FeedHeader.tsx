import { type JSX, lazy } from 'solid-js';

import type { SignalizedFeed } from '~/api/stores/feeds.ts';

import { openModal } from '~/com/globals/modals.tsx';

import { Link, LinkingType } from '~/com/components/Link.tsx';

import DefaultAvatar from '~/com/assets/default-avatar.svg';
import { Button } from '~/com/primitives/button.ts';
import FavoriteOutlinedIcon from '~/com/icons/outline-favorite.tsx';
import { formatCompact } from '~/utils/intl/number.ts';

const LazyImageViewerDialog = lazy(() => import('~/com/components/dialogs/ImageViewerDialog.tsx'));

export interface FeedHeaderProps {
	feed?: SignalizedFeed;
}

const FeedHeader = (props: FeedHeaderProps) => {
	return (() => {
		const feed = props.feed;

		if (!feed) {
			return <div></div>;
		}

		const creator = feed.creator;

		return (
			<div class="flex flex-col gap-3 border-b border-divider p-4">
				<div class="flex gap-4">
					{(() => {
						const avatar = feed.avatar.value;

						if (avatar) {
							return (
								<button
									onClick={() => {
										openModal(() => <LazyImageViewerDialog images={[{ fullsize: avatar }]} />);
									}}
									class="group h-13 w-13 shrink-0 overflow-hidden rounded-md bg-background"
								>
									<img src={avatar} class="h-full w-full object-cover group-hover:opacity-75" />
								</button>
							);
						}

						return <div class="h-13 w-13 shrink-0 rounded-md bg-muted-fg"></div>;
					})()}

					<div class="grow">
						<p class="break-words text-lg font-bold">{feed.name.value}</p>

						<Link
							to={/* @once */ { type: LinkingType.PROFILE, actor: creator.did }}
							class="group mt-1 flex items-center text-left"
						>
							<img src={creator.avatar.value || DefaultAvatar} class="mr-2 h-5 w-5 rounded-full" />
							<span class="mr-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold empty:hidden group-hover:underline">
								{creator.displayName.value}
							</span>
							<span class="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-fg">
								@{creator.handle.value}
							</span>
						</Link>
					</div>
				</div>

				<p class="whitespace-pre-wrap break-words text-sm empty:hidden">{feed.description.value}</p>

				<p class="text-sm text-muted-fg">Liked by {formatCompact(feed.likeCount.value)} users</p>

				<div class="flex gap-2">
					<button
						title="Like this feed"
						onClick={() => {}}
						class={/* @once */ Button({ variant: 'outline' })}
					>
						<FavoriteOutlinedIcon class="-mx-1.5 text-base" />
					</button>
				</div>
			</div>
		);
	}) as unknown as JSX.Element;
};

export default FeedHeader;