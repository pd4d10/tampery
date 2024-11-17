export type RuleWithoutId = Omit<chrome.declarativeNetRequest.Rule, "id">;

export type Item = { title: string; rule: RuleWithoutId };

export type ById = Record<number, Item>;

// the preivous version is `data`
export const byIdKey = "byId";

export const storage = {
  get(): Promise<ById> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get((items) => {
        console.log("Storage get:", items[byIdKey]);
        resolve(items[byIdKey] ?? {});
      });
    });
  },
};

export const updateRules = async (
  options: chrome.declarativeNetRequest.UpdateRuleOptions,
) => {
  return new Promise((resolve, reject) => {
    chrome.declarativeNetRequest.updateDynamicRules(options, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log("Rule added or removed successfully");
        resolve(0);
      }
    });
  });
};

export const findNewRuleId = async () => {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleId = Math.max(...currentRules.map((rule) => rule.id)) + 1;
  return ruleId;
};
