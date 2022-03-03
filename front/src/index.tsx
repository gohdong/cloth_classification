import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// eslint-disable-next-line no-unused-vars,import/first
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue} from "recoil";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<App/>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
