interface MessageBase {
  id: string;
}

interface MessageAdd extends MessageBase {
  type: "add";
  name: string;
  code: string;
  active: boolean;
}

interface MessageDelete extends MessageBase {
  type: "delete";
}

interface MessageActivate extends MessageBase {
  type: "activate";
}

interface MessageDeactivate extends MessageBase {
  type: "deactivate";
}

export type Message =
  | MessageAdd
  | MessageDelete
  | MessageActivate
  | MessageDeactivate;

export type MessageRes = {
  code: number;
  message: string;
};
