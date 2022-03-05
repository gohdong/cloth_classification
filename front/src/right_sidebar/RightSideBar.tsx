import React from "react";
import {useRecoilValue} from "recoil";
import "./RightSideBar.scss";
import {sidebarState} from "../recoil/sidebarState";

export default function RightSideBar() {
	const isSideBarOpen = useRecoilValue(sidebarState);


	return (
		<div id="right-sidebar" className={isSideBarOpen ? "right-sidebar-on" : "right-sidebar-off"}>
		</div>
	);
}
