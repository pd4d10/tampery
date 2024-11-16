export const storage = {
  get() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get((items) => {
        resolve(items.data || {});
        console.log("Storage get:", items.data);
      });
    });
  },
  set(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ data }, () => {
        resolve();
        console.log("Storage set:", data);
      });
    });
  },
};
