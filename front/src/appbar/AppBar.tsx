import {useRecoilValue, useSetRecoilState} from "recoil";
import {CSVLink} from "react-csv";
import {Data} from "react-csv/components/CommonPropTypes";
import "./AppBar.scss";
import ViewSideBar from "../icons/ViewSideBarIcon";
import {sidebarState} from "../recoil/sidebarState";
import ExportIcon from "../icons/ExportIcon";
import {imagesSizeState, imageState, viewedImagesCountState} from "../recoil/imageState";

function AppBar() {
	const setSidebarOpen = useSetRecoilState(sidebarState);
	const images = useRecoilValue(imageState);
	const totalImagesCount = useRecoilValue(imagesSizeState);
	const viewedImagesCount = useRecoilValue(viewedImagesCountState);
	const onClickButton = () => {
		setSidebarOpen(prev => !prev);
	};


	const getData = () => {
		const tempData:Data = [["filename", "mainCategory", "subCategory", "gender", "color"]];

		for (const [, value] of images) {
			value.viewed && tempData.push([value.file.name, value.usersTag.get("main"), value.usersTag.get("sub"), value.usersTag.get("gender"), value.usersTag.get("color")]);
		}

		return tempData;
	};

	const onClickExport = () => {
		if (!totalImagesCount) {
			alert("내보낼 이미지가 없습니다.");
		} else if (totalImagesCount !== viewedImagesCount) {
			alert("확인하지 않은 이미지들은 생략됩니다.");
			document.getElementById("csv-download")!.click();
		} else {
			document.getElementById("csv-download")!.click();
		}
	};

	return (
		<div id={"app-bar"}>
			<div className="app-bar-wrap">
				<p>LIKE A BLUE PIG</p>
				<div>
					<CSVLink
						data={getData()}
						id="csv-download"
						style={{display: "hidden"}}
						filename="cloth_classification.csv"
						target="_blank"
					/>
					<button onClick={onClickExport}>
						<ExportIcon/>
					</button>
					<button className="sidebar-button" onClick={onClickButton}>
						<ViewSideBar/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default AppBar;
