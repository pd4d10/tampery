import { RuleWithoutId } from "./dashboard/context";

interface MessageBase {
  id: string;
}

interface MessageAdd extends MessageBase {
  type: "add";
  active: boolean;
  rule: RuleWithoutId;
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
