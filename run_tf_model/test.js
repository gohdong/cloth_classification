const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

let classes = fs.readFileSync('./model/dict.txt','utf8').split('\n');

const excuteModel = async () => {
	const model = await tf.loadGraphModel('file://./model/model.json');
	let img = processImage('./ex2.png')
	const prediction = await model.predict(img).dataSync();
	printResult(prediction);

}

function processImage(path) {
	const imageSize = 224
	const imageBuffer = fs.readFileSync(path); // can also use the async readFile instead
	// get tensor out of the buffer
	image = tf.node.decodeImage(imageBuffer, 3);
	// dtype to float
	image = image.cast('float32').div(255);
	// resize the image
	image = tf.image.resizeBilinear(image, size = [imageSize, imageSize]); // can also use tf.image.resizeNearestNeighbor
	image = image.expandDims(); // to add the most left axis of size 1
	return image
}

function printResult(data){
	for(let [index,element] of data.entries()){
		console.log(`${classes[index]} : ${element}`);
	}
}

excuteModel()

