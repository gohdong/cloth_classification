const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

let classes = fs.readFileSync('./run_tf_model/model2/dict.txt', 'utf8').split('\n');


let main = ["top", "bottom", "one", "outer", "shoes", "acc", "bag"]
let col_std = ["black", "white", "beige", "grey", "blue", "pink", "red", "purple", "orange", "brown", "turquoise", "yellow", "Green", "Khaki"]
let gen_std = ["male", "female", "unisex"]

let sub = new Map();
sub.set("swim", ["top", "bottom", "one"]);
sub.set("sleep", ["top", "bottom", "one"]);
sub.set("under", ["top", "bottom", "one"]);
sub.set("shirt", ["top"]);
sub.set("hoodie", ["top"]);
sub.set("t-shirt", ["top"]);
sub.set("sweater", ["top"]);
sub.set("waistcoat", ["top"]);
sub.set("skirt", ["bottom"]);
sub.set("jean", ["bottom"])
sub.set("legging"["bottom"])
sub.set("short", ["bottom"])
sub.set("trouser", ["bottom"])
sub.set("dress", ["one"])
sub.set("setup", ["one"])
sub.set("jumpsuit", ["one"])
sub.set("cardigan", ["outer"])
sub.set("jacket", ["outer"])
sub.set("blazer", ["outer"])
sub.set("coat", ["outer"])
sub.set("shoes", ["shoes"])
sub.set("acc", ["acc"])
sub.set("bag", ["bag"])

let sub2 = new Map();
sub2.set("black", "color");
sub2.set("white", "color");
sub2.set("beige", "color");
sub2.set("grey", "color");
sub2.set("blue", "color");
sub2.set("pink", "color");
sub2.set("red", "color");
sub2.set("purple", "color");
sub2.set("orange", "color");
sub2.set("brown", "color");
sub2.set("turquoise", "color");
sub2.set("yellow", "color");
sub2.set("green", "color");
sub2.set("khaki", "color");

sub2.set("male", "gender");
sub2.set("female", "gender");
sub2.set("unisex", "gender");

// male", "female", "unisex

var res = new Map();
res.set("top", { value: 0, subcate: [] })
res.set("bottom", { value: 0, subcate: [] })
res.set("one", { value: 0, subcate: [] })
res.set("outer", { value: 0, subcate: [] })
res.set("shoes", { value: 0, subcate: [] })
res.set("acc", { value: 0, subcate: [] })
res.set("bag", { value: 0, subcate: [] })

res.set('gender', { value: 0, subcate: [] });
res.set("color", { value: 0, subcate: [] });




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

function toJson(data) {
	var ob = new Object();

	var map = new Map(res);

	for (let [index, element] of data.entries()) {
		if (main.includes(classes[index])) {
			map.get(classes[index]).value = element;
		} else {
			if (sub.has(classes[index])) {
				for (idx in sub.get(classes[index])) {
					map.get(sub.get(classes[index])[idx]).subcate.push({
						"class": classes[index],
						"value": element
					})
				}
			} else if (sub2.has(classes[index])) {
				map.get(sub2.get(classes[index])).subcate.push({
					"class": classes[index],
					"value": element
				})
			} else {
				console.log("걸러지지 못한 것들 " + classes[index]);
			}
		}
	}
	// console.log(map)
	// ob.probs = arr;
	ob.probs = [];
	new Array(map).sort((a, b) => -1 * (a.value - b.vlaue));
	map.forEach((value, key) => {
		value.subcate.sort((a, b) => -1 * (a.value - b.value));
		ob.probs.push({
			"class": key,
			"value": value.value,
			"subcate": value.subcate
		})
	})

	return ob;
}






