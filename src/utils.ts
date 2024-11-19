import { parse } from "jsonc-parser";

export type Item = { title: string; rule: string };

export type ById = Record<number, Item>;

// the preivous version is `data`
export const byIdKey = "byId";

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

export const parseRule = (rule: string) => {
  // TODO: runtime type checking
  return parse(rule) as Omit<chrome.declarativeNetRequest.Rule, "id">;
};
