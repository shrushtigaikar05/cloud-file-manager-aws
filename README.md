# Cloud File Management and Secure Sharing System using AWS

## Project Description

This project is a cloud-based file management web application developed using AWS services.

It allows users to upload, view, download, share, and delete files securely through a web interface.

The project uses a serverless AWS architecture, so no physical hardware or traditional server is required.

## Features

- Upload files
- View uploaded files
- Display file size and last modified date
- Download files
- Generate secure file sharing links
- Delete files
- Cloud-based file storage
- Secure access using AWS services

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### AWS Services
- Amazon S3
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Cognito
- AWS IAM
- Amazon CloudWatch

## AWS Architecture

User
↓
Web Application
↓
Amazon API Gateway
↓
AWS Lambda
↓
Amazon S3
↓
File Storage

DynamoDB is used to store file metadata.

## How It Works

1. The user selects a file from the web application.
2. The frontend sends a request to API Gateway.
3. API Gateway invokes an AWS Lambda function.
4. Lambda generates a secure upload URL.
5. The file is uploaded and stored in Amazon S3.
6. File information is retrieved and displayed in the application.
7. For downloading, Lambda generates a temporary secure presigned URL.
8. The user can download the file through the generated URL.

## AWS Security

- Amazon S3 is used for secure file storage.
- IAM controls AWS permissions.
- Presigned URLs are used for temporary file access.
- AWS Lambda handles backend operations without exposing server credentials.

## Project Structure

```text
CloudFileManager/
│
├── index.html
├── style.css
├── app.js
└── README.md
