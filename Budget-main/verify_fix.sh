#!/bin/bash
echo "========================================="
echo "  VERIFICATION: Cowell Budget App Fix"
echo "========================================="
echo ""

# Check if server is running
if ps aux | grep -q "[p]ython.*http.server 8000"; then
    echo "✅ Web Server: RUNNING on port 8000"
else
    echo "❌ Web Server: NOT RUNNING"
    echo "   Start with: ./start_server.sh"
    exit 1
fi

# Check if data file exists
if [ -f "data/financial_overview.json" ]; then
    echo "✅ Data File: EXISTS ($(du -h data/financial_overview.json | cut -f1))"
else
    echo "❌ Data File: MISSING"
    echo "   Generate with: python3 scripts/generate_data.py"
    exit 1
fi

# Check if data is accessible via HTTP
if curl -s -f http://localhost:8000/data/financial_overview.json > /dev/null; then
    echo "✅ Data HTTP Access: WORKING"
else
    echo "❌ Data HTTP Access: FAILED"
    exit 1
fi

# Check if web page is accessible
if curl -s -f http://localhost:8000/web/ > /dev/null; then
    echo "✅ Web Page: ACCESSIBLE"
else
    echo "❌ Web Page: NOT ACCESSIBLE"
    exit 1
fi

# Check transaction count
TRANSACTIONS=$(python3 -c "import json; print(len(json.load(open('data/financial_overview.json'))['recent_transactions']))" 2>/dev/null)
if [ ! -z "$TRANSACTIONS" ]; then
    echo "✅ Transactions: $TRANSACTIONS loaded"
else
    echo "❌ Transactions: COULD NOT READ"
    exit 1
fi

echo ""
echo "========================================="
echo "  ✅ ALL CHECKS PASSED!"
echo "========================================="
echo ""
echo "🎉 Your app is ready to use!"
echo "🌐 Open in browser: http://localhost:8000/web/"
echo ""
