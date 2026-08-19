# History scroll regression

The previous implementation called `onHistoryOffset` on every `globalpointermove`. The callback immediately called the root `render()`, destroying the active Pixi gesture target after the first movement event.

The fixed interaction keeps the active content container alive during the gesture, moves it locally for visual feedback, and commits the new virtual-list offset only on pointer release. An overscan viewport keeps the drag populated without rendering the entire history.
