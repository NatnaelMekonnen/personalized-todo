"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Layout,
  Typography,
  Space,
  Select,
  Table,
  Tag,
  Button,
  Form,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Task } from "@/interface/types";
import { TaskForm } from "./components/TaskForm";
import { ENDPOINTS } from "@/constants/api";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const api = axios.create({
  baseURL: ENDPOINTS.v1,
});
console.log({ENDPOINTS})
// Main TaskManager component
export default function TaskManager() {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () =>
      api.get("").then((res) => {
        if (Array.isArray(res.data)) {
          return res.data;
        } else return [];
      }),
  });

  const addTaskMutation = useMutation({
    mutationFn: (newTask: Omit<Task, "_id" | "priority">) =>
      api.post("", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Task added successfully");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => message.error("Failed to add task"),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: Task) =>
      api.put(`/${updatedTask._id}`, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingTask(null);
      setIsModalVisible(false);
      message.success("Task updated successfully");
    },
    onError: () => message.error("Failed to update task"),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Task deleted successfully");
    },
    onError: () => message.error("Failed to delete task"),
  });

  const handleSubmit = (values: Task) => {
    const task = {
      ...values,
      dueDate: moment(values.dueDate).toISOString(),
    };
    if (editingTask) {
      updateTaskMutation.mutate({
        ...task,
        _id: editingTask._id,
        priority: editingTask.priority,
      });
    } else {
      addTaskMutation.mutate(task);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: moment(task.dueDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      onOk: () => deleteTaskMutation.mutate(id),
    });
  };

  const handleRefresh = () => {
    refetch();
  };
  const filteredTasks = tasks
    ?.filter((task) => filter === "all" || task.category === filter)
    ?.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag
          color={
            priority === "high"
              ? "red"
              : priority === "medium"
              ? "yellow"
              : "green"
          }
        >
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Task) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            danger
          />
        </Space>
      ),
    },
  ];

  if (error) return <div>Error loading tasks</div>;

  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <Title level={2}>Task Manager</Title>
          <Space>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setFilter}
            >
              <Option value="all">All Categories</Option>
              <Option value="work">Work</Option>
              <Option value="personal">Personal</Option>
              <Option value="errands">Errands</Option>
            </Select>
            <Select
              defaultValue="dueDate"
              style={{ width: 120 }}
              onChange={(value: "dueDate" | "priority") => setSortBy(value)}
            >
              <Option value="dueDate">Due Date</Option>
              <Option value="priority">Priority</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Task
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey={(record) => record?._id}
            loading={isLoading}
          />
        </Space>
        <Modal
          title={editingTask ? "Edit Task" : "Add Task"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTask(null);
            form.resetFields();
          }}
          footer={null}
        >
          <TaskForm
            form={form}
            onSubmit={handleSubmit}
            editingTask={editingTask}
          />
        </Modal>
      </Content>
    </Layout>
  );
}
