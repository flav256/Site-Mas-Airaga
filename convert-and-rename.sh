#!/bin/bash

# WebP Conversion and Image Renaming Script
# Converts all JPG to WebP (quality 90) and renames with structured names

cd "/Users/flavienmaire/Documents/code-cursor/Site-Mas-Airaga/images" || exit 1

# Create a mapping file to track old → new names
MAPPING_FILE="../image-mapping.txt"
echo "# Image Renaming Map - $(date)" > "$MAPPING_FILE"
echo "# OLD_NAME → NEW_NAME" >> "$MAPPING_FILE"
echo "" >> "$MAPPING_FILE"

# Function to convert and rename
convert_and_rename() {
    local old_name="$1"
    local new_name="$2"

    # Skip if already processed
    if [ -f "${new_name}.webp" ]; then
        echo "✓ Already exists: ${new_name}.webp"
        return
    fi

    # Convert to WebP with quality 90
    if [ -f "$old_name" ]; then
        echo "Converting: $old_name → ${new_name}.webp"
        cwebp -q 90 "$old_name" -o "${new_name}.webp"

        # Also copy/rename the original JPG with new name (for fallback)
        if [ "$old_name" != "${new_name}.jpg" ]; then
            cp "$old_name" "${new_name}.jpg"
            echo "Copied: $old_name → ${new_name}.jpg"
        fi

        # Log the mapping
        echo "$old_name → $new_name" >> "$MAPPING_FILE"
    else
        echo "⚠ File not found: $old_name"
    fi
}

echo "===================================="
echo "🖼️  Image Conversion & Renaming"
echo "===================================="
echo ""

# OUTDOOR / POOL SECTION
echo "📍 Converting: Outdoor & Pool images..."
convert_and_rename "IMG_3465 2.jpg" "01-outdoor-pool-aerial-view"
convert_and_rename "IMG_3472.jpg" "02-outdoor-pool-aerial-garden"
convert_and_rename "IMG_3473.jpg" "03-outdoor-pool-sunbeds"
convert_and_rename "IMG_4551.jpg" "04-outdoor-panoramic-view"
convert_and_rename "IMG_9679.jpg" "05-outdoor-pool-house-terrace"
convert_and_rename "IMG_9675.jpg" "06-outdoor-terrace-view"
convert_and_rename "IMG_3474 2.jpg" "07-outdoor-pool-lounge"
convert_and_rename "IMG_3476.jpg" "08-outdoor-lounge-elegant"
convert_and_rename "IMG_4547.jpg" "09-outdoor-garden-green"
convert_and_rename "IMG_4546.jpg" "10-outdoor-pergola-pool-view"
convert_and_rename "IMG_4544.jpg" "11-outdoor-pergola-furniture"
convert_and_rename "IMG_3466 2.jpg" "12-outdoor-pergola-dining"
convert_and_rename "IMG_3471.jpg" "13-outdoor-facade-flowers"
convert_and_rename "IMG_3468.jpg" "14-outdoor-aerial-property"

# LIVING ROOM
echo "📍 Converting: Living room images..."
convert_and_rename "IMG_9692.jpg" "15-living-room-spacious-sofas"
convert_and_rename "IMG_9694.jpg" "16-living-open-view-kitchen"
convert_and_rename "IMG_3479 2.jpg" "17-living-stairs-elegant"

# KITCHEN & DINING
echo "📍 Converting: Kitchen & Dining images..."
convert_and_rename "IMG_4542.jpg" "18-kitchen-dining-spacious"
convert_and_rename "IMG_4545.jpg" "19-kitchen-dining-with-kitchen"
convert_and_rename "IMG_3487 2.jpg" "20-kitchen-modern-white"
convert_and_rename "IMG_3488.jpg" "21-kitchen-open-dining-view"

# BEDROOM 1 (Ground Floor)
echo "📍 Converting: Bedroom 1 images..."
convert_and_rename "Bedroom_1a.jpg" "22-bedroom-1-queen-bed"
convert_and_rename "Bedroom_1b.jpg" "23-bedroom-1-view-2"
convert_and_rename "Bedroom_1c.jpg" "24-bedroom-1-view-3"

# BEDROOMS 2 & 3 (First Floor)
echo "📍 Converting: Bedrooms 2 & 3 images..."
convert_and_rename "Bedroom_2&3.jpg" "25-bedroom-2-3-overview"
convert_and_rename "Bedroom_2a.jpg" "26-bedroom-2-queen-bed"
convert_and_rename "Bedroom_2b.jpg" "27-bedroom-2-view-2"
convert_and_rename "Bedroom_3a.jpg" "28-bedroom-3-queen-bed"
convert_and_rename "Bedroom_3b.jpg" "29-bedroom-3-view-2"
convert_and_rename "Bedroom_3c.jpg" "30-bedroom-3-view-3"

# BEDROOM 4 (Master)
echo "📍 Converting: Bedroom 4 Master images..."
convert_and_rename "Bedroom_4a.jpg" "31-bedroom-4-master-queen"
convert_and_rename "Bedroom_4b.jpg" "32-bedroom-4-master-view-2"
convert_and_rename "Bedroom_4c.jpg" "33-bedroom-4-master-view-3"

# BATHROOMS
echo "📍 Converting: Bathroom images..."
convert_and_rename "SDB_1a.jpg" "34-bathroom-1"
convert_and_rename "SDB_1b.jpg" "35-bathroom-1-detail"
convert_and_rename "SDB_2.jpg" "36-bathroom-2"
convert_and_rename "SDB_3a.jpg" "37-bathroom-3"
convert_and_rename "SDB_3b.jpg" "38-bathroom-3-shower"
convert_and_rename "SDB_3c.jpg" "39-bathroom-3-sink"

# EXTRAS / AMENITIES
echo "📍 Converting: Extras & Amenities images..."
convert_and_rename "IMG_3322.jpg" "40-extras-ping-pong"
convert_and_rename "IMG_4548.jpg" "41-extras-outdoor-leisure"
convert_and_rename "IMG_9672.jpg" "42-extras-terrace-garden"
convert_and_rename "IMG_9676.jpg" "43-extras-pool-relaxation"

echo ""
echo "===================================="
echo "✅ Conversion Complete!"
echo "===================================="
echo ""
echo "📊 Summary:"
echo "  - All images converted to WebP (quality 90)"
echo "  - Original JPGs renamed with structure"
echo "  - Mapping saved to: $MAPPING_FILE"
echo ""
echo "🔍 File size comparison:"
du -sh *.jpg 2>/dev/null | head -3
du -sh *.webp 2>/dev/null | head -3
