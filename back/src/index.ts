import express from "express";
import {excuteModel} from "../run_tf_model/test"


const path = '/Users/woowang/Desktop/cloth_classification';
// const cors = require('cors');
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true
// }

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

const app = new App().application;
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req: express.Request, res: express.Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send("server start");
})


// app.post('/check', check.single('img'), async (req, res) => {  //유저가 사진을 보내면 판단후 리턴
//   res.header("Access-Control-Allow-Origin", "*");
//   console.log(req.body);
//   let file = req.file;
//   var tmp = await excuteModel(file?.path);
//   console.log(tmp);
//   res.json(tmp);
// });
app.post('/check', async (req, res) => {  //유저가 사진을 보내면 판단후 리턴
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  // TODO -> uplaods를 removed로 바꿔야함
  let imagePath = path+'/uploads/'+req.body['img'];

  var tmp = await excuteModel(imagePath);
  console.log(tmp);
  res.json(tmp);
});

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().valueOf() + path.extname(file.originalname));
//     }
//   }),
// });


// app.use(cors(corsOptions));
app.listen(4000, () => console.log("start"));