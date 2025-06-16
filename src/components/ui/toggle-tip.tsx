import { Popover as ChakraPopover, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface ToggleTipProps extends ChakraPopover.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content?: React.ReactNode;
}

export const ToggleTip = React.forwardRef<HTMLDivElement, ToggleTipProps>(
  function ToggleTip(props, ref) {
    const {
      showArrow,
      children,
      portalled = true,
      content,
      portalRef,
      ...rest
    } = props;

    return (
      <ChakraPopover.Root
        {...rest}
        positioning={{ ...rest.positioning, gutter: 4 }}
      >
        <ChakraPopover.Trigger asChild>{children}</ChakraPopover.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraPopover.Positioner>
            <ChakraPopover.Content
              width="auto"
              maxW="200px"
              px="2"
              py="1"
               bg="#fed2ea"   
  color="black"
  boxShadow="lg"
              textStyle="xs"
              rounded="sm"
              ref={ref}
            >
              {showArrow && (
                <ChakraPopover.Arrow>
                  <ChakraPopover.ArrowTip />
                </ChakraPopover.Arrow>
              )}
              {content}
            </ChakraPopover.Content>
          </ChakraPopover.Positioner>
        </Portal>
      </ChakraPopover.Root>
    );
  }
);
