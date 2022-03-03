import {useRecoilValue} from "recoil";
import {imagesSizeState} from "../recoil/imageState";
import "./BottomStatusBar.scss";

export default function BottomStatusBar() {
	const test = useRecoilValue(imagesSizeState);

	return (
		<div id="bottom-status">
			<p>{test} items here</p>
		</div>
	);
}
