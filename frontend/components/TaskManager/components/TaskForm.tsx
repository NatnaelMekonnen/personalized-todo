import { Task } from "@/interface/types";
import { Button, DatePicker, Form, FormInstance, Input, Select } from "antd";

const { Option } = Select;

export function TaskForm({
  form,
  onSubmit,
  editingTask,
}: {
  form: FormInstance;
  onSubmit: (values: Task) => void;
  editingTask: Task | null;
}) {
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="dueDate"
        label="Due Date"
        rules={[{ required: true, message: "Please select the due date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select the category!" }]}
      >
        <Select>
          <Option value="work">Work</Option>
          <Option value="personal">Personal</Option>
          <Option value="errands">Errands</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editingTask ? "Update" : "Add"} Task
        </Button>
      </Form.Item>
    </Form>
  );
}