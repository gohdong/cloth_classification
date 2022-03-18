import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import {onDropHandler} from "../main/MainContents";
import "./LeftSidebar.scss";
import SkeletonLeft from "../skeletons/SkeletonLeft";

export default function LeftSidebar() {
	const [images, setImages] = useRecoilState(imageState);
	const imageLength = useRecoilValue(imagesSizeState);
	const imageListReset = useResetRecoilState(imageState);
	const currentIDReset = useResetRecoilState(selectedItemID);
	const [currentID, setCurrentID] = useRecoilState(selectedItemID);
	const [clothes, setClothes] = useState(null as any);


	function CreateVirtualInput() {
		const result = document.createElement("input");

		useEffect(() => {
			setTimeout(async () => {
				result.setAttribute("type", "file");
				result.setAttribute("multiple", "multiple");
				result.setAttribute("accept", "image/jpeg,image/png,image/jpg");

				result.addEventListener("change", ev => {
					ev.preventDefault();
					const tempFiles: File[] = [];


					Array.prototype.forEach.call(result.files, file => {
						tempFiles.push(file);
					});

					onDropHandler(images, setImages, setCurrentID, tempFiles);
				});
				const data = await result.type;

				setClothes(data);
			}, 2000);
		});
		return result;
	}

	const fileSelector = CreateVirtualInput();


	function clickClear() {
		return () => {
			imageListReset();
			currentIDReset();
		};
	}

	function clickItem(id: string) {
		return () => {
			setCurrentID(id);
		};
	}

	function addItems() {
		fileSelector.click();
	}


	return (
		<div id="left-sidebar">

			{clothes && (
				imageLength === 0 ?
					<p>파일을 추가해주세요.</p> :
					<div id="left-sidebar-item-wrapper">
						{Array.from(images).map((value, index) =>
							<div key={value[1].id} className={`left-sidebar-item ${value[1].id === currentID ? "selected-item" : ""}`} onClick={clickItem(value[0])}>
								<img src={URL.createObjectURL(value[1].file)} alt={`uploaded_image_${index}`} />
								<p className="item-title">{value[1].file.name}</p>
							</div>,
						)}
					</div>
			)}
			{!clothes && <SkeletonLeft/>}
			<div id="left-sidebar-buttons">
				<p onClick={addItems}>+</p>

				<p onClick={clickClear()}>Clear All</p>
			</div>
		</div>
	);
}
