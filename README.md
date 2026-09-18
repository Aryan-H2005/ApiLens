# 🔍 ApiLens — API Inspector

ApiLens is a modern API inspection and testing tool that allows developers to send HTTP requests, inspect API responses, view response headers, measure response time, and maintain request history through a clean, responsive interface.

## 🚀 Live Demo

- Frontend: https://apilens-uutx.onrender.com/
- Backend API: https://apilens-api-mcad.onrender.com/

## ✨ Features

- Send HTTP requests using:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
- Custom request headers
- JSON request body support
- Response status and status text
- Response time measurement
- Response headers inspection
- Formatted JSON response viewer
- Copy response JSON
- Request history
- Request statistics
- Dark / Light mode
- Responsive UI
- REST API testing through an Express backend
- External API requests using Axios

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Axios
- CORS

## 🏗️ Project Architecture

```text
                ┌─────────────────────┐
                │     React Client    │
                │   Vite + Tailwind   │
                └──────────┬──────────┘
                           │
                           │ HTTP Request
                           ▼
                ┌─────────────────────┐
                │   Express Backend   │
                │      Node.js        │
                └──────────┬──────────┘
                           │
                           │ Axios
                           ▼
                ┌─────────────────────┐
                │    External API     │
                └──────────┬──────────┘
                           │
                           │ Response
                           ▼
                ┌─────────────────────┐
                │     ApiLens UI      │
                │ Status / Headers /  │
                │ Response / Timing   │
                └─────────────────────┘
