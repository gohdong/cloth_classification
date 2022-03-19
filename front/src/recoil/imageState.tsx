import {atom, selector} from "recoil";


export interface Image {
	id: string,
	file: File,
	edited: boolean,
	viewed: boolean,
	usersTag: Map<string, string>,
	modelResultTag: Map<string, string>,
	modelProbs: Map<string, Map<string, Number>>,
}


export const imageState = atom<Map<string, Image>>({
	key: "images",
	default: new Map(),
});

export const imagesSizeState = selector<number>({
	key: "imagesCount", // unique ID (with respect to other atoms/selectors)
	get: ({get}) => {
		const images = get(imageState);

		return images.size;
	},
});

export const viewedImagesCountState = selector<number>({
	key: "viewedImagesCount", // unique ID (with respect to other atoms/selectors)
	get: ({get}) => {
		let result = 0;
		const images = get(imageState);

		for (const [, value] of images) {
			value.viewed && (result += 1);
		}

		return result;
	},
});

export const editedImagesCountState = selector<number>({
	key: "editedImagesCount", // unique ID (with respect to other atoms/selectors)
	get: ({get}) => {
		let result = 0;
		const images = get(imageState);

		for (const [, value] of images) {
			value.edited && (result += 1);
		}
		return result;
	},
});


export const selectedItemID = atom({
	key: "selectedItemID",
	default: "",
});

