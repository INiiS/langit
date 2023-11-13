import { Match, Switch, createSignal } from 'solid-js';

import { createQuery } from '@pkg/solid-query';

import type { DID } from '~/api/atp-schema.ts';
import { getInitialProfile, getProfile, getProfileKey } from '~/api/queries/get-profile.ts';

import CircularProgress from '~/com/components/CircularProgress.tsx';
import { TabbedPanel, TabbedPanelView } from '~/com/components/TabbedPanel.tsx';
import { VirtualContainer } from '~/com/components/VirtualContainer.tsx';

import TimelineList from '~/com/components/lists/TimelineList.tsx';
import ProfileHeader from '~/com/components/views/ProfileHeader.tsx';

import { usePaneContext } from '../PaneContext.tsx';
import PaneDialog from '../PaneDialog.tsx';
import PaneDialogHeader from '../PaneDialogHeader.tsx';

export interface ProfilePaneDialogProps {
	/** Expected to be static */
	actor: DID;
}

const enum ProfileTab {
	POSTS,
	POSTS_WITH_REPLIES,
	MEDIA,
	LIKES,
}

const ProfilePaneDialog = (props: ProfilePaneDialogProps) => {
	const { actor } = props;

	const { pane } = usePaneContext();

	const profile = createQuery(() => {
		const key = getProfileKey(pane.uid, actor);

		return {
			queryKey: key,
			queryFn: getProfile,
			initialDataUpdatedAt: 0,
			initialData: () => getInitialProfile(key),
		};
	});

	return (
		<PaneDialog>
			<PaneDialogHeader
				title={(() => {
					const $profile = profile.data;

					if ($profile) {
						return $profile.displayName.value || `@${$profile.handle.value}`;
					}

					return `Profile`;
				})()}
				subtitle={(() => {
					const $profile = profile.data;

					if ($profile) {
						return `${$profile.postsCount.value} posts`;
					}

					return;
				})()}
			/>

			<Switch>
				<Match when={profile.data} keyed>
					{(data) => {
						const [tab, setTab] = createSignal(ProfileTab.POSTS);

						return (
							<div class="min-h-0 grow overflow-y-auto">
								<VirtualContainer>
									<ProfileHeader uid={pane.uid} profile={data} />
								</VirtualContainer>

								<TabbedPanel selected={tab()} onChange={setTab}>
									<TabbedPanelView label="Posts" value={ProfileTab.POSTS}>
										<TimelineList uid={pane.uid} params={{ type: 'profile', actor: actor, tab: 'posts' }} />
									</TabbedPanelView>
									<TabbedPanelView label="Replies" value={ProfileTab.POSTS_WITH_REPLIES}>
										<TimelineList uid={pane.uid} params={{ type: 'profile', actor: actor, tab: 'replies' }} />
									</TabbedPanelView>
									<TabbedPanelView label="Media" value={ProfileTab.MEDIA}>
										<TimelineList uid={pane.uid} params={{ type: 'profile', actor: actor, tab: 'media' }} />
									</TabbedPanelView>
									<TabbedPanelView label="Likes" value={ProfileTab.LIKES} hidden={pane.uid !== data.did}>
										<TimelineList uid={pane.uid} params={{ type: 'profile', actor: actor, tab: 'likes' }} />
									</TabbedPanelView>
								</TabbedPanel>
							</div>
						);
					}}
				</Match>

				<Match when={profile.isLoading}>
					<div class="grid h-13 place-items-center">
						<CircularProgress />
					</div>
				</Match>
			</Switch>
		</PaneDialog>
	);
};

export default ProfilePaneDialog;
