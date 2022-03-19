import {useRecoilValue} from "recoil";
import {editedImagesCountState, imagesSizeState, viewedImagesCountState} from "../recoil/imageState";
import "./BottomStatusBar.scss";
import CheckIcon from "../icons/CheckIcon";
import EditIcon from "../icons/EditIcon";

export default function BottomStatusBar() {
	const totalImagesCount = useRecoilValue(imagesSizeState);
	const viewedImagesCount = useRecoilValue(viewedImagesCountState);
	const editedImagesCount = useRecoilValue(editedImagesCountState);

	return (
		<div id="bottom-status">
			<div>
				<CheckIcon/>
				<p>{viewedImagesCount} / {totalImagesCount} viewed</p>
			</div>
			<div>
				<EditIcon/>
				<p>{editedImagesCount} / {totalImagesCount} edited</p>
			</div>
		</div>
	);
}
