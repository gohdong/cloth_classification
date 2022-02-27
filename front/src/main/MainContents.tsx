import {useDropzone} from "react-dropzone";
import React, {useCallback} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";

const hash = require("object-hash");

export function onDropHandler(images: Map<string, Image>,
	setImages: Function, setID: Function, acceptedFiles: File[]) {
	for (const [index, item] of acceptedFiles.entries()) {
		const fileID = hash(item);

		if (index === 0) {
			setID(fileID);
		}


		if (!images.has(fileID)) {
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
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);


	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	// eslint-disable-next-line no-unused-vars
	const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: "image/jpeg,image/png,image/jpg", noClick: imagesCount > 0, onDrop});

	return (
		<div id="main-contents" {...getRootProps()}>
			{/* <input {...getInputProps()}/>*/}
			<>
				{
					imagesCount > 0 ?
						<p>
							<img src={

								// @ts-ignore
								URL.createObjectURL(images.get(currentItemID).file)
							} alt="" width="400px"/>
						</p> :
						<>
							<div id="placeholder">
								<div/>
							</div>
							{
								isDragActive ?
									<p>Drop the files here ...</p> :
									<p>Drag 'n' drop some files here, or click to select files</p>
							}
						</>
				}
			</>
		</div>
	);
}
