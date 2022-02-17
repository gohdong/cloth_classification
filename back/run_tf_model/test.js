const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

let classes = fs.readFileSync('./run_tf_model/model2/dict.txt','utf8').split('\n');

exports.excuteModel = async (imgPath) => {
	const model = await tf.loadGraphModel('file://./run_tf_model/model2/model.json');
	let img = processImage(imgPath)
	const prediction = await model.predict(img).dataSync();
	return toJson(prediction)
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

function toJson(data){
	var ob = new Object();
	var arr = new Array();

	for(let [index,element] of data.entries()){
		var tmp = Object();
		tmp.class = classes[index];
		tmp.name = element;
		arr.push(tmp);
	}
	ob.probs = arr;
	return ob;
}


