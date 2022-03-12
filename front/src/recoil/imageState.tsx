import {atom, selector} from "recoil";


export interface Image {
	id: string,
	file: File,
	edited: boolean,
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
		const text = get(imageState);

		return text.size;
	},
});

export const selectedItemID = atom({
	key: "selectedItemID",
	default: "",
});

