# TV Screen Device Excluder

> Google Ads Script for SMBs — Identify and flag Display/Video campaigns serving on connected TVs

## What it does
Scans all enabled Display and Video campaigns and flags those that may be serving ads on connected TV screens. Since connected TV placements rarely convert for SMBs, this script helps you identify campaigns that need manual device exclusion adjustments.

## Setup
1. Open Google Ads > Tools > Scripts
2. Create a new script and paste the code from `main_en.gs` (or `main_fr.gs` for French)
3. Update the `CONFIG` block at the top:
   - `EMAIL`: your alert email
   - `TEST_MODE`: set to `false` when ready to receive reports
4. Authorize and run a preview first
5. Schedule: **Monthly**

## CONFIG reference
| Parameter | Default | Description |
|-----------|---------|-------------|
| `TEST_MODE` | `true` | `true` = log only, `false` = flag campaigns + send email |
| `EMAIL` | `contact@domain.com` | Email address for TV exclusion alerts |

## How it works
1. Queries the `campaign` resource via GAQL filtered to Display and Video campaigns
2. Lists all eligible campaigns that could be serving on connected TVs
3. Sends a summary email recommending manual TV exclusion in Google Ads UI

## Limitations
- Google Ads Scripts API does not expose a direct `.tv()` platform method or a programmatic way to set connected TV bid adjustments
- **Manual action required**: After reviewing the report, go to Google Ads UI > Campaign Settings > Devices to exclude connected TVs (set -100% bid adjustment)
- Only applies to Display and Video campaigns — Search, Shopping, and PMax are skipped

## Requirements
- Google Ads account (not MCC)
- Google Ads Scripts access
- Display or Video campaigns active in the account

## License
MIT — Thibault Fayol Consulting
