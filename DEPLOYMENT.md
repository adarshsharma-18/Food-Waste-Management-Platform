# Kubernetes Deployment Guide for Food Waste Management Platform

This guide will help you deploy your static website to Kubernetes using a LoadBalancer service.

## Prerequisites

Before you begin, make sure you have the following installed:

- Docker
- Kubernetes cluster (Minikube, Docker Desktop with Kubernetes, or a cloud provider)
- kubectl command-line tool

## Deployment Steps

### Option 1: Using the Deployment Script (Windows)

1. Open Command Prompt or PowerShell
2. Navigate to your project directory
3. Run the deployment script:

```
deploy.bat
```

### Option 2: Using the Deployment Script (Linux/Mac)

1. Open Terminal
2. Navigate to your project directory
3. Make the script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 3: Manual Deployment

1. **Build the Docker image**

```bash
docker build -t yourusername/food-waste-app:latest .
```

2. **Push the image to Docker Hub**

```bash
docker login
docker push yourusername/food-waste-app:latest
```

3. **Update the Kubernetes deployment file**

Edit `k8s-deployment.yaml` and replace `${DOCKER_USERNAME}` with your Docker Hub username.

4. **Apply the Kubernetes deployment and service**

```bash
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

5. **Check the service status**

```bash
kubectl get svc food-waste-service
```

## Accessing Your Website

Once deployed, you can access your website using the EXTERNAL-IP assigned to the LoadBalancer service:

```
http://<EXTERNAL-IP>
```

## Troubleshooting

- **Pending External IP**: If the EXTERNAL-IP shows as `<pending>`, it might be because:
  - You're using Minikube: Run `minikube tunnel` in a separate terminal
  - Your cloud provider is still provisioning the LoadBalancer

- **Pod Issues**: Check pod status with:
  ```bash
  kubectl get pods
  kubectl describe pod <pod-name>
  kubectl logs <pod-name>
  ```

- **Service Issues**: Check service details with:
  ```bash
  kubectl describe service food-waste-service
  ```

## Cleaning Up

To remove the deployment and service:

```bash
kubectl delete -f k8s-service.yaml
kubectl delete -f k8s-deployment.yaml
```