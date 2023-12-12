import { For, Match, Switch } from 'solid-js';

import type { SignalizedProfile } from '~/api/stores/profiles.ts';

import { loadMoreBtn } from '../../primitives/interactive.ts';

import CircularProgress from '../CircularProgress.tsx';
import { VirtualContainer } from '../VirtualContainer.tsx';
import GenericErrorView from '../views/GenericErrorView.tsx';

import { type ProfileItemAccessory, type ProfileItemProps, ProfileItem } from '../items/ProfileItem.tsx';

export interface ProfileListProps {
	profiles?: SignalizedProfile[];
	/** Expected to be static */
	asideAccessory?: ProfileItemAccessory;
	onItemClick?: ProfileItemProps['onClick'];

	fetching?: boolean;

	error?: unknown;
	onRetry?: () => void;

	hasMore?: boolean;
	onLoadMore?: () => void;
}

const ProfileList = (props: ProfileListProps) => {
	const aside = props.asideAccessory;

	return (
		<>
			<div>
				<For each={props.profiles}>
					{(profile) => (
						<VirtualContainer class="shrink-0" estimateHeight={88}>
							<ProfileItem profile={profile} aside={aside} onClick={props.onItemClick} />
						</VirtualContainer>
					)}
				</For>
			</div>

			<Switch>
				<Match when={props.fetching}>
					<div class="grid h-13 shrink-0 place-items-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={props.error} keyed>
					{(error) => <GenericErrorView error={error} onRetry={props.onRetry} />}
				</Match>

				<Match when={props.hasMore}>
					<button onClick={props.onLoadMore} class={loadMoreBtn}>
						Show more profiles
					</button>
				</Match>

				<Match when>
					<div class="grid h-13 shrink-0 place-items-center">
						<p class="text-sm text-muted-fg">End of list</p>
					</div>
				</Match>
			</Switch>
		</>
	);
};

export default ProfileList;
