import { Modal, type ModalProps } from 'antd';
import type { ReactNode } from 'react';

interface AppModalProps extends Omit<ModalProps, 'title'> {
  title: string;
  children: ReactNode;
}

export function AppModal({ title, children, ...rest }: AppModalProps) {
  return (
    <Modal
      title={title}
      destroyOnClose
      maskClosable={false}
      {...rest}
    >
      {children}
    </Modal>
  );
}
