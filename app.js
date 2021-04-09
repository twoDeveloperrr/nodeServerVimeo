var express = require('express'); // express 관련된 파일을 가져옴
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
// 서버가 동작될 때 까지 기다리지 않고 미리 시작함 비동기
var mariadb = require('mariadb');

//mariadb 연동
var pool = mariadb.createPool({
  host : '127.0.0.1',
  port : '3306',
  user : 'Two',
  password : 'asdf#120548',
  database : 'webDB'
});
//pool.connect();


app.listen(3000, function() {
  console.log("start! express server on port 3000");
}); //3000 이라는 포트를 기반으로 함수를 실행

app.use(express.static('public'));
//express static이라는 함수에  디렉토리 public을 넣어줄
app.use(bodyParser.json()); //json 형식으로 올 경우
app.use(bodyParser.urlencoded({extended:true}));
//그냥 post 방식으로 올 경우
//server와 client 간 소통을 할 경우 인코드해서 데이터를 주고 받음

app.set('veiw engine', 'ejs');

app.use(cors());

//url routing
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/main.html");
   //html 파일을 줘!, 절대경로를 줘야 한다.
   // __dirname 상위 루트 값이 담겨져 있음(Node에서 제공)
});

app.post('/email_post', function(req, res) {
  console.log(req.body.email);
  //res.send("<h1>Welcome! "+ req.body.email + " </h1>");

  res.render('email.ejs', {'email':req.body.email});
});
// ejs에 req.body.email 데이터가 섞여서 email.ejs 에서 email 이라는 name 값을 찾아서 req.body.email 값으로 치환한 다음 브라우저(client) 에 응답(res)

//post 방식은 url에 정보가 담겨있지 않음(중요한 정보를 보낼 때는 post로 보냄)
//get 방식은 url에 정보가 담겨있음

app.post('/ajax_send_email', function(req,res){
  var email = req.body.email;
  var responseData = {};
  const connection = pool.getConnection(conn => conn);

  var query = connection.query(`select email from user where email = " ";` + email + " ", function(err, rows) {
    if(err) throw err;
    if(rows[0]) {
      console.log(rows[0]);
    } else {
      console.log('none : ' + rows[0]);
    }
  });
  //console.log(req.body.email);
  //var responseData = {'result' : 'ok', 'email' : req.body.email};

  //res.json(responseData);
});
