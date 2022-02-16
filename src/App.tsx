import React from "react";
import "./App.css";
import AppBar from "./appbar/AppBar";
import LeftSidebar from "./left_sidebar/LeftSidebar";
import RightSideBar from "./right_sidebar/RightSideBar";

function App() {
	return (
		<>
			<AppBar/>
			<div id="main-wrapper">
				<div id="contents-wrapper">
					<div id="static-contents">
						<div className="flex-wrapper">
							<LeftSidebar/>
							<div id="main-contents">
								<div id="placeholder">
									<div className="" />
								</div>
							</div>
						</div>
					</div>
					<div id="toggle-contents">
						<RightSideBar/>
					</div>
				</div>
				<div id="bottom-status">
					status
				</div>
			</div>
		</>
	);
}

export default App;
