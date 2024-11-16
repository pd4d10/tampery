export const storage = {
  get<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get((items) => {
        resolve(items.data || {});
        console.log("Storage get:", items.data);
      });
    });
  },
  set<T>(data: T) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ data }, () => {
        resolve(null);
        console.log("Storage set:", data);
      });
    });
  },
};
