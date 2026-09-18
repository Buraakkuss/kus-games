/** Liste satırı — ayarlar, sure listesi, zikir listesi. Şartname §8. */
import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Row, Column } from './Stack';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Sağdaki değer metni (ör. saat, seçili yöntem adı). */
  value?: string;
  icon?: IconName;
  /** Sağda özel bileşen — anahtar, rozet. */
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Sağda ok işareti göster (alt sayfaya gider). */
  chevron?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  title, subtitle, value, icon, right, onPress, disabled = false, chevron, style,
}: ListItemProps) {
  const theme = useTheme();
  const showChevron = chevron ?? (!!onPress && !right);
  const body = (
    <Row gap="md" align="center" style={{ minHeight: 52, paddingVertical: theme.spacing.sm }}>
      {icon ? <Icon name={icon} color={theme.colors.accent} /> : null}
      <Column flex={1} gap="xxs">
        <Text variant="bodyStrong">{title}</Text>
        {subtitle ? <Text variant="caption" tone="muted">{subtitle}</Text> : null}
      </Column>
      {value ? <Text variant="callout" tone="muted">{value}</Text> : null}
      {right}
      {showChevron ? <Icon name="chevronRight" size={18} color={theme.colors.textSubtle} /> : null}
    </Row>
  );
  if (!onPress) return <View style={style}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: disabled ? theme.opacity.disabled : pressed ? 0.7 : 1 }, style]}
    >
      {body}
    </Pressable>
  );
}
