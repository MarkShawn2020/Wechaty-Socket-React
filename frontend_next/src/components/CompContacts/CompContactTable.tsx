import React from "react";
import { Avatar, Card, Empty, Space, Table } from "antd";
import { ContactItem } from "../../interface";
import { SyncOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import MyIcon, { IconType } from "../CompIcon";

const CompContactTable = (props: {
  contacts: ContactItem[];
  onRequestContacts: () => void;
}) => {
  console.log(
    `rendered CompContacts with data length ${props.contacts.length}`
  );

  const contactsColumn: ColumnsType = [
    {
      title: "好友",
      dataIndex: "name",
      filtered: true,
      render: (text: string, record: ContactItem) => {
        return (
          <Space>
            <Avatar src={record.avatar} />
            <p>{text}</p>
          </Space>
        );
      },
    },

    {
      title: "昵称",
      dataIndex: "alias",
      render: (text: string) => {
        return text || "-";
      },
    },
    {
      title: "性别",
      dataIndex: "gender",
      render: (text: string, record: ContactItem) => {
        switch (record.gender) {
          case 1:
            return <MyIcon type={IconType.GENDER_MALE} />;
          case 2:
            return <MyIcon type={IconType.GENDER_FEMALE} />;
          case 0:
            return "-";
        }
      },
    },
  ];

  return (
    <Card
      title={"好友列表"}
      bodyStyle={{ padding: 0 }}
      extra={<SyncOutlined onClick={props.onRequestContacts} />}
    >
      {props.contacts.length > 0 ? (
        <Table dataSource={props.contacts} columns={contactsColumn} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

const MemoContacts = React.memo(CompContactTable);
export default MemoContacts;
