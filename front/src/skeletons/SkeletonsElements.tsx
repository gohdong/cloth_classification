import React from "react";
import "./Skeleton.scss";


const SkeletonElement = ({type} : {type:any}) => {
	const classes = `skeleton ${type}`;

	return (
		<div className={classes}></div>
	);
};

export default SkeletonElement;
