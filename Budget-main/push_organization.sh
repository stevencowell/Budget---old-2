#!/bin/bash

# Script to organize files and push changes to GitHub
# This script will:
# 1. Run the organization script
# 2. Stage all changes
# 3. Commit with a descriptive message
# 4. Push to the current branch

set -e  # Exit on any error

echo "=================================================="
echo "GitHub File Organization Script"
echo "=================================================="
echo ""

# Get current branch name
BRANCH_NAME=$(git branch --show-current)
echo "Current branch: $BRANCH_NAME"
echo ""

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "⚠️  Warning: You have uncommitted changes."
    read -p "Do you want to continue? (yes/no): " continue_response
    if [[ ! "$continue_response" =~ ^(yes|y)$ ]]; then
        echo "Operation cancelled."
        exit 1
    fi
fi

# Run the organization script
echo "Step 1: Running file organization script..."
python3 organize_files.py

# Check if organization was successful
if [ $? -ne 0 ]; then
    echo "❌ File organization failed. Aborting."
    exit 1
fi

echo ""
echo "Step 2: Staging changes..."
git add .

# Show what will be committed
echo ""
echo "Step 3: Review changes to be committed..."
git status
echo ""

# Create commit message
COMMIT_MSG="chore: Organize root directory files into subdirectories

- Moved documentation files to docs/
- Moved data files (CSV, Excel) to data/
- Moved personal documents to personal/
- Moved shell scripts to scripts/
- Kept README.md in root directory
- Improved project structure and maintainability"

echo "Commit message:"
echo "----------------------------------------"
echo "$COMMIT_MSG"
echo "----------------------------------------"
echo ""

read -p "Do you want to commit these changes? (yes/no): " commit_response
if [[ ! "$commit_response" =~ ^(yes|y)$ ]]; then
    echo "Commit cancelled. Changes are staged but not committed."
    exit 0
fi

# Commit changes
echo ""
echo "Step 4: Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo ""
echo "Step 5: Pushing to GitHub..."
read -p "Do you want to push to origin/$BRANCH_NAME? (yes/no): " push_response
if [[ ! "$push_response" =~ ^(yes|y)$ ]]; then
    echo "Push cancelled. Changes are committed locally."
    echo "You can push later with: git push origin $BRANCH_NAME"
    exit 0
fi

git push origin "$BRANCH_NAME"

echo ""
echo "=================================================="
echo "✅ SUCCESS!"
echo "=================================================="
echo ""
echo "Files have been organized and pushed to GitHub."
echo "Branch: $BRANCH_NAME"
echo ""
echo "Summary of changes:"
echo "  - Documentation files → docs/"
echo "  - Data files → data/"
echo "  - Personal documents → personal/"
echo "  - Shell scripts → scripts/"
echo ""
