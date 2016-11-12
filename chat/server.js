/**
 * Created by lanou on 16/11/11.
 */
var http=require("http")
var fs=require("fs")
var mime=require("mime")

var server=http.createServer(handle)

//绑定服务器
var io=require("socket.io")(server)
function handle(req,res) {
    var filepath=""
    if(req.url=="/"){
        filepath="./public/html/index.html"
    }else{
        filepath="./public"+req.url
    }
    serverStatic(res,filepath)
}

function serverStatic(res,filepath) {
    fs.exists(filepath,function (exists) {
        if(exists){
            fs.readFile(filepath,function (err,data) {
                if(err){
                    send404(res)
                }
                res.writeHead(200,{"Content-Type":mime.lookup(filepath)})
                res.end(data)
            })
        }else{
            send404(res)
        }
    })
}

var num=0;
io.on('connection', function (socket) {
    //emit(事件名，{发射主题})
    //on(事件名，接收回调)
    //服务端与客户端一一对应
    num++;
    console.log(num)
    function fasong() {
        fs.readFile("./tsconfig.json","utf-8",function (err,data) {
            if(err){return}
            var data=JSON.parse(data)
            io.sockets.emit('ret',{ hello: data.mesg ,num:num});

        })
    }
    fasong()


    socket.on('message', function (info) {
        fs.readFile("./tsconfig.json","utf-8",function (err,data) {
            if(err){return}
            var data=JSON.parse(data)
            data.mesg.push(info)
            //console.log(data)

            fs.writeFile("./tsconfig.json",JSON.stringify(data),function () {
                fasong()
            })
        })

    });

});


function send404(res) {
    res.writeHead(404,{"Content-Type":"text/plain"})
    res.end("404 NOT FOUND")
}
server.listen(3000,function () {
    
})