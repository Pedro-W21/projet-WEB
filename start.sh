docker pull mongodb/mongodb-community-server:latest
docker run -t --name mongo-test -p 27017:27017 -d mongodb/mongodb-community-server:latest
docker start mongo-test

cd projet-web-backend
npm install
cd ..


bash -c "exec -a backend_insapp node projet-web-backend/index.js" &
# Start-Process -NoNewWindow -ArgumentList "node", "projet-web-backend/index.js" -WorkingDirectory "C:\path\to\your\project" -PassThru | ForEach-Object { $_.Id = "backend_insapp" }


cd projet-web
npm install

npm start -- --hostname 0.0.0.0