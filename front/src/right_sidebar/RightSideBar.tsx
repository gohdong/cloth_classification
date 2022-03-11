import {useRecoilValue} from "recoil";
import "./RightSideBar.scss";
import {sidebarState} from "../recoil/sidebarState";
import {imageState, selectedItemID} from "../recoil/imageState";


export function ConvertValue({data}: { data: Map<String, Map<String, Number>> | undefined }) {
	if (data === undefined) return null;
	return (
		<>
			{Array.from(data).map(([mainKey, mainValue], i) => (
				<div key={`${mainKey}${i}`}>
					<p className="tag-title">{mainKey.toUpperCase()}</p>
					<ul>
						{Array.from(mainValue).map(([subKey, subValue], j) => (
							<li key={`${subKey}${j}`}>
								<div className="chart-wrap">
									<div className={"chart-background"}>
										<div className={"chart-inner"} style={{
											width: `${(+subValue * 100).toFixed(2)}%`,
										}}>
										</div>
									</div>
									<p>{subKey} {(+subValue * 100).toFixed(2)}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
}


export default function RightSideBar() {
	const isSideBarOpen = useRecoilValue(sidebarState);
	const currentItemID = useRecoilValue(selectedItemID);
	const images = useRecoilValue(imageState);

	return (
		<div id="right-sidebar" className={isSideBarOpen ? "right-sidebar-on" : "right-sidebar-off"}>
			<ConvertValue data={images.get(currentItemID)?.modelProbs}/>
		</div>
	);
}

