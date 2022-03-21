// @flow
import * as React from "react";
import { Button, Card, Layout, Menu, Row, Typography } from "antd";
import { useRouter } from "next/router";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Header, Content, Sider } = Layout;
const headerHeight = 50;

type MenuInterface = {
  title: string;
  icon: JSX.Element;
  link: string;
  actions?: JSX.Element;
};

type Props = {
  children: any;
  menus: MenuInterface[];
};

export function PageLayout({ children, menus }: Props) {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = React.useState<MenuInterface>();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname === "/") {
      debugger;
      let menu = menus.find((m) => m.link === "/");
      setSelectedMenu(menu);
    } else {
      let menu = menus.find(
        (m) => router.pathname.includes(m.link) && m.link !== "/"
      );
      setSelectedMenu(menu);
    }
  }, [router.pathname]);

  return (
    <Layout>
      <Card
        style={{ margin: 0, padding: 0, height: headerHeight }}
        bodyStyle={{ padding: 10 }}
      >
        <Row>
          <Button
            style={{ marginRight: 10 }}
            type={"link"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Title level={5}>{selectedMenu?.title}</Title>
          <div style={{ flexGrow: 1 }}></div>
          {selectedMenu?.actions}
        </Row>
      </Card>
      <Layout style={{ height: "100%", backgroundColor: "white" }}>
        <Sider
          style={{ height: "100%" }}
          collapsible={true}
          collapsed={collapsed}
          trigger={null}
          collapsedWidth={60}
        >
          <Menu
            mode={"inline"}
            style={{ height: `calc(100vh - ${headerHeight}px)` }}
            selectedKeys={[selectedMenu?.link]}
          >
            {menus.map((m) => (
              <Menu.Item
                key={m.link}
                icon={m.icon}
                onClick={async () => {
                  await router.push(m.link);
                }}
              >
                {m.title}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content
          style={{
            padding: 10,
            overflowY: "scroll",
            height: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
