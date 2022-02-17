import express from "express";
import multer from "multer";
import path from "path";
import {createConnection} from "mysql"
import {excuteModel} from "../run_tf_model/test"

class App {
  public application : express.Application;
  constructor(){
    this.application = express();
  }
}
const con = createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Xptmxm1212!@',
  database : 'clothes_tag'
});

const app = new App().application;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get("/",(req : express.Request , res : express.Response) =>{
  res.send("server start");
})

const check =  multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'checks/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

app.post('/check', check.single('img'), async(req, res) => {  //유저가 사진을 보내면 판단후 리턴
  console.log(req.file); 
  let file = req.file;
  var tmp = await excuteModel(file?.path);
  res.json(tmp);
});

const upload =  multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});
app.post('/upload', upload.single('img'), async(req, res) => {  //유저가 태그를 수정하고 업로드하면 다시 저장
  // console.log(req.file);
  // console.log(req.body['tags'])
  con.connect();

  // var query = `INSERT INTO upload(img_path,user_id,tags,uploaded_at) VALUES ('${req.file.path}',1,'${req.body['tags']}',CURRENT_TIMESTAMP)`
  // console.log(query);
  // con.query(query)

  con.end();

  res.json("Upload img");
});



app.listen(4000,()=>console.log("start"));