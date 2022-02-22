import React from "react";
import {useRecoilValue} from "recoil";
import {imagesSizeState, imageState} from "../recoil/imageState";

export default function LeftSidebar() {
	const imagesList = useRecoilValue(imageState);
	const imageLength = useRecoilValue(imagesSizeState);

	return (
		<div id="left-sidebar">
			{
				imageLength === 0 ?
					<p>drag or add items</p> :
					<div id="left-sidebar-item-wrapper">
						{Array.from(imagesList).map((value, index) =>
							<div key={value[1].id} className="left-sidebar-item">
								<img src={URL.createObjectURL(value[1].file)} alt={`uploaded_image_${index}`}/>
								<p className="item-title">{value[1].file.name}</p>
							</div>,
						)}
					</div>
			}
			<div id="left-sidebar-buttons">
				<p>+</p>
				<p>Clear All</p>
			</div>
		</div>
	);
}
