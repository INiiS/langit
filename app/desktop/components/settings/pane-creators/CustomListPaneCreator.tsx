import { For, Match, Show, Switch } from 'solid-js';

import { createInfiniteQuery } from '@pkg/solid-query';

import type { RefOf } from '~/api/atp-schema.ts';
import { multiagent } from '~/api/globals/agent.ts';

import { type CustomListPaneConfig, PaneType } from '../../../globals/panes.ts';

import { DialogBody } from '~/com/primitives/dialog.ts';
import { Interactive, loadMoreBtn } from '~/com/primitives/interactive.ts';

import CircularProgress from '~/com/components/CircularProgress.tsx';
import { VirtualContainer } from '~/com/components/VirtualContainer.tsx';

import type { PaneCreatorProps } from './types.ts';

type List = RefOf<'app.bsky.graph.defs#listView'>;

const listItem = Interactive({ variant: 'muted', class: `flex w-full gap-3 px-4 py-3 text-left` });

const CustomListPaneCreator = (props: PaneCreatorProps) => {
	const lists = createInfiniteQuery(() => ({
		queryKey: ['getProfileLists', props.uid, props.uid, 30] as const,
		queryFn: async (ctx) => {
			const [, uid, actor, limit] = ctx.queryKey;

			const param = ctx.pageParam;
			const agent = await multiagent.connect(uid);

			let attempts = 0;
			let cursor: string | null | undefined;
			let items: List[] = [];

			if (param) {
				cursor = param.key;
				items = param.remaining;
			}

			// We don't have enough to fulfill this request...
			while (cursor !== null && items.length < limit) {
				const response = await agent.rpc.get('app.bsky.graph.getLists', {
					params: {
						actor: actor,
						limit: limit,
						cursor: cursor,
					},
				});

				const data = response.data;
				const filtered = data.lists.filter((list) => list.purpose === 'app.bsky.graph.defs#curatelist');

				items = items.concat(filtered);
				cursor = data.cursor || null;

				// Give up after 2 attempts
				if (++attempts >= 2) {
					break;
				}
			}

			const lists = items.slice(0, limit);
			const remaining = items.slice(limit);

			return {
				cursor: cursor || remaining.length > 0 ? { key: cursor || null, remaining: remaining } : undefined,
				lists: lists,
			};
		},
		getNextPageParam: (last) => last.cursor,
		initialPageParam: undefined as { key: string | null; remaining: List[] } | undefined,
	}));

	return (
		<div class={/* @once */ DialogBody({ padded: false, scrollable: true })}>
			<div>
				<For each={lists.data?.pages.flatMap((page) => page.lists)}>
					{(list) => (
						<VirtualContainer estimateHeight={88}>
							<button
								onClick={() => {
									props.onAdd<CustomListPaneConfig>({
										type: PaneType.CUSTOM_LIST,
										list: { uri: list.uri, name: list.name },
										infoVisible: true,
									});
								}}
								class={listItem}
							>
								<div class="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted-fg">
									<Show when={list.avatar}>{(avatar) => <img src={avatar()} class="h-full w-full" />}</Show>
								</div>

								<div class="flex min-w-0 grow flex-col">
									<p class="text-sm font-bold">{list.name}</p>
									<p class="text-sm text-muted-fg">List by @{list.creator.handle}</p>

									<Show when={list.description}>
										{(description) => (
											<div class="mt-1 whitespace-pre-wrap break-words text-sm">{description()}</div>
										)}
									</Show>
								</div>
							</button>
						</VirtualContainer>
					)}
				</For>
			</div>

			<Switch>
				<Match when={lists.isLoading || lists.isFetchingNextPage}>
					<div class="flex h-13 items-center justify-center border-divider">
						<CircularProgress />
					</div>
				</Match>

				<Match when={lists.hasNextPage}>
					<button onClick={() => lists.fetchNextPage()} class={loadMoreBtn}>
						Show more
					</button>
				</Match>

				<Match when>
					<div class="flex h-13 items-center justify-center">
						<p class="text-sm text-muted-fg">End of list</p>
					</div>
				</Match>
			</Switch>
		</div>
	);
};

export default CustomListPaneCreator;
