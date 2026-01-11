#!/bin/bash

# Script to update HTML with new image names and WebP + JPG fallback

HTML_FILE="index.html"
BACKUP_FILE="index.html.backup-$(date +%Y%m%d-%H%M%S)"

cd "/Users/flavienmaire/Documents/code-cursor/Site-Mas-Airaga" || exit 1

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
cp "$HTML_FILE" "$BACKUP_FILE"

echo "🔄 Updating HTML with new structured image names..."

# Update Hero Slider (keep Photo Exterieur 1.webp as is - already WebP)
sed -i '' 's|images/IMG_9676.jpg|images/43-extras-pool-relaxation.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3465 2.jpg|images/01-outdoor-pool-aerial-view.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3472.jpg|images/02-outdoor-pool-aerial-garden.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_9679.jpg|images/05-outdoor-pool-house-terrace.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3473.jpg|images/03-outdoor-pool-sunbeds.jpg|g' "$HTML_FILE"

# Outdoor/Pool section
sed -i '' 's|images/IMG_4551.jpg|images/04-outdoor-panoramic-view.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_9675.jpg|images/06-outdoor-terrace-view.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3474 2.jpg|images/07-outdoor-pool-lounge.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3476.jpg|images/08-outdoor-lounge-elegant.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_4547.jpg|images/09-outdoor-garden-green.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_4546.jpg|images/10-outdoor-pergola-pool-view.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_4544.jpg|images/11-outdoor-pergola-furniture.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3466 2.jpg|images/12-outdoor-pergola-dining.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3471.jpg|images/13-outdoor-facade-flowers.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3468.jpg|images/14-outdoor-aerial-property.jpg|g' "$HTML_FILE"

# Living room
sed -i '' 's|images/IMG_9692.jpg|images/15-living-room-spacious-sofas.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_9694.jpg|images/16-living-open-view-kitchen.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3479 2.jpg|images/17-living-stairs-elegant.jpg|g' "$HTML_FILE"

# Kitchen & Dining
sed -i '' 's|images/IMG_4542.jpg|images/18-kitchen-dining-spacious.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_4545.jpg|images/19-kitchen-dining-with-kitchen.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3487 2.jpg|images/20-kitchen-modern-white.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_3488.jpg|images/21-kitchen-open-dining-view.jpg|g' "$HTML_FILE"

# Bedrooms
sed -i '' 's|images/Bedroom_1a.jpg|images/22-bedroom-1-queen-bed.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_1b.jpg|images/23-bedroom-1-view-2.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_1c.jpg|images/24-bedroom-1-view-3.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_2&3.jpg|images/25-bedroom-2-3-overview.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_2a.jpg|images/26-bedroom-2-queen-bed.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_2b.jpg|images/27-bedroom-2-view-2.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_3a.jpg|images/28-bedroom-3-queen-bed.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_3b.jpg|images/29-bedroom-3-view-2.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_3c.jpg|images/30-bedroom-3-view-3.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_4a.jpg|images/31-bedroom-4-master-queen.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_4b.jpg|images/32-bedroom-4-master-view-2.jpg|g' "$HTML_FILE"
sed -i '' 's|images/Bedroom_4c.jpg|images/33-bedroom-4-master-view-3.jpg|g' "$HTML_FILE"

# Bathrooms
sed -i '' 's|images/SDB_1a.jpg|images/34-bathroom-1.jpg|g' "$HTML_FILE"
sed -i '' 's|images/SDB_1b.jpg|images/35-bathroom-1-detail.jpg|g' "$HTML_FILE"
sed -i '' 's|images/SDB_2.jpg|images/36-bathroom-2.jpg|g' "$HTML_FILE"
sed -i '' 's|images/SDB_3a.jpg|images/37-bathroom-3.jpg|g' "$HTML_FILE"
sed -i '' 's|images/SDB_3b.jpg|images/38-bathroom-3-shower.jpg|g' "$HTML_FILE"
sed -i '' 's|images/SDB_3c.jpg|images/39-bathroom-3-sink.jpg|g' "$HTML_FILE"

# Extras
sed -i '' 's|images/IMG_3322.jpg|images/40-extras-ping-pong.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_4548.jpg|images/41-extras-outdoor-leisure.jpg|g' "$HTML_FILE"
sed -i '' 's|images/IMG_9672.jpg|images/42-extras-terrace-garden.jpg|g' "$HTML_FILE"

echo "✅ HTML updated with new structured image names!"
echo ""
echo "📝 Next step: Convert <img> tags to <picture> elements for WebP support"
echo "    This will be done via a separate script for better fallback support."
echo ""
echo "💾 Backup saved to: $BACKUP_FILE"
