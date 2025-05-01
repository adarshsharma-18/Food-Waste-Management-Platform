#!/bin/bash

# Food Waste Management Platform - Kubernetes Deployment Script
# This script builds and deploys the static website to Kubernetes

# Step 1: Set your Docker Hub username
echo "Enter your Docker Hub username:"
read DOCKER_USERNAME

# Step 2: Build the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_USERNAME/food-waste-app:latest .

# Step 3: Log in to Docker Hub
echo "Logging in to Docker Hub..."
docker login

# Step 4: Push the image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push $DOCKER_USERNAME/food-waste-app:latest

# Step 5: Update the Kubernetes deployment file with your Docker username
echo "Updating Kubernetes deployment file..."
sed -i "s/\${DOCKER_USERNAME}/$DOCKER_USERNAME/g" k8s-deployment.yaml

# Step 6: Apply the Kubernetes deployment
echo "Applying Kubernetes deployment..."
kubectl apply -f k8s-deployment.yaml

# Step 7: Apply the Kubernetes service
echo "Applying Kubernetes service..."
kubectl apply -f k8s-service.yaml

# Step 8: Wait for the external IP to be assigned
echo "Waiting for external IP to be assigned..."
echo "This may take a few minutes..."

# Step 9: Get the service details
echo "Getting service details..."
kubectl get svc food-waste-service

echo ""
echo "Deployment complete! Access your website at the EXTERNAL-IP shown above."
echo "If EXTERNAL-IP shows <pending>, wait a few minutes and run: kubectl get svc food-waste-service"
echo "If using Minikube, run 'minikube tunnel' in a separate terminal to expose the LoadBalancer."