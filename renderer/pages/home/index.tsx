// @flow
import * as React from "react";
import { Card, Col, Row, Typography } from "antd";
import { INSTALL_APPS } from "../../lib/install_apps";

type Props = {};

function Home(props: Props) {
  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <Typography.Title>ETD toolbox</Typography.Title>
      </Col>
      {INSTALL_APPS.map((app, index) => (
        <Col span={12} key={index}>
          <Card title={app.title} key={index}>
            <Typography.Paragraph>{app.description}</Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Home;
