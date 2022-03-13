import * as React from "react";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from "@chakra-ui/icons";

export function ArrayField(props: ArrayFieldTemplateProps) {
  const { TitleField, DescriptionField } = props;
  return (
    <div>
      <TitleField id={""} title={props.title} required={props.required} />
      <DescriptionField
        id={props.idSchema.$id}
        description={props.schema.description}
      />
      <Box key={`array-item-list-${props.idSchema.$id}`}>
        {props.items.map((ele, index) => (
          <Box borderWidth="1px" borderRadius="lg" p={5} mb={5}>
            <Heading as={"h6"} size={"sm"}>
              # {ele.index + 1}
            </Heading>
            <Stack direction={"row"}>
              <Box flex={14}>{ele.children}</Box>
              {ele.hasToolbar && (
                <Stack direction={"row"} flex={2}>
                  {ele.hasRemove && (
                    <Tooltip label={"Remove"}>
                      <IconButton
                        aria-label={"remove"}
                        icon={<MinusIcon />}
                        onClick={ele.onDropIndexClick(ele.index)}
                      />
                    </Tooltip>
                  )}
                  {ele.hasMoveUp && (
                    <Tooltip label={"Move Item Up"}>
                      <IconButton
                        aria-label={"Move up"}
                        icon={<ChevronUpIcon />}
                        onClick={ele.onReorderClick(ele.index, ele.index - 1)}
                      />
                    </Tooltip>
                  )}
                  {ele.hasMoveDown && (
                    <Tooltip label={"Move Item Down"}>
                      <IconButton
                        aria-label={"Move Down"}
                        icon={<ChevronDownIcon />}
                        onClick={ele.onReorderClick(ele.index, ele.index + 1)}
                      />
                    </Tooltip>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>
        ))}

        <Flex>
          <Spacer />
          {props.canAdd && (
            <Box mt={2}>
              <Button type="button" onClick={props.onAddClick}>
                Add
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
    </div>
  );
}
