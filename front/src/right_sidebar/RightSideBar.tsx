import {useRecoilValue} from "recoil";
import "./RightSideBar.scss";
import {sidebarState} from "../recoil/sidebarState";
import {imageState, selectedItemID} from "../recoil/imageState";

export function convertValue(data: Map<String, Map<String, Number>> | undefined) {
	if (data === undefined) return null;
	return (
		<div>
			{data.get("top")?.get("shirt")}
		</div>
	);
}

export default function RightSideBar() {
	const isSideBarOpen = useRecoilValue(sidebarState);
	const currentItemID = useRecoilValue(selectedItemID);
	const images = useRecoilValue(imageState);

	return (
		<div id="right-sidebar" className={isSideBarOpen ? "right-sidebar-on" : "right-sidebar-off"}>
			{convertValue(images.get(currentItemID)?.modelProbs)}
		</div>
	);
}

