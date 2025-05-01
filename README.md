# Food Waste Management Platform

A web-based platform to help reduce food waste by connecting food donors with collectors and those in need.

## Project Structure

```
├── src/
│   ├── pages/          # HTML pages
│   ├── styles/         # CSS stylesheets
│   ├── scripts/        # JavaScript files
│   └── assets/         # Images and other static assets
├── public/             # Public assets and files
├── docs/               # Documentation
├── k8s-deployment.yaml # Kubernetes deployment configuration
├── k8s-service.yaml    # Kubernetes service configuration
├── deploy.bat          # Windows deployment script
└── deploy.sh           # Linux/Mac deployment script
```

## Features

- User registration and login
- Food donation management
- Food collection requests
- Responsive design
- User-friendly interface

## Setup

### Local Development

1. Clone the repository
2. Open `index.html` in your web browser
3. Start contributing!

### Kubernetes Deployment

This project supports deployment to Kubernetes clusters. You can deploy the application using one of the following methods:

#### Option 1: Using the Deployment Script (Windows)

1. Open Command Prompt or PowerShell
2. Navigate to your project directory
3. Run the deployment script:

```
deploy.bat
```

#### Option 2: Using the Deployment Script (Linux/Mac)

1. Open Terminal
2. Navigate to your project directory
3. Make the script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option 3: Manual Deployment

1. Build the Docker image
```bash
docker build -t yourusername/food-waste-app:latest .
```

2. Push the image to Docker Hub
```bash
docker login
docker push yourusername/food-waste-app:latest
```

3. Update the Kubernetes deployment file
   - Edit `k8s-deployment.yaml` and replace the image name with your Docker Hub username

4. Apply the Kubernetes deployment and service
```bash
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

5. Access the application using the external IP
```bash
kubectl get svc food-waste-service
```

For more detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Feel free to submit issues and pull requests to improve the platform.

## License

This project is open source and available under the MIT License.
 
