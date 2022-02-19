import React from "react";
import {useRecoilValue} from "recoil";
import {imagesSizeState, imageState} from "../recoil/imageState";

export default function LeftSidebar() {
	const imagesList = useRecoilValue(imageState);
	const imageLength = useRecoilValue(imagesSizeState);

	return (
		<div id="left-sidebar">
			{Array.from(imagesList).map((value, index) =>
				<>
					<p key={value[1].id}>aa</p>
				</>,
			)}
			{
				imageLength === 0 && <p>drag or add items</p>
			}
			<div id="left-sidebar-buttons">
				<p>+</p>
				<p>Clear All</p>
			</div>
		</div>
	);
}
