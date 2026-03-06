/**
 * --------------------------------------------------------------------------
 * tv-screen-device-excluder - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, BID_MODIFIER: 0.0 }; // 0.0 baisse l'enchère de 100% (exclusion)
function main() {
    Logger.log("Exclusion des TV connectées pour toutes les campagnes classiques...");
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    var count = 0;
    while(campIter.hasNext()) {
        var camp = campIter.next();
        var tvIter = camp.targeting().platforms().tv().get();
        if (tvIter.hasNext()) {
            var tv = tvIter.next();
            if (tv.getBidModifier() !== CONFIG.BID_MODIFIER) {
                Logger.log("Exclusion des TV pour : " + camp.getName());
                if (!CONFIG.TEST_MODE) tv.setBidModifier(CONFIG.BID_MODIFIER); // Ajustement à -100%
                count++;
            }
        }
    }
    Logger.log(count + " campagnes ont subi une exclusion TV (-100% enchères).");
}
