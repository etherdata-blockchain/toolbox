import * as React from "react";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { Card } from "antd";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";

export function ArrayField(props: ArrayFieldTemplateProps) {
  const { TitleField, DescriptionField } = props;
  return (
    <div>
      <TitleField id={""} title={props.title} required={props.required} />
      <DescriptionField
        id={props.idSchema.$id}
        description={props.schema.description}
      />
      <Grid key={`array-item-list-${props.idSchema.$id}`}>
        <GridItem>
          {props.items.map((ele) => (
            <Card>{ele.children}</Card>
          ))}
        </GridItem>
        {props.canAdd && (
          <GridItem justifySelf={"flex-end"}>
            <Box mt={2}>
              <Button type="button" onClick={props.onAddClick}>
                Add
              </Button>
            </Box>
          </GridItem>
        )}
      </Grid>
    </div>
  );
}
