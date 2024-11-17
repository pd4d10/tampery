import { useState, useEffect, FC, useContext } from "react";
import MonacoEditor from "react-monaco-editor";
import { examples } from "./utils";
import { useMatch, useParams } from "react-router-dom";
import { DataContext } from "./context";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { findNewRuleId } from "../utils";

export const Edit: FC = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const { state, dispatch } = useContext(DataContext);

  const navigate = useNavigate();
  const params = useParams<{ id: string; index: string }>();
  const isAdd = useMatch("/add/:id");
  const isEdit = useMatch("/edit/:id");

  useEffect(() => {
    if (!params.id) throw new Error("no id");
    const currentId = parseInt(params.id);

    if (isAdd) {
      const example = examples[currentId];
      if (example) {
        setTitle(example.title);
        setCode(example.code);
      }
    } else if (isEdit) {
      const item = state.byId[currentId];
      if (item) {
        setTitle(item.title);
        setCode(item.rule);
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
    <Form>
      <Form.Item {...formItemLayout} label="Title" required>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Rule">
        <div style={{ border: "1px solid #eee" }}>
          <MonacoEditor
            language="jsonc"
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
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          onClick={async (e) => {
            // e.preventDefault()
            if (isAdd) {
              const id = await findNewRuleId();
              dispatch({
                type: "add",
                payload: [id, { title, rule: code }],
              });
            } else if (isEdit) {
              //
            }
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
      </Form.Item>
    </Form>
  );
};
