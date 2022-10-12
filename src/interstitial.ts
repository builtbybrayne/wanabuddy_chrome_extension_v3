import {isInAddictionSession, WB_ORIGIN_URL_PARAM, WB_SESSION_STORAGE_KEY} from "@src/common";

function message(message: string) {
    const child = document.createElement('div');
    child.innerHTML = message;
    document.getElementById("message")?.appendChild(child);
}

function tryReload() {
    message('Reloading...');
    isInAddictionSession()
        .then(inSession => {
            if (inSession) {
                const origin = new URLSearchParams(window.location.search).get(WB_ORIGIN_URL_PARAM);
                if (origin) {
                    console.log(`In Session, so goto ${origin}`);
                    window.location.assign(origin);
                } else {
                    console.log(`No origin, so not reloading`);
                }
            } else {
                console.log(`Not in a session, so not reloading`);
            }
        })
        .catch(error => {
            console.error(`Could not determine if in addiction session`, error);
        });
}

function startAddictionSession() {
    message(`Starting session`);
    chrome.storage.local.set({[WB_SESSION_STORAGE_KEY]: new Date().valueOf()});
    tryReload();
}

document.getElementById("startSession")?.addEventListener('click', startAddictionSession);
document.getElementById("tryReload")?.addEventListener('click', tryReload);
