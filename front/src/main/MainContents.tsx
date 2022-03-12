import {useDropzone} from "react-dropzone";
import React, {useCallback, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {Image, imagesSizeState, imageState, selectedItemID} from "../recoil/imageState";
import "./MainContents.scss";

const hash = require("object-hash");

const clothesTag: Map<string, Array<string>> = new Map();

clothesTag.set("top", ["under", "t-shirt", "hoodie", "sleep", "shirt", "sweater", "waistcoat", "swim"]);
clothesTag.set("bottom", ["under", "trouser", "sleep", "skirt", "short", "jean", "swim"]);
clothesTag.set("one", ["under", "dress", "sleep", "jumpsuit", "setup", "swim"]);
clothesTag.set("outer", ["jacket", "blazer", "coat", "cardigan"]);
clothesTag.set("shoes", []);
clothesTag.set("acc", []);
clothesTag.set("bag", []);

const genderTag: Array<string> = ["male", "unisex", "female"];
const colorTag: Array<string> = ["black", "white", "blue", "yellow", "brown", "grey", "red", "beige", "orange", "khaki", "turquoise", "green", "purple", "pink"];

export async function onDropHandler(images: Map<string, Image>,
	setImages: Function, setID: Function, acceptedFiles: File[]) {
	try {
		await fetch("http://localhost:4000/");
	} catch (error) {
		alert("Fail to connect Server");
		return;
	}
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
						[...prev, ...tempMap],
					),
					);
				})
				.catch(e => {
					alert(e);
				});
		}
	}
}


export default function MainContents() {
	const [images, setImages] = useRecoilState(imageState);
	const imagesCount = useRecoilValue(imagesSizeState);
	// eslint-disable-next-line no-unused-vars
	const [currentItemID, setCurrentItemID] = useRecoilState(selectedItemID);

	const [mainCategory, setMainCategory] = useState("");
	const [subCategory, setSubCategory] = useState("");
	const [gender, setGender] = useState("");
	const [color, setColor] = useState("");


	const onDrop = useCallback(acceptedFiles => {
		onDropHandler(images, setImages, setCurrentItemID, acceptedFiles);
	}, []);

	// eslint-disable-next-line no-unused-vars
	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: "image/jpeg,image/png,image/jpg",
		noClick: imagesCount > 0,
		onDrop,
	});

	const onClickMainCategory = (value: string,
		event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setMainCategory(value ?? "");
		setSubCategory("");
		images.get(currentItemID)?.usersTag.set("main", value ?? "");
		images.get(currentItemID)?.usersTag.set("sub", "");
	};
	const onClickSubCategory = (value: string,
		event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setSubCategory(value ?? "");
		images.get(currentItemID)?.usersTag.set("sub", value);
	};
	const onClickGenderCategory = (value: string,
		event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setGender(value ?? "");
		images.get(currentItemID)?.usersTag.set("gender", value);
	};
	const onClickColorCategory = (value: string,
		event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setColor(value ?? "");
		images.get(currentItemID)?.usersTag.set("color", value);
	};

	/* 처음 불러올때 images.get(currentItemID)?.usersTag.get("main") : undefined -> string 으로 바뀔때 다시 렌더링 하도록*/
	useEffect(() => {
		console.log(images.get(currentItemID)?.usersTag.get("main"));
		setMainCategory(images.get(currentItemID)?.usersTag.get("main") ?? "");
		setSubCategory(images.get(currentItemID)?.usersTag.get("sub") ?? "");
		setGender(images.get(currentItemID)?.usersTag.get("gender") ?? "");
		setColor(images.get(currentItemID)?.usersTag.get("color") ?? "");
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
								} alt="" />
							</div>
							<div id="category-area">
								<ul>
									<p>대분류</p>
									<li>
										{Array.from(clothesTag.keys()).map(i => (
											<button className={`tag-btn ${i === mainCategory ? "selected" : ""}`} onClick={e => onClickMainCategory(i ?? "", e)}>{i}</button>
										))}
									</li>

									<p>소분류</p>
									<li>
										{
											images.get(currentItemID) !== undefined ?
												clothesTag.get(mainCategory)?.map(i => (
													<button className={`tag-btn ${i === subCategory ? "selected" : ""}`} onClick={e => onClickSubCategory(i ?? "", e)} >{i}</button>
												)) : <></>}
									</li>

									<p>성별</p>
									<li>
										{genderTag.map(i => (
											<button className={`tag-btn ${i === gender ? "selected" : ""}`} onClick={e => onClickGenderCategory(i ?? "", e)} >{i}</button>
										))}
									</li>
									<p>색상</p>
									<li>
										{colorTag.map(i => (
											<button className={`tag-btn ${i === color ? "selected" : ""}`} onClick={e => onClickColorCategory(i ?? "", e)} >{i}</button>
										))}
									</li>
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
				}
			</>
		</div>
	);
}
