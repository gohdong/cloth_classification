import React from "react";
import SkeletonElement from "./SkeletonsElements";
import "./Skeleton.scss";
import Shimmer from "../skeletons/Shimmer";

const SkeletonMain = () => (
	<div className="skeleton-wrap">
		<div className="skeleton-article">
			<SkeletonElement type="main_image" />
		</div>
		<Shimmer/>
	</div>
);

export default SkeletonMain;
