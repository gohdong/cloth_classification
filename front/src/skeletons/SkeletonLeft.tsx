import React from "react";
import SkeletonElement from "./SkeletonsElements";
import "./Skeleton.scss";
import Shimmer from "../skeletons/Shimmer";

const SkeletonLeft = () => (
	<div>
		<div>
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
			<SkeletonElement type="left_image" />
		</div>
		<Shimmer/>
	</div>
);

export default SkeletonLeft;
