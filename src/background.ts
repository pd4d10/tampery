// import { storage } from "./utils";
// import * as types from "./types";
// import { Data, RuleWithoutId } from "./dashboard/context";

// // Save lifecycle and callback reference for removal
// const mapper: {
//   [id: string]: {
//     lifecycle: string;
//     callback: Function;
//   };
// } = {};

// function removeListener(id: string) {
//   if (!mapper[id]) return;
//   const { lifecycle, callback } = mapper[id];

//   // @ts-ignore TODO:
//   chrome.webRequest[lifecycle].removeListener(callback);
//   console.log("Listener removed:", id, mapper);
//   delete mapper[id];
// }

// // Add listeners already stored at sync
// async function addListeners() {
//   const data = await storage.get<Data>();
//   Object.entries(data).forEach(([id, rule]) => {
//     if (active) addListener(id, name, code);
//   });
// }
// addListeners();

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

// // Add event listeners: add, delete, ...
// async function handleMessage(
//   msg: types.Message,
//   sendResponse: (response: types.MessageRes) => void,
// ) {
//   try {
//     // const { id, name, code, active, type } = msg
//     const data: { [id: string]: any } = await storage.get();
//     removeListener(msg.id); // Always remove the old listener
//     switch (msg.type) {
//       case "add": {
//         await addListener(msg.rule);
//         const { name, code, active } = msg;
//         data[msg.id] = { name, code, active };
//         break;
//       }
//       case "delete": {
//         delete data[msg.id];
//         break;
//       }
//       case "deactivate": {
//         data[msg.id].active = false;
//         break;
//       }
//       case "activate": {
//         await addListener(msg.id, data[msg.id].name, data[msg.id].code);
//         data[msg.id].active = true;
//         break;
//       }
//     }
//     await storage.set(data);
//     sendResponse({ code: 0, message: `${msg.type} success` });
//   } catch (err) {
//     console.error(err);
//     sendResponse({
//       code: 1,
//       message: (err as any).message,
//     });
//   }
// }

// chrome.runtime.onMessage.addListener(
//   (msg: types.Message, sender, sendResponse) => {
//     console.log("Message:", msg);
//     handleMessage(msg, sendResponse);
//     return true;
//   },
// );
