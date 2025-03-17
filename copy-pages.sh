#!/bin/bash

# Source directory (your webpages folder)
SOURCE_DIR="C:/references-referencias/webpages"

# Destination directory (development folder)
DEST_DIR="development"

# Create destination directories if they don't exist
mkdir -p "$DEST_DIR"/{join,home,powerline,powerlineShow,payplan,product,profile,enroller,FAQS,leaderboard,contactus,login,logout}

# Function to copy files for a specific page
copy_page_files() {
    local page_name=$1
    local source_path="$SOURCE_DIR/$page_name"
    local dest_path="$DEST_DIR/$page_name"
    
    echo "Copying files for $page_name..."
    
    # Create destination directory if it doesn't exist
    mkdir -p "$dest_path"
    
    # Copy all files from source to destination
    cp -r "$source_path"/* "$dest_path/"
    
    echo "Completed copying files for $page_name"
}

# Copy files for each page
copy_page_files "join"
copy_page_files "home"
copy_page_files "powerline"
copy_page_files "powerlineShow"
copy_page_files "payplan"
copy_page_files "product"
copy_page_files "profile"
copy_page_files "enroller"
copy_page_files "FAQS"
copy_page_files "leaderboard"
copy_page_files "contactus"
copy_page_files "login"
copy_page_files "logout"

echo "All files have been copied successfully!" 