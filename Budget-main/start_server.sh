#!/bin/bash
# Start the Cowell Family Budget Command Centre

echo "🚀 Starting Cowell Family Budget Command Centre..."
echo ""
echo "📊 Regenerating financial data..."
python3 scripts/generate_data.py

echo ""
echo "🌐 Starting web server on port 8000..."
echo "📱 Open your browser to: http://localhost:8000/web/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000