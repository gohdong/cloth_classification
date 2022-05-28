## h2 데이터 베이스 다운로드 https://www.h2database.com/html/download.html
version : 2.1.212
h2.sh 실행 (5050 포트에 데이터베이스 올림)
최초로 '~/test.mv.db' 생성을 위해 jdbc:h2:~/test 로 접속
그 후 jdbc:h2:tcp://localhost/~/test 로 접속

## 서버 실행 순서
1. h2 서버실행 (5050) -> {h2 Dir}/bi에서 ./h2.sh
2. spring 서버 실행 (8080) 
3. flask 서버 실행 (5000) -> rembg s
4. node 서버 실행 (4000) -> back dir 에서 npm start
5. react 서버 실행 (3000) -> front dir 에서 npm start

## 변경 사항
기존 : react -> nodejs
변경 : react -> spring -> flask -> nodejs

react   : client
spring  : router
flask   : background removal model
nodejs  : category classify model


1. client 가 사진 request
2. spring이 request에서 사진을 uploads 폴더에 저장 후 flask로 누끼따기 작업 request
3. spring이 flask에서 전송한 response의 누끼따진 사진을 removed 폴더에 저장 후 nodejs 로 판별 request
4. spring은 nodejs 응답을 react에 전달


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

test

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
