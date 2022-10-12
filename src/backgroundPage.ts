import {browser, WebNavigation, WebRequest} from "webextension-polyfill-ts";
import {GQLResponse} from "@src/_types";
import OnBeforeRedirectDetailsType = WebRequest.OnBeforeRedirectDetailsType;
import OnBeforeNavigateDetailsType = WebNavigation.OnBeforeNavigateDetailsType;
import {isInAddictionSession} from "@src/common";

const RealmConfig = {
    apiKey: 'iJmCGwyt4scOHSsau3LGV4z81oyvcbb5oTpWTvQoWk5wuMBNY5O1soqBFjz7PZCD',
    graphqlUri: `https://eu-west-1.aws.realm.mongodb.com/api/client/v2.0/app/wanabuddy-prototype-vkqcz/graphql`,
    graphqlRequest: {
        hostname: `eu-west-1.aws.realm.mongodb.com`,
        path: `/api/client/v2.0/app/wanabuddy-prototype-vkqcz/graphql`,
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    graphqlHeaders: {
        'Content-Type': 'application/json',
        "apiKey": `iJmCGwyt4scOHSsau3LGV4z81oyvcbb5oTpWTvQoWk5wuMBNY5O1soqBFjz7PZCD`,
    }
};


// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }, sender) => {
    // Log statement if request.popupMounted is true
    // NOTE: this request is sent in `popup/component.tsx`
    if (request.popupMounted) {
        console.log("backgroundPage notified that Popup.tsx has mounted.");
    }
});


// browser.webRequest.onBeforeRequest.addListener(async (details) => {Z

async function checkAndRedirect(details: OnBeforeRedirectDetailsType | OnBeforeNavigateDetailsType) {
    const {url, tabId} = details;
    if (url.startsWith('http')) {
        const {hostname} = new URL(url);
        console.log('Checking', hostname);
        const body = JSON.stringify({
            query: `
            query {
              document: porn(query:{domain: "${hostname}"}) {
                _id
                domain
              }
            }
        `
        });
        const [response, inSession] = await Promise.all([
            fetch(RealmConfig.graphqlUri, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "apiKey": `iJmCGwyt4scOHSsau3LGV4z81oyvcbb5oTpWTvQoWk5wuMBNY5O1soqBFjz7PZCD`,
                },
                body
            }),
            isInAddictionSession()
        ]);

        if (inSession) {
            console.log('In session, not blocking anything');
            return;
        }

        if (!response.ok) {
            console.error(`Failed to check porn list for ${hostname}`, response.statusText);
            return {};
        }

        const gqlResponse: GQLResponse<{ _id: string }> = await response.json();
        if (hostname === 'wanabuddy.example.com' || !!gqlResponse?.data?.document) {
            console.log('Match', hostname);
            // chrome.tabs.update(tabId, {url: `https://wanabuddy.com?origin=${url}`});
            chrome.tabs.update(tabId, {url: chrome.runtime.getURL(`interstitial.html?origin=${url}`)});
            // chrome.tabs.sendMessage(tabId, {wanabuddy: true});
        }
    }
}

// TODO why does this only work _sometimes_pl
browser.webRequest.onBeforeRequest.addListener((details) => {
    checkAndRedirect(details);
    return {}
}, {
    urls: ["*://*/*"],
    types: ["main_frame"]
}, ['blocking']);

browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    checkAndRedirect(details);
});



