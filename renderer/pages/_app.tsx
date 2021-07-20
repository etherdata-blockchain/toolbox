import { AppProps } from "next/app";
import { RemoteSshProvider } from "../models/remoteSSH";
import { CodepenOutlined, HomeOutlined } from "@ant-design/icons";
import { PageLayout } from "../component/pageLayout";
import { RemoteActions } from "./remote_ssh/components/actions";
import "antd/dist/antd.css";
import "../styles/Global.css";

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const menus = [
    {
      title: "Home",
      icon: <HomeOutlined />,
      link: "/home",
    },
    {
      title: "Remote SSH",
      icon: <CodepenOutlined />,
      link: "/remote_ssh",
      actions: <RemoteActions />,
    },
  ];

  return (
    <RemoteSshProvider>
      <PageLayout menus={menus}>
        <Component {...pageProps} />
      </PageLayout>
    </RemoteSshProvider>
  );
}

export default MyApp;
