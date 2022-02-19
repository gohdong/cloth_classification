const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

const classes = fs.readFileSync("./model2/dict.txt", "utf8").split("\n");


function processImage(path) {
	const imageSize = 224;
	const imageBuffer = fs.readFileSync(path); // can also use the async readFile instead
	const size = [imageSize, imageSize];

	// get tensor out of the buffer
	let image = tf.node.decodeImage(imageBuffer, 3);

	// dtype to float
	image = image.cast("float32").div(255);
	// resize the image
	image = tf.image.resizeBilinear(image, size); // can also use tf.image.resizeNearestNeighbor
	image = image.expandDims(); // to add the most left axis of size 1
	return image;
}

function printResult(data) {
	for (const [index, element] of data.entries()) {
		console.log(`${classes[index]} : ${element}`);
	}
}

const excuteModel = async () => {
	const model = await tf.loadGraphModel("file://./model2/model.json");
	const img = processImage("./ex.jpg");
	const prediction = await model.predict(img).dataSync();

	printResult(prediction);
};

console.log(classes);
excuteModel();

