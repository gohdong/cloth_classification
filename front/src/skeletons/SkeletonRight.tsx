import React from "react";
import SkeletonElement from "./SkeletonsElements";
import "./Skeleton.scss";
import Shimmer from "../skeletons/Shimmer";

const SkeletonRight = () => (
	<div className="skeleton-wrapper">
		<div className="skeleton-article">
			<SkeletonElement type="text" />
			<SkeletonElement type="text" />
			<SkeletonElement type="text" />
			<SkeletonElement type="text" />
			<SkeletonElement type="text" />
		</div>
		<Shimmer/>
	</div>
);

export default SkeletonRight;
