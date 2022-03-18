import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import "./RightSideBar.scss";
import {sidebarState} from "../recoil/sidebarState";
import {imageState, selectedItemID} from "../recoil/imageState";
import SkeletonRight from "../skeletons/SkeletonRight";

export function convertValue(data: Map<String, Map<String, Number>> | undefined) {
	if (data === undefined) return null;
	return (
		<>
			{Array.from(data).map(([mainKey, mainValue], i) => (
				<div key={i}>
					<p className="tag-title">{mainKey.toUpperCase()}</p>
					<ul>
						{Array.from(mainValue).map(([subKey, subValue], j) => (
							<>
								<li key={j}>
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
							</>
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
	const [clothes, setClothes] = useState(null as any);

	useEffect(() => {
		setTimeout(async () => {
			const data = await String;

			setClothes(data);
		}, 2000);
	});

	return (
		<div id="right-sidebar" className={isSideBarOpen ? "right-sidebar-on" : "right-sidebar-off"}>
			{clothes && (
				convertValue(images.get(currentItemID)?.modelProbs)
			)}
			{!clothes && <SkeletonRight/>}
		</div>
	);
}

