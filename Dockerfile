# Use official Nginx image
FROM nginx:alpine

# Copy all HTML files and assets to nginx path
COPY *.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY Image/ /usr/share/nginx/html/Image/

EXPOSE 80