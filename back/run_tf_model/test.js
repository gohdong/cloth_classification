const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

<<<<<<< HEAD:run_tf_model/test.js
const classes = fs.readFileSync("./model2/dict.txt", "utf8").split("\n");

=======
let classes = fs.readFileSync('./run_tf_model/model2/dict.txt','utf8').split('\n');

exports.excuteModel = async (imgPath) => {
	const model = await tf.loadGraphModel('file://./run_tf_model/model2/model.json');
	let img = processImage(imgPath)
	const prediction = await model.predict(img).dataSync();
	return toJson(prediction)
}
>>>>>>> 88d7814547943675ab47ac16d2aa3579fb5a2a6a:back/run_tf_model/test.js

function processImage(path) {
	const imageSize = 224;
	const imageBuffer = fs.readFileSync(path); // can also use the async readFile instead
	const size = [imageSize, imageSize];

	// get tensor out of the buffer
<<<<<<< HEAD:run_tf_model/test.js
	let image = tf.node.decodeImage(imageBuffer, 3);

=======
	image = tf.node.decodeImage(imageBuffer, 3);
>>>>>>> 88d7814547943675ab47ac16d2aa3579fb5a2a6a:back/run_tf_model/test.js
	// dtype to float
	image = image.cast("float32").div(255);
	// resize the image
	image = tf.image.resizeBilinear(image, size); // can also use tf.image.resizeNearestNeighbor
	image = image.expandDims(); // to add the most left axis of size 1
	return image;
}

<<<<<<< HEAD:run_tf_model/test.js
function printResult(data) {
	for (const [index, element] of data.entries()) {
		console.log(`${classes[index]} : ${element}`);
=======
function toJson(data){
	var ob = new Object();
	var arr = new Array();

	for(let [index,element] of data.entries()){
		var tmp = Object();
		tmp.class = classes[index];
		tmp.name = element;
		arr.push(tmp);
>>>>>>> 88d7814547943675ab47ac16d2aa3579fb5a2a6a:back/run_tf_model/test.js
	}
	ob.probs = arr;
	return ob;
}

<<<<<<< HEAD:run_tf_model/test.js
const excuteModel = async () => {
	const model = await tf.loadGraphModel("file://./model2/model.json");
	const img = processImage("./ex.jpg");
	const prediction = await model.predict(img).dataSync();

	printResult(prediction);
};

console.log(classes);
excuteModel();
=======
>>>>>>> 88d7814547943675ab47ac16d2aa3579fb5a2a6a:back/run_tf_model/test.js

