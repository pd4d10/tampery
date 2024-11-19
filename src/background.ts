// // Apply change sync from remote
// chrome.storage.onChanged.addListener((changes, areaName) => {
//   console.log("Storage change:", changes, areaName);
//   if (areaName === "sync" && changes.data) {
//     // Remove all deleted listener
//     Object.entries(changes.data.oldValue || {}).forEach(([id]) => {
//       if (!changes.data.newValue[id]) {
//         removeListener(id);
//       }
//     });
//     // Apply new active state
//     Object.entries(changes.data.newValue as Data).forEach(
//       ([id, { name, code, active }]) => {
//         if (active && !mapper[id]) {
//           addListener(id, name, code);
//         } else if (!active && mapper[id]) {
//           removeListener(id);
//         }
//       },
//     );
//   }
// });
