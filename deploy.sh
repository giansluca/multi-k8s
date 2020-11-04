docker build -t gianlucamori/multi-client:latest -t gianlucamori/multi-client:$GIT_SHA  -f ./client/Dockerfile ./client
docker build -t gianlucamori/multi-api:latest -t gianlucamori/multi-api:$GIT_SHA -f ./api/Dockerfile ./api
docker build -t gianlucamori/multi-worker:latest -t gianlucamori/multi-worker:$GIT_SHA -f ./worker/Dockerfile ./worker

docker push gianlucamori/multi-client:latest
docker push gianlucamori/multi-api:latest
docker push gianlucamori/multi-worker:latest

docker push gianlucamori/multi-client:$GIT_SHA
docker push gianlucamori/multi-api:$GIT_SHA
docker push gianlucamori/multi-worker:$GIT_SHA

# kubectl apply -f k8s/
# kubectl set image deployment/client-deployment client=gianlucamori/multi-client:$GIT_SHA
# kubectl set image deployment/api-deployment api=gianlucamori/multi-api:$GIT_SHA
# kubectl set image deployment/worker-deployment worker=gianlucamori/multi-worker:$GIT_SHA