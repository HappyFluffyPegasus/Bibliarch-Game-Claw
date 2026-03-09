#!/bin/bash
# Master script to create all GitHub issues
# Usage: ./create-all-issues.sh

set -e

echo "======================================"
echo "Bibliarch OG MVP - GitHub Issues Creator"
echo "======================================"
echo ""
echo "This script will create 14 GitHub issues with 85+ user stories"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✓ GitHub CLI is installed and authenticated"
echo ""

# Confirm
read -p "Create all 14 issues? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo ""
echo "Creating issues..."
echo ""

# Run each part
chmod +x create-issues-part1.sh create-issues-part2.sh create-issues-part3.sh

echo "Part 1/3: Issues 1-5 (World Archive, Heightmap, Procedural, Entity Brush, LOD)"
./create-issues-part1.sh

echo ""
echo "Part 2/3: Issues 6-10 (Terrain Editor, Events, Weather, Map Editor, Prefabs)"
./create-issues-part2.sh

echo ""
echo "Part 3/3: Issues 11-14 (Cartography, Interior, Enhanced World Builder, Engine)"
./create-issues-part3.sh

echo ""
echo "======================================"
echo "All issues created successfully!"
echo "======================================"
echo ""
echo "View issues at:"
echo "https://github.com/HappyFluffyPegasus/Bibliarch-Game-Claw/issues"
