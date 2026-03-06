/**
 * --------------------------------------------------------------------------
 * tv-screen-device-excluder - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, BID_MODIFIER: 0.0 }; // 0.0 decreases bid by 100% (exclusion)
function main() {
    Logger.log("Excluding connected TVs from all Standard Video and Display campaigns...");
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    var count = 0;
    while(campIter.hasNext()) {
        var camp = campIter.next();
        // Skip performance max or shopping via standard get() checks if needed, but we check connected tv platforms directly
        var tvIter = camp.targeting().platforms().tv().get();
        if (tvIter.hasNext()) {
            var tv = tvIter.next();
            if (tv.getBidModifier() !== CONFIG.BID_MODIFIER) {
                Logger.log("Excluding TVs for: " + camp.getName());
                if (!CONFIG.TEST_MODE) tv.setBidModifier(CONFIG.BID_MODIFIER); // -100% bid modifier
                count++;
            }
        }
    }
    Logger.log(count + " campaigns had TV bid modifiers adjusted to -100%.");
}
