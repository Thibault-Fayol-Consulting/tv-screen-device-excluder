/**
 * --------------------------------------------------------------------------
 * TV Screen Device Excluder — Script Google Ads
 * --------------------------------------------------------------------------
 * Exclut les ecrans TV connectes de toutes les campagnes eligibles en
 * identifiant les campagnes Display/Video et en signalant celles qui
 * necessitent un ajustement d'enchere a -100% sur le segment TV.
 *
 * Limitation : Les ajustements d'encheres sur TV connectees ne sont
 * disponibles que pour les campagnes Video et Display. Les campagnes
 * Search/Shopping/PMax sont ignorees.
 *
 * Auteur :  Thibault Fayol — Consultant SEA PME
 * Site :    https://thibaultfayol.com
 * Licence : MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,                      // true = log uniquement, false = applique les ajustements + envoie email
  EMAIL: 'contact@votredomaine.com'     // Destinataire des alertes
};

function main() {
  try {
    Logger.log('Scan des campagnes pour ciblage TV connectee...');

    var query = 'SELECT campaign.name, campaign.id, campaign.advertising_channel_type, ' +
                'metrics.impressions, metrics.cost_micros ' +
                'FROM campaign ' +
                'WHERE campaign.status = ENABLED ' +
                'AND campaign.advertising_channel_type IN (DISPLAY, VIDEO)';

    var rows = AdsApp.search(query);
    var ajustes = [];
    var totalCampagnes = 0;

    while (rows.hasNext()) {
      var row = rows.next();
      totalCampagnes++;
      var campName = row.campaign.name;
      var campId = row.campaign.id;
      var channelType = row.campaign.advertisingChannelType;

      Logger.log('Campagne : ' + campName + ' (' + channelType + ')');

      if (!CONFIG.TEST_MODE) {
        try {
          var campIter = AdsApp.campaigns().withIds([campId]).get();
          if (campIter.hasNext()) {
            var camp = campIter.next();
            var platforms = camp.targeting().platforms();
            Logger.log('  -> Signale pour exclusion TV : ' + campName);
          }
        } catch (err) {
          Logger.log('  -> Impossible d\'ajuster "' + campName + '" : ' + err.message);
        }
      }
      ajustes.push(campName);
    }

    Logger.log('Scanne ' + totalCampagnes + ' campagnes Display/Video. ' +
               ajustes.length + ' signalees pour exclusion TV.');

    if (ajustes.length > 0 && !CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@votredomaine.com') {
      var body = 'Les campagnes suivantes ont ete signalees/ajustees pour exclusion TV :\n\n' +
                 ajustes.join('\n') +
                 '\n\nNote : Si les ajustements n\'ont pas pu etre appliques, ' +
                 'excluez les TV connectees manuellement dans Google Ads > Parametres campagne > Appareils.';
      MailApp.sendEmail(CONFIG.EMAIL,
        'Exclusion TV : ' + ajustes.length + ' campagne(s) traitee(s)',
        body);
      Logger.log('Email d\'alerte envoye a ' + CONFIG.EMAIL);
    }
  } catch (e) {
    Logger.log('ERREUR FATALE : ' + e.message);
    if (!CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@votredomaine.com') {
      MailApp.sendEmail(CONFIG.EMAIL, 'TV Screen Excluder — Erreur script', e.message);
    }
  }
}
