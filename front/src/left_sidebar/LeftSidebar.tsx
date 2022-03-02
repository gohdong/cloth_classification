import React from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import {onDropHandler} from "../main/MainContents";

export default function LeftSidebar() {
	const [images, setImages] = useRecoilState(imageState);
	const imageLength = useRecoilValue(imagesSizeState);
	const imageListReset = useResetRecoilState(imageState);
	const currentIDReset = useResetRecoilState(selectedItemID);
	const [currentID, setCurrentID] = useRecoilState(selectedItemID);


	function createVirtualInput() {
		const result = document.createElement("input");

		result.setAttribute("type", "file");
		result.setAttribute("multiple", "multiple");

		result.addEventListener("change", ev => {
			ev.preventDefault();
			const tempFiles: File[] = [];


			Array.prototype.forEach.call(result.files, file => {
				tempFiles.push(file);
			});

			onDropHandler(images, setImages, setCurrentID, tempFiles);
		});

		return result;
	}

	const fileSelector = createVirtualInput();


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
			{
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
			}
			<div id="left-sidebar-buttons">
				<p onClick={addItems}>+</p>

				<p onClick={clickClear()}>Clear All</p>
			</div>
		</div>
	);
}
