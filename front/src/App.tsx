import React from "react";
import {useRecoilState} from "recoil";
import "./App.scss";
import AppBar from "./appbar/AppBar";
import LeftSidebar from "./left_sidebar/LeftSidebar";
import RightSideBar from "./right_sidebar/RightSideBar";
import BottomStatusBar from "./bottom_status_bar/BottomStatusBar";
import MainContents from "./main/MainContents";
import {imageState, selectedItemID} from "./recoil/imageState";

function App() {
	const [images, setImages] = useRecoilState(imageState);
	const [currentID, setCurrentID] = useRecoilState(selectedItemID);
	const [_selectedItemID, _setSelectedItemID] = useRecoilState(selectedItemID);

	const changeCurrentItemIndex = (index:number) => {
		const keys = Array.from(images.keys());
		const currentIndex = keys.indexOf(_selectedItemID);


		if (keys[currentIndex + index]) {
			_setSelectedItemID(keys[currentIndex + index]);
		}
	};

	const deleteCurrentItem = () => {
		const keys = Array.from(images.keys());
		const currentIndex = keys.indexOf(_selectedItemID);
		const tempID = currentID;

		if (keys[currentIndex + 1]) {
			_setSelectedItemID(keys[currentIndex + 1]);
		} else if (keys[currentIndex - 1]) {
			_setSelectedItemID(keys[currentIndex - 1]);
		} else {
			setCurrentID("");
		}

		setImages(currVal => {
			const tempMap = new Map(currVal);

			tempMap.delete(tempID);
			return tempMap;
		});
	};

	window.onkeydown = e => {
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			changeCurrentItemIndex(1);
			document.getElementById("left-sidebar-item-wrapper")!.scrollBy({top: 60});
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			document.getElementById("left-sidebar-item-wrapper")!.scrollBy({top: -60});
			changeCurrentItemIndex(-1);
		} else if (e.key === "Delete" || e.key === "Backspace") {
			deleteCurrentItem();
		}
	};


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
