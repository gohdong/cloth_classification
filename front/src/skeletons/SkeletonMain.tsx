import React from "react";
import "./Skeleton.scss";
import Shimmer from "../skeletons/Shimmer";
import {bigCategory, categoryToKR, color, colorToKR, gender, smallCategory} from "../main/category";

export default function SkeletonMain() {
	return <div id="main-skeleton-wrap">
		<div className="image-wrap">
			<div/>
		</div>
		<div id="main-bottom">
			<div id="category-area">
				<div id="main-bottom-left">
					<h3>대분류</h3>
					<div className="buttons-wrap">
						{
							bigCategory.map((value, index) =>
								<div key={value} className={`category-buttons`}>
									{categoryToKR.get(value)}
								</div>,
							)
						}
					</div>
					<h3>소분류</h3>
					<div className="buttons-wrap">
						{
							smallCategory.get("top")?.map((value, index) =>
								<div key={value} className={`category-buttons`}>
									{categoryToKR.get(value)}
								</div>,
							)
						}
					</div>
				</div>
				<div id="main-bottom-right">
					<h3>성별</h3>
					<div className="buttons-wrap">
						{
							gender.map((value, index) =>
								<div key={value} className={`category-buttons`}>
									{categoryToKR.get(value)}
								</div>,
							)
						}
					</div>
					<h3>색상</h3>
					<div className="buttons-wrap">
						{
							color.map((value, index) =>
								<div
									className={`category-buttons`}
									key={value}>
									{colorToKR.get(value)}
								</div>,
							)
						}
					</div>
				</div>

			</div>
		</div>
		<Shimmer/>
	</div>;
}

