# pixel-poster V2 Update Specification

## Current State (V1)
- Basic poster generation with 4 templates
- 6 color palettes
- Ad-supported monetization
- LocalStorage for history

## V2 New Features

### 1. Premium Subscription
- Monthly: ¥480/month
- Yearly: ¥4,800/year (17% off)
- Features:
  - Premium templates (8 additional templates)
  - Higher resolution export (4x instead of 2x)
  - Custom color palette creation
  - No ads
  - Unlimited history

### 2. Premium Templates (8 new)
- Festival Poster (夏祭り風)
- Concert Flyer (ライブ告知)
- Workshop (ワークショップ)
- Online Event (オンラインイベント)
- Birthday Card (誕生日カード)
- Thank You Card (感謝カード)
- New Release (新作出品告知)
- Limited Time (期間限定告知)

### 3. Custom Color Palette
- Allow users to create custom color palettes
- Pick 3 colors
- Save up to 3 custom palettes (Premium)

### 4. Quality Settings (Premium)
- Standard: 2x scale
- High: 4x scale

## Technical Tasks
- [ ] Add premium modal and pricing display
- [ ] Add subscription state management
- [ ] Add premium templates CSS/JS
- [ ] Add custom palette creator
- [ ] Add quality selector
- [ ] Update export function for high quality
- [ ] Add subscription benefits UI indicators

## Files to Modify
- index.html: Add premium modal, quality selector, more templates
- style.css: Add premium template styles, custom palette UI
- script.js: Add subscription logic, premium features
