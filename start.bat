docker pull mongodb/mongodb-community-server:latest
docker run -t --name mongo-test -p 27017:27017 -d mongodb/mongodb-community-server:latest
docker start mongo-test

cd projet-web-backend
npm install
cd ..

$myLabel = 'MyImportantScript'
$argList = @(
    '-NoLogo'
    '-NoProfile'
    '-NoExit'
    '-Command "node projet-web-backend/index.js"'
    "-CustomPipeName '$myLabel'"
)

Start-Process -FilePath 'powershell.exe' -ArgumentList $argList

cd projet-web
npm install

npm start

cd ..