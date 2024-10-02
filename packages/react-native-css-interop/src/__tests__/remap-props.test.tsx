/** @jsxImportSource test */
import { FlatList, View } from "react-native";

import { RefObject, useRef } from "react";
import {
  render,
  screen,
  registerCSS,
  resetComponents,
  remapProps,
  getOpaqueStyles,
} from "test";
import { StyleRuleSetSymbol, StyleRuleSymbol } from "../shared";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetComponents();
});

test("mapping", () => {
  remapProps(View as any, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {},
  });

  expect(getOpaqueStyles(component.props.differentStyle)).toStrictEqual([
    {
      [StyleRuleSetSymbol]: true,
      normal: [
        {
          [StyleRuleSymbol]: true,
          d: [
            [
              {
                backgroundColor: "#000000",
              },
            ],
          ],
          s: [1, 1],
        },
      ],
    },
    {
      [StyleRuleSetSymbol]: true,
      normal: [
        {
          [StyleRuleSymbol]: true,
          d: [
            [
              {
                color: "#ffffff",
              },
            ],
          ],
          s: [2, 1],
        },
      ],
    },
  ]);
});

test("works with ref", () => {
  remapProps(FlatList, {});
  let listRef: RefObject<FlatList<any>> = { current: null };
  const items = Array.from(Array(100).keys());

  const Component = () => {
    listRef = useRef<FlatList>(null);
    return (
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={(_) => <View />}
      />
    );
  };

  render(<Component />);

  expect(listRef.current).toBeInstanceOf(FlatList);
});
