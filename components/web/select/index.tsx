import React from 'react';
import { Select } from 'react-select-virtualized';
import { View } from 'react-native';

export default function SearchableDropdown({
  containerStyle,
  items,
  onItemSelect,
  textInputProps,
  inputHeight,
}) {
  const options = items.map(({ name, value }) => ({ label: name, value }));

  return (
    <View style={[containerStyle, { overflow: 'visible' }]}>
      <Select
        isClearable={false}
        optionHeight={36}
        theme={(theme) => {
          return {
            ...theme,
            borderRadius: 10,
            colors: {
              ...theme.colors,
              primary25: '#4C9AFF',
              primary: '#4C9AFF',
            },
            spacing: {
              ...theme.spacing,
              controlHeight: inputHeight,
              menuGlutter: 0,
            },
          };
        }}
        styles={{
          container: (provided, state) => ({
            ...provided,
            fontSize: 14,
            border: 'none',
            fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`,
          }),
          control: (provided, state) => ({
            ...provided,
            border: 'none',
            minHeight: inputHeight,
            zIndex: 0,
          }),
          menu: (provided, state) => ({
            ...provided,
            zIndex: 9999,
          }),
        }}
        isSearchable
        autoFocus
        name="city"
        placeholder={textInputProps && textInputProps.placeholder}
        options={options}
        onChange={({ label, value }) => onItemSelect({ name: label, value })}
      />
    </View>
  );
}
