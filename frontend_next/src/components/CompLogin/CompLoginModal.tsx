import { Modal } from "antd";

import CompLoginForm from "./CompLoginForm";

const APP_NAME = process.env.REACT_APP_NAME || "小成时光屋";

const ModalLogin = (props: {
  visible: boolean;
  onFinishForm: Function;
  onClose?: any;
}) => {
  return (
    <Modal
      title={`${APP_NAME}统一用户系统`}
      footer={null}
      visible={props.visible}
      onCancel={props.onClose}
      width={400}
    >
      <CompLoginForm onClose={props.onClose} />
    </Modal>
  );
};

export default ModalLogin;
