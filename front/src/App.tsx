import React from "react";
// import {atom} from "recoil";
import "./App.css";
import AppBar from "./appbar/AppBar";
import LeftSidebar from "./left_sidebar/LeftSidebar";
import RightSideBar from "./right_sidebar/RightSideBar";
import BottomStatusBar from "./bottom_status_bar/BottomStatusBar";
import MainContents from "./main/MainContents";

function App() {
	return (
		<>
			<AppBar/>
			<div id="main-wrapper">
				<div id="contents-wrapper">
					<div id="static-contents">
						<div className="flex-wrapper">
							<LeftSidebar/>
							<MainContents/>
						</div>
					</div>
					<div id="toggle-contents">
						<RightSideBar/>
					</div>
				</div>
			</div>
			<BottomStatusBar/>
		</>
	);
}

export default App;
