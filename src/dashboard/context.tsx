import {
  useEffect,
  createContext,
  FC,
  PropsWithChildren,
  useReducer,
  Reducer,
} from "react";
import { Item, byIdKey, ById, parseRule } from "../utils";
import { match } from "ts-pattern";

type State = {
  byId: ById;
  disabledRules: number[];
};

type Action =
  | { type: "load"; payload: ById }
  | { type: "add"; payload: [number, Item] }
  | { type: "remove"; payload: number }
  | { type: "enable"; payload: number }
  | { type: "disable"; payload: number };

const initialState: State = {
  byId: {},
  disabledRules: [],
};

type MyReducer = Reducer<State, Action>;

export const DataContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer<MyReducer>(
    (s, action) =>
      match(action)
        .with({ type: "load" }, ({ payload: byId }) => {
          return { ...s, byId };
        })
        .with({ type: "add" }, ({ payload: [id, item] }) => {
          return { ...s, byId: { ...s.byId, [id]: item } };
        })
        .with({ type: "remove" }, ({ payload: id }) => {
          const { [id]: _, ...newById } = s.byId;
          return {
            ...s,
            byId: newById,
            // clean invalid ids
            disabledRules: s.disabledRules.filter((ruleId) => ruleId !== id),
          };
        })
        .with({ type: "enable" }, ({ payload: id }) => {
          return {
            ...s,
            disabledRules: s.disabledRules.filter((ruleId) => ruleId !== id),
          };
        })
        .with({ type: "disable" }, ({ payload: id }) => {
          return { ...s, disabledRules: [...s.disabledRules, id] };
        })
        .otherwise(() => s),
    initialState,
  );

  useEffect(() => {
    chrome.storage.sync.get([byIdKey]).then((data) => {
      dispatch({ type: "load", payload: data[byIdKey] ?? {} });
    });
  }, []);

  useEffect(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Object.keys(state.byId).map(Number),
      addRules: Object.entries(state.byId).map(([key, item]) => {
        const rule = parseRule(item.rule);
        return { ...rule, id: parseInt(key) };
      }),
    });

    chrome.storage.sync.set({ [byIdKey]: state.byId }).then(() => {
      console.log("Storage set:", state.byId);
    });
  }, [state.byId]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
