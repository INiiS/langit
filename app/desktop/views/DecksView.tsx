import { For, Show } from 'solid-js';

import { Navigate, useParams } from '@solidjs/router';
import { DragDropProvider, DragDropSensors, SortableProvider } from '@thisbeyond/solid-dnd';

import { preferences } from '../globals/settings.ts';
import { ConstrainYDragAxis } from '../utils/dnd.ts';

import { PaneContextProvider } from '../components/panes/PaneContext.tsx';
import PaneRouter from '../components/panes/PaneRouter.tsx';
import AddPaneDialog from '../components/settings/AddPaneDialog.tsx';

import AddIcon from '~/com/icons/baseline-add.tsx';
import EditIcon from '~/com/icons/baseline-edit.tsx';

import button from '~/com/primitives/button.ts';
import iconButton from '~/com/primitives/icon-button.ts';
import { openModal } from '~/com/globals/modals.tsx';

const DecksView = () => {
	const params = useParams<{ deck: string }>();

	const deck = () => {
		const deckId = params.deck;
		const config = preferences.decks.find((d) => d.id === deckId);

		return config;
	};

	return (
		<Show when={deck()} keyed fallback={<Navigate href="/" />}>
			{(deck) => (
				<div class="flex grow gap-1 overflow-x-auto bg-divider px-1">
					<DragDropProvider
						onDragEnd={({ draggable, droppable }) => {
							if (draggable && droppable) {
								const panes = deck.panes;

								const fromIndex = panes.findIndex((pane) => pane.id === draggable.id);
								const toIndex = panes.findIndex((pane) => pane.id === droppable.id);

								if (fromIndex !== toIndex) {
									panes.splice(toIndex, 0, ...panes.splice(fromIndex, 1));
								}
							}
						}}
					>
						<DragDropSensors />
						<ConstrainYDragAxis enabled />

						<SortableProvider ids={deck.panes.map((pane) => pane.id)}>
							<For each={deck.panes}>
								{(pane, idx) => (
									<PaneContextProvider
										pane={pane}
										index={idx}
										onDelete={() => {
											deck.panes.splice(idx(), 1);
										}}
									>
										<PaneRouter pane={pane} />
									</PaneContextProvider>
								)}
							</For>
						</SortableProvider>
					</DragDropProvider>

					<div class="grid w-72 shrink-0 place-items-center">
						<div>
							<button
								onClick={() => {
									openModal(() => <AddPaneDialog deck={deck} />);
								}}
								class={/* @once */ button({ variant: 'primary' })}
							>
								<AddIcon class="-ml-1.5 mr-2 text-lg" />
								<span>Add column</span>
							</button>
						</div>
					</div>

					<div class="-mr-1 ml-auto bg-background/20 p-2">
						<button class={/* @once */ iconButton()}>
							<EditIcon />
						</button>
					</div>
				</div>
			)}
		</Show>
	);
};

export default DecksView;
