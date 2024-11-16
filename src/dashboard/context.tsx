import React, { useState, useEffect, createContext, FC } from "react";
import { sendMessage } from "./utils";
import { storage } from "../utils";

type Data = {
  [id: string]: {
    name: string;
    active: boolean;
    code: string;
  };
};

function noop() {}

export const DataContext = createContext({
  data: {} as Data,
  activate: noop as (id: string) => void,
  deactivate: noop as (id: string) => void,
  remove: noop as (id: string) => void,
  add: noop as (
    id: string,
    name: string,
    code: string,
    active: boolean,
  ) => void,
  loadFromStorage: noop,
});

export const DataProvider: FC = ({ children }) => {
  const [data, setData] = useState<Data>({});

  const loadFromStorage = async () => {
    const newData = await storage.get();
    setData(newData);
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  const activate = async (id: string) => {
    await sendMessage({ type: "activate", id });
    await loadFromStorage();
  };

  const deactivate = async (id: string) => {
    await sendMessage({ type: "deactivate", id });
    await loadFromStorage();
  };

  const remove = async (id: string) => {
    await sendMessage({ type: "delete", id });
    await loadFromStorage();
  };

  const add = async (
    id: string,
    name: string,
    code: string,
    active: boolean,
  ) => {
    await sendMessage({
      type: "add",
      id,
      name,
      code,
      active,
    });
    await loadFromStorage();
  };

  return (
    <DataContext.Provider
      value={{ data, activate, deactivate, remove, add, loadFromStorage }}
    >
      {children}
    </DataContext.Provider>
  );
};
