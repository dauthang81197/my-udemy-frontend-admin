import { useState } from "react";
import { Form, Input, Button, Space, Progress, Upload, Switch } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UploadFile } from "antd";
import { message } from "antd";
import { AppModal } from "@/components/common/AppModal";
import {
  useUploadVideo,
  useUploadMultipleVideos,
} from "../hooks/useVideoActions";

const { Dragger } = Upload;

const schema = z.object({
  nameSection: z.string().min(1, "Name is required").max(200),
});

type FormValues = z.infer<typeof schema>;

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function VideoUploadModal({ open, onClose }: VideoUploadModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [multipleMode, setMultipleMode] = useState(false);

  const { mutate: uploadVideo, isPending: isSinglePending } = useUploadVideo();
  const { mutate: uploadMultiple, isPending: isMultiplePending } =
    useUploadMultipleVideos();
  const isPending = isSinglePending || isMultiplePending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nameSection: "" },
  });

  const handleClose = () => {
    reset();
    setFileList([]);
    setSelectedFiles([]);
    setProgress(0);
    onClose();
  };

  const handleModeChange = (checked: boolean) => {
    setMultipleMode(checked);
    setFileList([]);
    setSelectedFiles([]);
    setProgress(0);
  };

  const onSubmit = (values: FormValues) => {
    if (selectedFiles.length === 0) {
      message.warning("Please select at least one video file");
      return;
    }
    setProgress(0);

    if (multipleMode) {
      uploadMultiple(
        {
          nameSection: values.nameSection,
          files: selectedFiles,
          onProgress: setProgress,
        },
        { onSuccess: handleClose },
      );
    } else {
      uploadVideo(
        {
          nameSection: values.nameSection,
          file: selectedFiles[0],
          onProgress: setProgress,
        },
        { onSuccess: handleClose },
      );
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("video/")) {
      message.error(`${file.name}: only video files are allowed`);
      return false;
    }
    // Thêm check này
    if (file.size === 0) {
      message.error(`${file.name}: file is empty (0 bytes)`);
      return false;
    }
    if (file.size / 1024 / 1024 / 1024 >= 2) {
      message.error(`${file.name}: must be smaller than 2GB`);
      return false;
    }
    return true;
  };

  return (
    <AppModal
      title="Upload Video"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ marginTop: 16 }}
      >
        <Form.Item>
          <Space>
            <Switch
              checked={multipleMode}
              onChange={handleModeChange}
              disabled={isPending}
            />
            <span>Upload multiple files</span>
          </Space>
        </Form.Item>

        <Form.Item
          label={multipleMode ? "Section Name" : "Video Name"}
          validateStatus={errors.nameSection ? "error" : ""}
          help={errors.nameSection?.message}
        >
          <Controller
            name="nameSection"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={
                  multipleMode ? "Enter section name" : "Enter video name"
                }
              />
            )}
          />
        </Form.Item>

        <Form.Item label="File(s)" required>
          <Dragger
            multiple={multipleMode}
            fileList={fileList}
            beforeUpload={(file) => {
              if (!validateFile(file)) return Upload.LIST_IGNORE;
              if (!multipleMode) {
                setSelectedFiles([file]);
                setFileList([file as unknown as UploadFile]);
              } else {
                setSelectedFiles((prev) => [...prev, file]);
                setFileList((prev) => [...prev, file as unknown as UploadFile]);
              }
              return false;
            }}
            onRemove={(removedFile) => {
              setFileList((prev) =>
                prev.filter((f) => f.uid !== removedFile.uid),
              );
              setSelectedFiles((prev) =>
                prev.filter((f) => f.name !== removedFile.name),
              );
            }}
            accept="video/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {multipleMode
                ? "Click or drag video files here"
                : "Click or drag video file here"}
            </p>
            <p className="ant-upload-hint">
              Supports MP4, MOV, AVI — up to 2GB each
            </p>
          </Dragger>
        </Form.Item>

        {isPending && (
          <Progress
            percent={progress}
            status="active"
            style={{ marginBottom: 12 }}
          />
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              disabled={!fileList.length}
            >
              {isPending
                ? "Uploading..."
                : multipleMode
                  ? `Upload${fileList.length > 0 ? ` (${fileList.length})` : ""}`
                  : "Upload"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </AppModal>
  );
}
