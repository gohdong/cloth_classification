import {useSetRecoilState} from "recoil";
import "./AppBar.scss";
import ViewSideBar from "../icons/ViewSideBar";
import {sidebarState} from "../recoil/sidebarState";

function AppBar() {
	const setSidebarOpen = useSetRecoilState(sidebarState);
	const onClickButton = () => {
		setSidebarOpen(prev => !prev);
	};

	return (
		<div id={"app-bar"}>
			<div className="app-bar-wrap">
				<p>LIKE A BLUE PIG</p>
				<button onClick={onClickButton}>
					<ViewSideBar/>
				</button>
			</div>
		</div>
	);
}

export default AppBar;
