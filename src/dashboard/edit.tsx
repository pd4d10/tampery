import { useState, useEffect, FC, useContext } from "react";
import { v4 } from "uuid";
import MonacoEditor from "react-monaco-editor";
import { examples } from "./utils";
import { useMatch, useParams } from "react-router-dom";
import { DataContext } from "./context";
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";

export const Edit: FC = () => {
  const [currentId, setCurrentId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const { data, add } = useContext(DataContext);

  const navigate = useNavigate();
  const params = useParams<{ id: string; index: string }>();
  const isAdd = useMatch("/add/:id");
  const isEdit = useMatch("/edit/:id");

  useEffect(() => {
    if (isAdd) {
      const id = v4();
      const index = params.index!;
      const { name, code } = examples[parseInt(index)];
      setCurrentId(id);
      setName(name);
      setCode(code);
    } else if (isEdit) {
      const id = params.id!;
      const item = data[id];

      // Fix reload page, data doesn't be loaded into state at first time
      if (item) {
        const { name, code } = data[id];
        setCurrentId(id);
        setName(name);
        setCode(code);
      }
    }
  }, []);

  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      sm: {
        span: 16,
        offset: 4,
      },
    },
  };

  return (
    <FormGroup
      helperText="Helper text with details..."
      label="Label A"
      labelFor="text-input"
      labelInfo="(required)"
    >
      <InputGroup id="text-input" placeholder="Placeholder text" />
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <div style={{ border: "1px solid #eee" }}>
        <MonacoEditor
          language="javascript"
          // theme="vs-dark"
          height={400}
          // width={600}
          value={code}
          options={{ contextmenu: false, scrollBeyondLastLine: false }}
          onChange={(value) => {
            setCode(value);
          }}
          editorDidMount={(editor, monaco) => {
            // editor.focus()
          }}
        />
      </div>
      <Button
        intent="primary"
        onClick={async () => {
          // e.preventDefault()
          await add(currentId, name, code, true);

          navigate("/");
        }}
      >
        Save
      </Button>{" "}
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
        Cancel
      </Button>
    </FormGroup>
  );
};
