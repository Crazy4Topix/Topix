import { type Recording } from 'expo-av/build/Audio/Recording';
import { type Session } from '@supabase/supabase-js';


export async function fetchWithTimeout(url: string, options: any, timeout = 5000) {
  return await Promise.race([
    fetch(url, options),
    // eslint-disable-next-line promise/param-names
    new Promise((_, reject) => setTimeout(() => { reject(new Error('timeout')); }, timeout))
  ]);
}

export const cloneVoice = async (recording: Recording, name: string, session: Session) => {
  const formData = new FormData();
  // @ts-expect-error: Types are wrong
  formData.append('file', {
    uri: recording.getURI(),
    name: 'audio.wav',
    type: 'audio/wav'
  });
  formData.append('name', name);
  formData.append('access_token', session.access_token)
  formData.append('refresh_token', session.refresh_token)

  const res = await fetchWithTimeout(`http://192.168.2.20:1337/api/v1/createVoiceClone?keys=${process.env.TOPIX_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  }).catch((e) => {
    console.log(e)
  })

  console.log(res)

  return res;
}


export const voiceClone = "we beginnen met opmerkelijk nieuws over onze harige vrienden. " +
  "In een gewaagde zet zijn alle dieren ontsnapt uit de plaatselijke dierentuin en genieten nu van een leven vol vrijheid en blijheid. " +
  "Van brullende leeuwen tot kwetterende papegaaien, de dieren hebben de kans gegrepen om hun natuurlijke gedrag te herontdekken. " +
  "Bewoners in de buurt hebben gemeld dat ze zelfs een groep pinguïns hebben gespot die zich op avontuurlijke wijze een weg banen door de straten. " +
  "Niet veel verderop lijken een paar pientere papegaaien de kunst van het bestellen onder de knie te hebben. " +
  "Voorbijgangers kijken met open mond toe terwijl deze gevederde vrienden vrolijk kwebbelen en hun bestellingen doorgeven aan de cafémedewerkers. " +
  "De directeur van de dierentuin, die ons zijn reactie heeft gegeven, lijkt verrassend positief te zijn over deze ontwikkeling. " +
  "Hij benadrukt dat het welzijn van de dieren altijd voorop heeft gestaan, en dit nieuwe hoofdstuk biedt hen de kans om te floreren in een meer natuurlijke omgeving. " +
  "De autoriteiten werken nu samen met dierenexperts om ervoor te zorgen dat de 'wildlife community' veilig en harmonieus kan samenleven met de menselijke bewoners. " +
  "Voor nu lijkt het erop dat deze ontsnapping een onverwachte wending heeft genomen in het voordeel van onze viervoetige vrienden."