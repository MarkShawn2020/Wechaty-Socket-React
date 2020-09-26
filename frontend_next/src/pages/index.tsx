import { ConfigProvider, Layout } from "antd";

import App from "../components/App";

export default function Home() {
  return (
    <div className=" min-h-screen min-w-full">
      {/* 配置主视图为宽度一半居中 */}
      <div className="w-full lg:w-3/5 mx-auto">
        {/* 配置AntD的全局组件默认尺寸为小 */}
        <ConfigProvider componentSize="small">
          <Layout className="relative">
            <App />
          </Layout>
        </ConfigProvider>
      </div>
    </div>
  );
}
