import {useRecoilValue, useSetRecoilState} from "recoil";
import {CSVLink} from "react-csv";
import {Data} from "react-csv/components/CommonPropTypes";
import "./AppBar.scss";
import ViewSideBar from "../icons/ViewSideBarIcon";
import {sidebarState} from "../recoil/sidebarState";
import ExportIcon from "../icons/ExportIcon";
import {imageState} from "../recoil/imageState";

function AppBar() {
	const setSidebarOpen = useSetRecoilState(sidebarState);
	const images = useRecoilValue(imageState);
	const onClickButton = () => {
		setSidebarOpen(prev => !prev);
	};


	const getData = () => {
		const tempData:Data = [["filename", "mainCategory", "subCategory", "gender", "color"]];

		for (const [, value] of images) {
			tempData.push([value.file.name, value.usersTag.get("main"), value.usersTag.get("sub"), value.usersTag.get("gender"), value.usersTag.get("color")]);
		}
		return tempData;
	};

	return (
		<div id={"app-bar"}>
			<div className="app-bar-wrap">
				<p>LIKE A BLUE PIG</p>
				<div>
					<CSVLink
						data={getData()}
						filename="cloth_classification.csv"
						target="_blank"
					>
						<button>
							<ExportIcon/>
						</button>
					</CSVLink>
					{/* <button onClick={onClickExport}>*/}
					{/*	<ExportIcon/>*/}
					{/* </button>*/}
					<button onClick={onClickButton}>
						<ViewSideBar/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default AppBar;
