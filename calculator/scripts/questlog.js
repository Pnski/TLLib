//Skills https://questlog.gg/throne-and-liberty/api/trpc/skillBuilder.getSkillBuildsBySlug?input=%7B%22slug%22%3A%22FcW6ronIeJ0J%22%7D
//Character https://questlog.gg/throne-and-liberty/api/trpc/characterBuilder.getCharacter?input=%7B%22slug%22%3A%22TyphoonAndTheSilentFerocity%22%7D
//Mastery https://questlog.gg/throne-and-liberty/api/trpc/weaponSpecialization.getWeaponSpecializationBySlug?input=%7B%22slug%22%3A%22FcW6ronIeJ0J%22%7D

// Multiple CORS proxies (try in order)
const ProxyUrls = [
  "https://corsproxy.io/?url=",
  "https://api.allorigins.win/raw?url=",
  "http://alloworigin.com/raw?url=",
];

const BaseUrl = 'https://questlog.gg/throne-and-liberty/api/trpc/';

async function getResponse(url) {
    for (let i = 0; i < ProxyUrls.length; i++) {
        const fullUrl = ProxyUrls[i] + url;
        try {
            console.log(`Trying proxy ${i + 1}: ${ProxyUrls[i]}`);
            const response = await fetch(fullUrl);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const body = await response.json();
            if (body?.result?.data) {
                return body.result.data; // Success
            } else {
                console.warn(`Proxy ${i + 1} returned no data, trying next...`);
            }
        } catch (error) {
            console.error(`Proxy ${i + 1} failed:`, error.message);
        }
    }
    throw new Error("All proxies failed.");
}

export async function getCharacter(Name) {
    const URL = BaseUrl+'characterBuilder.getCharacter?input='+encodeURIComponent(`{"slug":"${Name}"}`);
    return await getResponse(URL)
}

export async function getSkills(Name) {
    const res = await getCharacter(Name)
    const URL = BaseUrl+'skillBuilder.getSkillBuildsBySlug?input='+encodeURIComponent(`{"slug":"${res.character?.user?.slug}"}`);
    return await getResponse(URL)
}