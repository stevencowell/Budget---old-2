#!/usr/bin/env python3
"""
Script to organize files in the root directory into appropriate subdirectories.
This will help maintain a clean project structure.
"""

import os
import shutil
from pathlib import Path

# Define the root directory
ROOT_DIR = Path(__file__).parent

# Define organization structure
ORGANIZATION = {
    'docs': {
        'description': 'Documentation files',
        'patterns': ['*.md', '*.txt'],
        'exclude': ['README.md']  # Keep README in root
    },
    'data': {
        'description': 'Data files (CSV, Excel, etc.)',
        'patterns': ['*.csv', '*.CSV', '*.xlsx', '*.xls'],
        'exclude': []
    },
    'personal': {
        'description': 'Personal documents',
        'patterns': ['*.docx', '*.pdf', '*.doc'],
        'exclude': []
    },
    'scripts': {
        'description': 'Shell scripts and utilities',
        'patterns': ['*.sh'],
        'exclude': []
    }
}

def create_directories():
    """Create necessary directories if they don't exist."""
    for dir_name in ORGANIZATION.keys():
        dir_path = ROOT_DIR / dir_name
        if not dir_path.exists():
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"✓ Created directory: {dir_name}/")
        else:
            print(f"✓ Directory already exists: {dir_name}/")

def should_exclude(filename, exclude_list):
    """Check if a file should be excluded from moving."""
    return filename in exclude_list

def get_files_to_move():
    """Get a dictionary of files to move organized by destination directory."""
    files_to_move = {key: [] for key in ORGANIZATION.keys()}
    
    # Get all files in root directory (not in subdirectories)
    root_files = [f for f in ROOT_DIR.iterdir() if f.is_file()]
    
    for file_path in root_files:
        filename = file_path.name
        
        # Check each organization category
        for dest_dir, config in ORGANIZATION.items():
            if should_exclude(filename, config['exclude']):
                continue
                
            # Check if file matches any pattern
            for pattern in config['patterns']:
                if file_path.match(pattern):
                    files_to_move[dest_dir].append(file_path)
                    break
    
    return files_to_move

def move_files(files_to_move, dry_run=False):
    """Move files to their destination directories."""
    moved_count = 0
    
    for dest_dir, files in files_to_move.items():
        if not files:
            continue
            
        print(f"\n📁 Moving to {dest_dir}/:")
        for file_path in files:
            dest_path = ROOT_DIR / dest_dir / file_path.name
            
            if dest_path.exists():
                print(f"  ⚠ Skipping {file_path.name} (already exists in {dest_dir}/)")
                continue
            
            if dry_run:
                print(f"  [DRY RUN] Would move: {file_path.name}")
            else:
                try:
                    shutil.move(str(file_path), str(dest_path))
                    print(f"  ✓ Moved: {file_path.name}")
                    moved_count += 1
                except Exception as e:
                    print(f"  ✗ Error moving {file_path.name}: {e}")
    
    return moved_count

def create_gitkeep_files():
    """Create .gitkeep files in empty directories to ensure they're tracked by git."""
    for dir_name in ORGANIZATION.keys():
        dir_path = ROOT_DIR / dir_name
        gitkeep_path = dir_path / '.gitkeep'
        
        # Only create if directory is empty (excluding .gitkeep itself)
        if dir_path.exists():
            files = [f for f in dir_path.iterdir() if f.name != '.gitkeep']
            if not files and not gitkeep_path.exists():
                gitkeep_path.touch()
                print(f"✓ Created .gitkeep in {dir_name}/")

def main():
    """Main function to organize files."""
    print("=" * 60)
    print("FILE ORGANIZATION SCRIPT")
    print("=" * 60)
    print()
    
    # Step 1: Create directories
    print("Step 1: Creating directories...")
    create_directories()
    print()
    
    # Step 2: Scan for files to move
    print("Step 2: Scanning files...")
    files_to_move = get_files_to_move()
    
    total_files = sum(len(files) for files in files_to_move.values())
    print(f"Found {total_files} files to organize")
    print()
    
    # Step 3: Show what will be moved (dry run)
    print("Step 3: Preview of changes (dry run)...")
    move_files(files_to_move, dry_run=True)
    print()
    
    # Step 4: Confirm and move
    print("Step 4: Moving files...")
    response = input("Do you want to proceed with moving these files? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        moved_count = move_files(files_to_move, dry_run=False)
        print()
        print(f"✓ Successfully moved {moved_count} files!")
    else:
        print("Operation cancelled.")
        return
    
    # Step 5: Create .gitkeep files if needed
    print()
    print("Step 5: Creating .gitkeep files for empty directories...")
    create_gitkeep_files()
    
    print()
    print("=" * 60)
    print("FILE ORGANIZATION COMPLETE!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Review the changes: git status")
    print("2. Add changes: git add .")
    print("3. Commit changes: git commit -m 'Organize root directory files'")
    print("4. Push to GitHub: git push origin <branch-name>")

if __name__ == "__main__":
    main()
