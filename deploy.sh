docker build -t gianlucamori/multi-client -f ./client/Dockerfile ./client
docker build -t gianlucamori/multi-api -f ./api/Dockerfile ./api
docker build -t gianlucamori/multi-worker -f ./worker/Dockerfile ./worker
docker push gianlucamori/multi-client
docker push gianlucamori/multi-api
docker push gianlucamori/multi-worker