import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {useRecoilState} from "recoil";
import {imageState, Image} from "../recoil/imageState";

const hash = require("object-hash");

export function onDropHandler(images: Map<string, Image>,
	setImages: Function, acceptedFiles: File[]) {
	for (const item of acceptedFiles) {
		const fileID = hash(item);


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

export default function MyDropzone() {
	const [images, setImages] = useRecoilState(imageState);


	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, acceptedFiles);
	}, []);
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});


	return (
		<>
			<div id="placeholder" {...getRootProps()}>
				<input {...getInputProps()} />
				<div/>
			</div>
			{
				isDragActive ?
					<p>Drop the files here ...</p> :
					<p>Drag 'n' drop some files here, or click to select files</p>
			}
		</>
	);
}
