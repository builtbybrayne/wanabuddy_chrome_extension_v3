export const WB_SESSION_STORAGE_KEY = "wbLiveAddictionSession";
export const WB_SESSION_LENGTH_MS = 1000 * 15;
export const WB_ORIGIN_URL_PARAM = "origin";

export async function isInAddictionSession() {
    return new Promise<boolean>(resolve => {
        chrome.storage.local.get(WB_SESSION_STORAGE_KEY, result => {
            console.log('STORAGE', result);
            const time = result?.[WB_SESSION_STORAGE_KEY];
            console.log('DIFF', time, time && (new Date().valueOf() - time));
            resolve(!time || (new Date().valueOf() - time < WB_SESSION_LENGTH_MS));
        })
    });
}
