# Notification Service

A simple system to send notifications (Email, SMS, In-App) to users using Node.js, MongoDB, and RabbitMQ.

## Features

- POST /notifications → Send a notification
- GET /users/:id/notifications → Get in-app notifications for a user
- Queued processing via RabbitMQ
- Retry logic for failed notifications

## Setup

```bash
git clone <repo>
cd notification-service
npm install
