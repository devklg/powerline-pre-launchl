#!/bin/bash

# Create target directories if they don't exist
mkdir -p "talkfusion-prelaunch-kevin/public/documents/compensation"

# Copy compensation plan document
cp "/c/talk_fusion/compensation/TF Comp Plan.pdf" "talkfusion-prelaunch-kevin/public/documents/compensation/TF-Comp-Plan.pdf"

# Copy temporary app document
cp "/c/talk_fusion/temporary-app.pdf" "talkfusion-prelaunch-kevin/public/documents/temporary-app.pdf"

# Copy opportunity presentation
cp "/c/talk_fusion/compensation/TF Opportunity Presentation.pdf" "talkfusion-prelaunch-kevin/public/documents/compensation/TF-Opportunity-Presentation.pdf"

# Check if files were copied successfully
echo "Checking copied files..."
if [ -f "talkfusion-prelaunch-kevin/public/documents/compensation/TF-Comp-Plan.pdf" ] && \
   [ -f "talkfusion-prelaunch-kevin/public/documents/temporary-app.pdf" ] && \
   [ -f "talkfusion-prelaunch-kevin/public/documents/compensation/TF-Opportunity-Presentation.pdf" ]; then
    echo "All files copied successfully!"
else
    echo "Error: Some files may not have copied correctly."
    echo "Please check the source paths and permissions."
fi 