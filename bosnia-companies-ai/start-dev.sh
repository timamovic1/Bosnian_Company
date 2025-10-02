#!/bin/bash

echo "🚀 Starting Bosnia Companies AI..."
echo ""

echo "📦 Starting backend on port 3001..."
cd backend && npm run dev &
BACKEND_PID=$!

sleep 2

echo ""
echo "🎨 Starting frontend on port 5173..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
