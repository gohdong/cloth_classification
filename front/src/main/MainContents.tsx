import {useDropzone} from "react-dropzone";
import React, {useCallback} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import "./MainContents.scss";

const hash = require("object-hash");

export function onDropHandler(images: Map<string, Image>,
	setImages: Function, setID: Function, acceptedFiles: File[]) {
	for (const [index, item] of acceptedFiles.entries()) {
		const fileID = hash(item);


		if (!images.has(fileID)) {
			if (index === 0) {
				setID(fileID);
			}

			const tempMap = new Map<string, Image>();

			tempMap.set(fileID, {
				id: fileID,
				file: item,
				edited: false,
				usersTag: [],
				modelResultTag: [],
			});

			setImages((prev: Map<string, Image>) => new Map<string, Image>(
				[...prev, ...tempMap],
			),
			);
		}
	}
}


export default function MainContents() {
	const [images, setImages] = useRecoilState(imageState);
	const imagesCount = useRecoilValue(imagesSizeState);
	// eslint-disable-next-line no-unused-vars
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);


	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	// eslint-disable-next-line no-unused-vars
	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: "image/jpeg,image/png,image/jpg",
		noClick: imagesCount > 0,
		onDrop,
	});

	return (
		<div id="main-contents" className={isDragActive ? "drag-on" : ""} {...getRootProps()}>
			<input {...getInputProps()}/>
			<>
				{
					imagesCount > 0 && images.has(currentItemID) ?
						<div id="main-contents-wrap">
							<img src={
								URL.createObjectURL(images.get(currentItemID)!.file)
							} alt=""/>
							<div id="category-area">
								<ul>
									<li>대분류</li>
									<li>소분류</li>
									<li>성별</li>
									<li>색상</li>
								</ul>
							</div>
						</div> :
						<>
							<div id="placeholder">
								<div/>
							</div>
							{
								isDragActive ?
									<p>파일을 놓아주세요!</p> :
									<p>시작하려면 파일을 끌어오거나 선택해주세요.</p>
							}
						</>
				}
			</>
		</div>
	);
}
