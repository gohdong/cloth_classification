import React from "react";
import "./App.css";
import AppBar from "./appbar/AppBar";

function App() {
	return (
		<>
			<div id="main-wrapper">
				<AppBar/>
				<div id="contents-wrapper">
					<div id="static-contents">
						<div className="flex-wrapper">
							<div id="left-sidebar">
								<p>drag or add items</p>
								<div id="left-sidebar-buttons">
									<p>+</p>
									<p>Clear All</p>
								</div>
							</div>
							<div id="main-contents">

							</div>
						</div>
						<div id="bottom-status">

						</div>
					</div>
					<div id="toggle-contents">
						<div id="right-sidebar">

						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
