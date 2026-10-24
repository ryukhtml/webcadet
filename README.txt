# Full Tilt! Pinball Web aka Webcadet

A web port of the classic Full Tilt! Pinball tables (Space Cadet, Dragon's Keep, and Skulduggery), built out of nostalgia and the need for proper online high score leaderboards.

You can try it live here: webcadet.pages.dev

## What's in here

* **Space Cadet:** Uses k4zmu2a's open-source SpaceCadetPinball engine for native web execution.
* **Dragon's Keep & Skulduggery:** Emulated via js-dos and DOSBox-X.
* **Online Leaderboards:** Tied to Supabase to track scores, ball metrics, and session times.
* **Player Profiles & Stats:** Click any username on the leaderboard or in your friends list to check out score curves, active duration charts, and KPIs via Chart.js.
* **Smart Active-Time Tracking:** The game clock pauses when you hit F3 or if the browser tab loses focus, stopping players from accidentally idling a match.
* **Customization:** Fully remappable controls, local storage persistence, retro themes (Windows 95 and Windows XP Luna), and an optional CRT scanline filter.

## Tech stack

* HTML5, CSS3, JavaScript (ES6+)
* WebAssembly & Emscripten (SDL2 runtime)
* js-dos (v8) for DOS emulation
* Supabase (PostgreSQL backend, Auth, Storage, and custom RPC functions)
* Chart.js for data visualization

## Disclaimer

This is a non-commercial, personal fan project. All game assets, trademarks, and table designs belong to their respective copyright holders (Microsoft, Maxis, Cinematronics). No ads or tracking are used. The repository will be updated or taken down immediately upon request from the rights holders.

## Acknowledgments

Huge thanks to Antho and Marceau for the countless hours spent playing the original back at boarding school—this whole thing started because of those sessions.