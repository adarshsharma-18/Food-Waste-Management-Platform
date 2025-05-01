@echo off
REM Food Waste Management Platform - Kubernetes Deployment Script for Windows
REM This script builds and deploys the static website to Kubernetes

REM Step 1: Set your Docker Hub username
set /p DOCKER_USERNAME=Enter your Docker Hub username: 

REM Step 2: Build the Docker image
echo Building Docker image...
docker build -t %DOCKER_USERNAME%/food-waste-app:latest .

REM Step 3: Log in to Docker Hub
echo Logging in to Docker Hub...
docker login

REM Step 4: Push the image to Docker Hub
echo Pushing image to Docker Hub...
docker push %DOCKER_USERNAME%/food-waste-app:latest

REM Step 5: Update the Kubernetes deployment file with your Docker username
echo Updating Kubernetes deployment file...
powershell -Command "(Get-Content k8s-deployment.yaml) -replace '\${DOCKER_USERNAME}', '%DOCKER_USERNAME%' | Set-Content k8s-deployment.yaml"

REM Step 6: Apply the Kubernetes deployment
echo Applying Kubernetes deployment...
kubectl apply -f k8s-deployment.yaml

REM Step 7: Apply the Kubernetes service
echo Applying Kubernetes service...
kubectl apply -f k8s-service.yaml

REM Step 8: Wait for the external IP to be assigned
echo Waiting for external IP to be assigned...
echo This may take a few minutes...

REM Step 9: Get the service details
echo Getting service details...
kubectl get svc food-waste-service

echo.
echo Deployment complete! Access your website at the EXTERNAL-IP shown above.
echo If EXTERNAL-IP shows ^<pending^>, wait a few minutes and run: kubectl get svc food-waste-service
echo If using Minikube, run 'minikube tunnel' in a separate terminal to expose the LoadBalancer.

pause