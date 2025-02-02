const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir = 'public/',
      port = 3000

const appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
  console.log(request.url);
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if (request.url === '/results') {
    sendTextToClient(response, JSON.stringify(appdata));
  }
  else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let result = JSON.parse(dataString);
    let newResult = {
      taskName: result.taskName,
      taskDescription: result.taskDescription,
      assignerFirstName: result.assignerFirstName,
      assignerLastName: result.assignerLastName,
      assigneeFirstName: result.assigneeFirstName,
      assigneeLastName: result.assigneeLastName,
      assigneeEmail: `${result.assigneeLastName}.${result.assigneeFirstName}@TAsforthisclassarecool.com`,
    }
    console.log(newResult);
    appdata.push(newResult);
    console.log(appdata.length);

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end('test')
  })
}

const sendTextToClient = function(response, text) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(text);
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
