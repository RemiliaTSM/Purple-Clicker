# New Sidebar Redesign Plan

## Overview
Redesign the upgrades and buildings sidebar to combine both into a single tab with a more compact and informative layout.

## Current State Analysis
- [x] Examine current sidebar structure in script.js
- [x] Identify existing upgrade and building data structures
- [x] Review current tooltip/hover systems  
- [x] Analyze current sorting mechanisms

### Current Structure Found:
- Sidebar uses `sidebarPage` variable to switch between 'upgrades', 'buildings', 'offline', 'casino'
- `manualUpgrades` array contains manual click upgrades
- `buildings` array contains production buildings  
- `offlineUpgrades` and `offlineBuildings` arrays for offline content
- `renderSidebar()` function handles all sidebar rendering
- CSS classes: `.upgrade-btn`, `.sidebar-tab`, `#upgrade-sidebar`, `#offline-upgrade-sidebar`
- No current tooltip system beyond built-in button tooltips

## Design Requirements

### Upgrades Section (Top)
- [x] **Compact Square Layout**: Display upgrades as squares with emoji icons
- [x] **Dynamic Sorting**: Sort by price (cheapest first)
- [x] **Hover Tooltips**: Show price and description in scalable window
- [x] **Icon Infrastructure**: Support for custom icons per upgrade
- [x] **Responsive Grid**: Automatically adjust grid based on available upgrades

### Buildings Section (Bottom)
- [x] **Compressed List**: Vertical list format similar to provided image
- [x] **Information Display**: Name, cost, count owned
- [x] **Detailed Tooltips**: Comprehensive production statistics
- [x] **Obscured Names**: Question marks for unpurchasable buildings
- [x] **Limited Preview**: Only show next 2 tiers of unaffordable buildings
- [x] **Icon Infrastructure**: Support for custom icons per building

## Tooltip Format Specifications

### Upgrade Tooltips
```
[Upgrade Name]
Cost: X purples
[Description text]
```

### Building Tooltips
```
[Building Name]
[Description]
Each X produces Y purples per second.
N X producing Y*N purples per second (Z% of total PpS)
A purples produced so far
```

## Implementation Plan

### Phase 1: Data Structure Updates
- [x] Add icon fields to upgrade definitions
- [x] Add icon fields to building definitions
- [x] Add production tracking for buildings
- [x] Add description fields where missing

### Phase 2: UI Structure Changes
- [x] Modify sidebar HTML structure
- [x] Create upgrade grid container
- [x] Create building list container
- [x] Remove old separate tabs

### Phase 3: Styling Implementation
- [x] Create CSS for upgrade squares grid
- [x] Create CSS for building compressed list
- [x] Implement tooltip styling
- [x] Add responsive design considerations

### Phase 4: JavaScript Logic Updates
- [x] Implement upgrade sorting by price
- [x] Create building visibility logic (next 2 tiers)
- [x] Implement building obscuration system
- [x] Update tooltip generation functions
- [x] Calculate building production percentages

### Phase 5: Tooltip System Enhancement
- [x] Create dynamic tooltip positioning
- [x] Implement scalable tooltip windows
- [x] Add building production statistics
- [x] Ensure tooltips don't overflow screen

### Phase 6: Icon Management System
- [x] Create icon mapping functions
- [x] Implement fallback icon system
- [x] Add icon customization infrastructure
- [x] Support both emoji and image icons

## Technical Implementation Details

### CSS Classes Needed
```css
.sidebar-content
.upgrades-section
.upgrade-grid
.upgrade-square
.upgrade-square:hover
.buildings-section
.building-list
.building-item
.building-item:hover
.tooltip
.tooltip-content
.building-obscured
```

### JavaScript Functions Needed
```javascript
sortUpgradesByPrice()
getBuildingVisibility()
obscureBuildingName()
calculateBuildingPercentage()
generateUpgradeTooltip()
generateBuildingTooltip()
getUpgradeIcon()
getBuildingIcon()
updateSidebarLayout()
```

### Data Structure Enhancements
```javascript
// Upgrade structure
{
  name: string,
  icon: string, // emoji or image path
  baseCost: number,
  description: string,
  // ... existing fields
}

// Building structure  
{
  name: string,
  icon: string, // emoji or image path
  description: string,
  totalProduced: number, // new field
  // ... existing fields
}
```

## Current Progress Tracking
- [x] Phase 1: Data Structure Updates
- [x] Phase 2: UI Structure Changes  
- [x] Phase 3: Styling Implementation
- [x] Phase 4: JavaScript Logic Updates
- [x] Phase 5: Tooltip System Enhancement
- [x] Phase 6: Icon Management System

## Implementation Completed
- ✅ Added icon fields to all manual upgrades and buildings
- ✅ Added totalProduced tracking for buildings
- ✅ Updated HTML structure to combine upgrades and buildings
- ✅ Added comprehensive CSS styling for new layout
- ✅ Implemented tooltip system with detailed building statistics
- ✅ Created upgrade sorting by price (cheapest first)
- ✅ Added building visibility logic (owned + affordable + next 2 tiers)
- ✅ Implemented building name obscuration for unaffordable buildings
- ✅ Updated save/load system to include totalProduced
- ✅ Modified sidebar tab logic to use combined "Main" tab
- ✅ Added building production tracking in game loop
- ✅ Updated reset functions to clear totalProduced
- ✅ Removed old event listeners and updated sidebar controls

## Testing Checklist
- [ ] Upgrades display correctly in grid
- [ ] Upgrades sort by price properly
- [ ] Upgrade tooltips show correct information
- [ ] Buildings display in compressed list
- [ ] Building tooltips show production stats
- [ ] Building obscuration works correctly
- [ ] Only 2 tiers of unaffordable buildings show
- [ ] Responsive design works on different screen sizes
- [ ] Icons display correctly
- [ ] Tooltips don't overflow screen boundaries

## Future Enhancements
- [ ] Animated sorting transitions
- [ ] Advanced filtering options
- [ ] Customizable layout preferences
- [ ] Drag-and-drop organization
- [ ] Multi-tab support for different categories 