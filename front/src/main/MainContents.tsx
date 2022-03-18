import {useDropzone} from "react-dropzone";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import "./MainContents.scss";
import SkeletonMain from "../skeletons/SkeletonMain";

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

			const modelResultTag = new Map();
			const modelProbs = new Map();
			const formData = new FormData();
			let check = false;

			formData.append("img", item);
			fetch("http://localhost:4000/check", {
				method: "POST",
				body: formData,
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					for (let i = 0; i < data.probs.length; i++) {
						modelProbs.set(data.probs[i].class, new Map());
						if (data.probs[i].class === "shoes" || data.probs[i].class === "acc" || data.probs[i].class === "bag") {
							modelProbs.get(data.probs[i].class).set(data.probs[i].class,
								data.probs[i].value);
						} else {
							for (let j = 0; j < data.probs[i].subcate.length; j++) {
								modelProbs.get(data.probs[i].class).set(data.probs[i].subcate[j].class,
									data.probs[i].subcate[j].value);
							}
						}


						if (data.probs[i].class === "gender") {
							modelResultTag.set("gender", data.probs[i].subcate[0].class);
						} else if (data.probs[i].class === "color") {
							modelResultTag.set("color", data.probs[i].subcate[0].class);
						} else if (!check) {
							modelResultTag.set(data.probs[i].class, data.probs[i].subcate[0].class === null ? "" : data.probs[i].subcate[0].class);
							check = true;
						}
					}
					console.log(modelResultTag);
					console.log(modelProbs);
					/* 콘솔에 표시 */
				})
				.then(() => {
					tempMap.set(fileID, {
						id: fileID,
						file: item,
						edited: false,
						usersTag: [],
						modelResultTag,
						modelProbs,
					});
					setImages((prev: Map<string, Image>) => new Map<string, Image>(
						[...prev, ...tempMap],
					),
					);
				});
		}
	}
}


export default function MainContents() {
	const [images, setImages] = useRecoilState(imageState);
	const imagesCount = useRecoilValue(imagesSizeState);
	// eslint-disable-next-line no-unused-vars
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);
	const [clothes, setClothes] = useState(null as any);


	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	// eslint-disable-next-line no-unused-vars
	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: "image/jpeg,image/png,image/jpg",
		noClick: imagesCount > 0,
		onDrop,
	});

	useEffect(() => {
		setTimeout(async () => {
			const data = await String;

			setClothes(data);
		}, 2000);
	});

	return (
		<div id="main-contents" className={isDragActive ? "drag-on" : ""} {...getRootProps()}>
			<input {...getInputProps()} />
			<>
				{clothes && (
					imagesCount > 0 && images.has(currentItemID) ?
						<div id="main-contents-wrap">
							<div className="image-wrap">
								<img src={
									URL.createObjectURL(images.get(currentItemID)!.file)
								} alt="" />
							</div>
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
								<div />
							</div>
							{
								isDragActive ?
									<p>파일을 놓아주세요!</p> :
									<p>시작하려면 파일을 끌어오거나 선택해주세요.</p>
							}
						</>
				)}
				{!clothes && <SkeletonMain/>}
			</>
		</div>
	);
}
