import {useDropzone} from "react-dropzone";
import React, {useCallback, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import "./MainContents.scss";
import {bigCategory, categoryToKR, color, colorCode, colorToKR, gender, smallCategory} from "./category";
import SkeletonMain from "../skeletons/SkeletonMain";
import {loadingSate} from "../recoil/loadingState";

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
				viewed: false,
				usersTag: new Map(),
				modelResultTag: new Map(),
				modelProbs: new Map(),
			});

			setImages((prev: Map<string, Image>) => new Map<string, Image>(
				[...prev, ...tempMap]),
			);
		}
	}
}


export default function MainContents() {
	const [images, setImages] = useRecoilState(imageState);
	const imagesCount = useRecoilValue(imagesSizeState);
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);
	const [isLoading, setIsLoading] = useRecoilState(loadingSate);
	const [currentBigCategory, setCurrentBigCategory] = useState<string>("");
	const [currentSmallCategory, setCurrentSmallCategory] = useState<string>("");
	const [currentGender, setCurrentGender] = useState<string>("");
	const [currentColor, setCurrentColor] = useState<string>("");

	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: "image/jpeg,image/png,image/jpg",
		noClick: imagesCount > 0,
		onDrop,
	});
	const setImageEdited = () => {
		if (!images.get(currentItemID)!.edited) {
			setImages(currVal => {
				const temp = new Map(currVal);

                temp.get(currentItemID)!.edited = true;
                return temp;
			});
		}
	};

	const getCategory = async () => {
		if (!isLoading && images.get(currentItemID)) {
			if (!images.get(currentItemID)!.viewed) {
				setIsLoading(true);
				const modelResultTag = new Map();
				const modelProbs = new Map();
				const formData = new FormData();

				formData.append("img", images.get(currentItemID)!.file);
				await fetch("http://localhost:4000/check", {
					method: "POST",
					body: formData,
				})
					.then(response => response.json())
					.then(data => {
						const temData: Array<any> = Array.from(data.probs);

						temData.sort((a: any, b: any) => b.value - a.value);
						for (let i = 0; i < temData.length; i++) {
							modelProbs.set(temData[i].class, new Map());
							if (temData[i].class === "shoes" || temData[i].class === "acc" || temData[i].class === "bag") {
								modelProbs.get(temData[i].class).set(temData[i].class,
									temData[i].value);
							} else {
								for (let j = 0; j < temData[i].subcate.length; j++) {
									modelProbs.get(temData[i].class).set(temData[i].subcate[j].class,
										temData[i].subcate[j].value);
								}
							}


							if (temData[i].class === "gender") {
								modelResultTag.set("gender", temData[i].subcate[0].class);
							} else if (temData[i].class === "color") {
								modelResultTag.set("color", temData[i].subcate[0].class);
							} else if (!modelResultTag.has("main")) {
								modelResultTag.set("main", temData[i].class);
								modelResultTag.set("sub", temData[i].subcate.length === 0 ? temData[i].class : temData[i].subcate[0].class);
							}
						}
						/* 콘솔에 표시 */
					})
					.then(() => {
						setImages(currVal => {
							const temp = new Map(currVal);

                            temp.get(currentItemID)!.viewed = true;
                            temp.get(currentItemID)!.usersTag = new Map(modelResultTag);
                            temp.get(currentItemID)!.modelProbs = modelProbs;
                            temp.get(currentItemID)!.modelResultTag = modelResultTag;

                            return temp;
						});
					});
			}

			setCurrentBigCategory(images.get(currentItemID)?.usersTag.get("main") ?? "");
			setCurrentSmallCategory(images.get(currentItemID)?.usersTag.get("sub") ?? "");
			setCurrentGender(images.get(currentItemID)?.usersTag.get("gender") ?? "");
			setCurrentColor(images.get(currentItemID)?.usersTag.get("color") ?? "");
			setIsLoading(false);
		}
	};

	const onClickMainCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentBigCategory(value ?? "");
		setCurrentSmallCategory("");
		setImageEdited();
		images.get(currentItemID)?.usersTag.set("main", value ?? "");
		images.get(currentItemID)?.usersTag.set("sub", "");
	};
	const onClickSubCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentSmallCategory(value ?? "");
		setImageEdited();
		images.get(currentItemID)?.usersTag.set("sub", value);
	};
	const onClickGenderCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentGender(value ?? "");
		setImageEdited();
		images.get(currentItemID)?.usersTag.set("gender", value);
	};
	const onClickColorCategory = (value: string,
		event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setCurrentColor(value ?? "");
		setImageEdited();
		images.get(currentItemID)?.usersTag.set("color", value);
	};


	useEffect(() => {
		getCategory();
	}, [currentItemID, images]);


	function getColorButtonColor(value: string) {
		if (currentColor === value) {
			if (value === "yellow" || value === "beige" || value === "green") {
				return "black";
			}
			return "white";
		}
		return "black";
	}

	function getColorButtonBackgroundColor(value: string) {
		if (currentColor === value) {
			if (currentColor === "white") {
				return "#6f90f8";
			}
			return colorCode.get(value);
		}
		return "white";
	}

	function getColorButtonBorder(value: string) {
		if (currentColor === value) {
			if (currentColor === "white") {
				return "solid 1px #6f90f8";
			}
			return `solid 1px ${colorCode.get(value)}`;
		}
		return "solid 1px #6f90f8";
	}

	function getBody() {
		if (isLoading) {
			return <SkeletonMain/>;
		}
		return imagesCount > 0 && images.has(currentItemID) ?
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
										className={`category-buttons ${currentBigCategory === value ? "selected" : ""}`}
										onClick={e => onClickMainCategory(value, e)}>{categoryToKR.get(value)}</div>)}
							</div>
							<h3>소분류</h3>
							<div className="buttons-wrap">
								{smallCategory.get(currentBigCategory)?.map((value, index) =>
									<div key={value}
										className={`category-buttons ${currentSmallCategory === value ? "selected" : ""}`}
										onClick={e => onClickSubCategory(value, e)}>{categoryToKR.get(value)}</div>)}
							</div>
						</div>
						<div id="main-bottom-right">
							<h3>성별</h3>
							<div className="buttons-wrap">
								{gender.map((value, index) =>
									<div key={value}
										className={`category-buttons ${currentGender === value ? "selected" : ""}`}
										onClick={e => onClickGenderCategory(value, e)}>{categoryToKR.get(value)}</div>)}
							</div>
							<h3>색상</h3>
							<div className="buttons-wrap">
								{color.map((value, index) =>
									<div
										className={`category-buttons ${currentColor === value ? "selected" : ""}`}
										onClick={e => onClickColorCategory(value, e)}
										key={value}
										style={{
											color: getColorButtonColor(value),
											backgroundColor: getColorButtonBackgroundColor(value),
											border: getColorButtonBorder(value),
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
			</>;
	}

	return (
		<div id="main-contents" className={isDragActive ? "drag-on" : ""} {...getRootProps()}>
			<input type="file" accept="image/*" {...getInputProps()} />
			<>
				{getBody()}
			</>
		</div>
	);
}
