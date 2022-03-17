import {useDropzone} from "react-dropzone";
import React, {useCallback, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import "./MainContents.scss";
// eslint-disable-next-line no-unused-vars
import {bigCategory, categoryToKR, color, colorCode, colorToKR, gender, smallCategory} from "./category";

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

			formData.append("img", item);
			fetch("http://localhost:4000/check", {
				method: "POST",
				body: formData,
			})
				.then(response => response.json())
				.then(data => {
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
						} else if (!modelResultTag.has("main")) {
							modelResultTag.set("main", data.probs[i].class);
							modelResultTag.set("sub", data.probs[i].subcate[0].class === null ? "" : data.probs[i].subcate[0].class);
						}
					}
					/* 콘솔에 표시 */
				})
				.then(() => {
					tempMap.set(fileID, {
						id: fileID,
						file: item,
						edited: false,
						usersTag: new Map(modelResultTag),
						modelResultTag,
						modelProbs,
					});
					setImages((prev: Map<string, Image>) => new Map<string, Image>(
						[...prev, ...tempMap]),
					);
				});
		}
	}
}


export default function MainContents() {
	const [images, setImages] = useRecoilState(imageState);
	const imagesCount = useRecoilValue(imagesSizeState);
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);
	// eslint-disable-next-line no-unused-vars
	const [currentBigCategory, setCurrentBigCategory] = useState<string>("");
	// eslint-disable-next-line no-unused-vars
	const [currentSmallCategory, setCurrentSmallCategory] = useState<string>("");
	// eslint-disable-next-line no-unused-vars
	const [currentGender, setCurrentGender] = useState<string>("");
	// eslint-disable-next-line no-unused-vars
	const [currentColor, setCurrentColor] = useState<string>("");

	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: "image/jpeg,image/png,image/jpg",
		noClick: imagesCount > 0,
		onDrop,
	});

	const getCategory = async () => {
		setCurrentBigCategory(images.get(currentItemID)?.usersTag.get("main") ?? "");
		setCurrentSmallCategory(images.get(currentItemID)?.usersTag.get("sub") ?? "");
		setCurrentGender(images.get(currentItemID)?.usersTag.get("gender") ?? "");
		setCurrentColor(images.get(currentItemID)?.usersTag.get("color") ?? "");
	};

	// eslint-disable-next-line no-unused-vars
	const onClickMainCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		console.log(value);
		setCurrentBigCategory(value ?? "");
		setCurrentSmallCategory("");
		images.get(currentItemID)?.usersTag.set("main", value ?? "");
		images.get(currentItemID)?.usersTag.set("sub", "");
	};
	// eslint-disable-next-line no-unused-vars
	const onClickSubCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentSmallCategory(value ?? "");
		images.get(currentItemID)?.usersTag.set("sub", value);
	};
	// eslint-disable-next-line no-unused-vars
	const onClickGenderCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentGender(value ?? "");
		images.get(currentItemID)?.usersTag.set("gender", value);
	};
	// eslint-disable-next-line no-unused-vars
	const onClickColorCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentColor(value ?? "");
		images.get(currentItemID)?.usersTag.set("color", value);
	};

	useEffect(() => {
		getCategory();
	}, [currentItemID, images]);


	return (
		<div id="main-contents" className={isDragActive ? "drag-on" : ""} {...getRootProps()}>
			<input {...getInputProps()} />
			<>
				{
					imagesCount > 0 && images.has(currentItemID) ?
						<div id="main-contents-wrap">
							<div className="image-wrap">
								<img src={
									URL.createObjectURL(images.get(currentItemID)!.file)
								} alt=""/>
							</div>
							<div id="main-bottom">
								<div id="category-area">
									<div id="main-bottom-left">
										<h3>대분류</h3>
										<div className="buttons-wrap">
											{bigCategory.map((value, index) =>
												<div key={value}
													className={`category-buttons ${currentBigCategory === value ? "selected" : ""}`} onClick={e => onClickMainCategory(value, e)}>{categoryToKR.get(value)}</div>)}
										</div>
										<h3>소분류</h3>
										<div className="buttons-wrap">
											{smallCategory.get(currentBigCategory)?.map((value, index) =>
												<div key={value} className={`category-buttons ${currentSmallCategory === value ? "selected" : ""}`} onClick={e => onClickSubCategory(value, e)}>{categoryToKR.get(value)}</div>)}
										</div>
									</div>
									<div id="main-bottom-right">
										<h3>성별</h3>
										<div className="buttons-wrap">
											{gender.map((value, index) =>
												<div key={value} className={`category-buttons ${currentGender === value ? "selected" : ""}`} onClick={e => onClickGenderCategory(value, e)}>{categoryToKR.get(value)}</div>)}
										</div>
										<h3>색상</h3>
										<div className="buttons-wrap">
											{color.map((value, index) =>
												<div
													className={`category-buttons ${currentColor === value ? "selected" : ""}`} onClick={e => onClickColorCategory(value, e)}
													key={value}
													style={{
														color: value === "white" || value === "yellow" || value === "beige" || value === "green" ?
															"black" :
															"white",
														backgroundColor: currentColor === value ? "#6f90f8" : colorCode.get(value),
														border: value === "white" ? "solid 1px #e6e6e6" : "",
													}}>
													{colorToKR.get(value)}
												</div>)}
										</div>
									</div>

								</div>
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
