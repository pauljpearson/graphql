

This is based upon
https://medium.com/webill/run-a-federated-graphql-server-with-minikube-1d0f913ee8a8

# minikube install for windows
https://minikube.sigs.k8s.io/docs/start/

New-Item -Path 'c:\' -Name 'minikube' -ItemType Directory -Force
Invoke-WebRequest -OutFile 'c:\minikube\minikube.exe' -Uri 'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe' -UseBasicParsing

## Update Path, restart the command prompt after doing this.
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\minikube'){ `
  [Environment]::SetEnvironmentVariable('Path', $('{0};C:\minikube' -f $oldPath), [EnvironmentVariableTarget]::Machine) `
}

minikube start

minikube dashboard

# install argocd
https://argo-cd.readthedocs.io/en/stable/getting_started/

kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl port-forward svc/argocd-server -n argocd 8080:443

# install argo cli

mkdir argocd
cd .\argocd\
$url = "https://github.com/argoproj/argo-cd/releases/download/" + $version + "/argocd-windows-amd64.exe"
$output = "argocd.exe"
Invoke-WebRequest -Uri $url -OutFile $output

## Update Path, restart the command prompt after doing this.
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\argocd'){ `
    [Environment]::SetEnvironmentVariable('Path', $('{0};C:\argocd' -f $oldPath), [EnvironmentVariableTarget]::Machine) `
}

argocd login 127.0.0.1:8080


# Build Containers, Tag and push to public docker repo
docker build -f .\dockerfiles\accounts.dockerfile -t accounts . && docker tag accounts:latest pauljpearson/accounts:latest && docker push pauljpearson/accounts:latest

docker build -f .\dockerfiles\inventory.dockerfile -t inventory . && docker tag inventory:latest pauljpearson/inventory:latest && docker push pauljpearson/inventory:latest

docker build -f .\dockerfiles\products.dockerfile -t products . && docker tag products:latest pauljpearson/products:latest && docker push pauljpearson/products:latest

docker build -f .\dockerfiles\reviews.dockerfile -t reviews . && docker tag reviews:latest pauljpearson/reviews:latest && docker push pauljpearson/reviews:latest

docker build -f .\dockerfiles\gateway.dockerfile -t gateway . && docker tag gateway:latest pauljpearson/gateway:latest && docker push pauljpearson/gateway:latest


# import in to kubernetes

cd .\manifests\
kubectl apply -f .

# Expose the node port service

In minikube we need to expose the nodeport service.

Note: this will lock the terminal, but will give a url where it is exposed.

```sh
minikube service gateway -n <namespace> --url
```

Then call the url to open the apollo graph studio against the local server

# Next steps..
Run in via argocd.