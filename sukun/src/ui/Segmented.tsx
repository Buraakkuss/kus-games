/** Segment seçici — ikiden dörde kadar seçenek. Şartname §8. */
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export interface SegmentedOption<T extends string> { value: T; label: string }

export interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedProps<T>) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceRaised,
        borderRadius: theme.radius.pill,
        padding: theme.spacing.xxs,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              minHeight: 38,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radius.pill,
              backgroundColor: active ? theme.colors.surface : 'transparent',
            }}
          >
            <Text variant="callout" tone={active ? 'accent' : 'muted'}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
