/**
 * --------------------------------------------------------------------------
 * tv-screen-device-excluder - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Auteur : Thibault Fayol - Consultant SEA PME
 * Site web : https://thibaultfayol.com
 * Licence : MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,          // true : Ne fait pas de changement, logue seulement. false : APPLIQUE les exclusions.
  BID_MODIFIER: 0.0         // 0.0 signifie exclusion totale de l'appareil
};

function main() {
  Logger.log("📺 Démarrage de l'Excluder de TV Connectées (Smart TV)...");
  
  // On récupère toutes les campagnes du compte qui sont actives
  var campIter = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();
    
  var updatedCount = 0;
  var totalChecked = 0;

  while(campIter.hasNext()) {
    var camp = campIter.next();
    totalChecked++;
    
    // On cible le critère de ciblage spécifique : Plateforme "Connected TV" 
    var tvIter = camp.targeting().platforms().connectedTv().get();
    
    if (tvIter.hasNext()) {
        var tvObj = tvIter.next();
        var currentBidMod = tvObj.getBidModifier();
        
        // Si l'ajustement sur Smart TV n'est pas déjà à -100% (0.0)
        if (currentBidMod !== CONFIG.BID_MODIFIER) {
            Logger.log("⚠️ TV Connectées actuellement à " + currentBidMod + "x pour la campagne : " + camp.getName());
            
            if (!CONFIG.TEST_MODE) {
                // On met à jour l'ajustement d'enchères spécifique sur l'appareil à 0 (exclusion)
                tvObj.setBidModifier(CONFIG.BID_MODIFIER);
                Logger.log("✅ TV Exclues avec succès.");
            } else {
                Logger.log("[TEST] Exclurait les TV pour : " + camp.getName());
            }
            updatedCount++;
        }
    }
  }
  
  Logger.log("------------------------------------------");
  Logger.log("🎯 Bilan : Vous avez scanné " + totalChecked + " campagnes.");
  if (updatedCount > 0) {
      Logger.log("🛡️ " + updatedCount + " campagnes nécessitant une exclusion des TV.");
  } else {
      Logger.log("✅ Toutes vos campagnes ont déjà banni les diffuseurs TV !");
  }
}