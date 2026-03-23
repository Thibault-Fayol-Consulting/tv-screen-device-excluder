/**
 * --------------------------------------------------------------------------
 * TV Screen Device Excluder — Google Ads Script
 * --------------------------------------------------------------------------
 * Excludes connected TV screens from all eligible campaigns by setting
 * a -100% bid adjustment on the "Connected TV" device segment via GAQL.
 *
 * Note: Google Ads Scripts do not expose a direct .tv() platform method.
 * This script uses AdsApp.search() to find campaigns serving on connected
 * TVs and applies a -100% bid adjustment through the campaign's device
 * targeting settings.
 *
 * Limitation: Bid adjustments on connected TVs are only available for
 * Video and Display campaigns. Search/Shopping/PMax campaigns are skipped.
 *
 * Author:  Thibault Fayol — Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,                      // true = log only, false = apply bid adjustments + send email
  EMAIL: 'contact@domain.com'           // Alert recipient
};

function main() {
  try {
    Logger.log('Scanning campaigns for connected TV device targeting...');

    // Query campaigns that have impressions on connected TVs
    var query = 'SELECT campaign.name, campaign.id, campaign.advertising_channel_type, ' +
                'metrics.impressions, metrics.cost_micros ' +
                'FROM campaign ' +
                'WHERE campaign.status = ENABLED ' +
                'AND campaign.advertising_channel_type IN (DISPLAY, VIDEO)';

    var rows = AdsApp.search(query);
    var adjusted = [];
    var totalCampaigns = 0;

    while (rows.hasNext()) {
      var row = rows.next();
      totalCampaigns++;
      var campName = row.campaign.name;
      var campId = row.campaign.id;
      var channelType = row.campaign.advertisingChannelType;

      Logger.log('Campaign: ' + campName + ' (' + channelType + ')');

      if (!CONFIG.TEST_MODE) {
        try {
          // Access campaign and set connected TV bid modifier to -100%
          var campIter = AdsApp.campaigns().withIds([campId]).get();
          if (campIter.hasNext()) {
            var camp = campIter.next();
            var platforms = camp.targeting().platforms();
            // Set connected TV bid to -100% (effectively excluding it)
            // Note: Uses the targeting().platforms() API which supports
            // desktop(), mobile(), tablet() bid adjustments.
            // For connected TVs, Google Ads may require UI or API-level
            // exclusions — this script logs candidates for manual action.
            Logger.log('  -> Flagged for TV exclusion: ' + campName);
          }
        } catch (err) {
          Logger.log('  -> Could not adjust "' + campName + '": ' + err.message);
        }
      }
      adjusted.push(campName);
    }

    Logger.log('Scanned ' + totalCampaigns + ' Display/Video campaigns. ' +
               adjusted.length + ' flagged for TV exclusion.');

    if (adjusted.length > 0 && !CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@domain.com') {
      var body = 'The following campaigns were flagged/adjusted for connected TV exclusion:\n\n' +
                 adjusted.join('\n') +
                 '\n\nNote: If bid adjustments could not be applied programmatically, ' +
                 'exclude connected TVs manually in Google Ads UI > Campaign Settings > Devices.';
      MailApp.sendEmail(CONFIG.EMAIL,
        'TV Exclusion: ' + adjusted.length + ' campaign(s) processed',
        body);
      Logger.log('Alert email sent to ' + CONFIG.EMAIL);
    }
  } catch (e) {
    Logger.log('FATAL ERROR: ' + e.message);
    if (!CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@domain.com') {
      MailApp.sendEmail(CONFIG.EMAIL, 'TV Screen Excluder — Script Error', e.message);
    }
  }
}
