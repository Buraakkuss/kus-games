/** Profil ve ayarlar — şartname §59, §60. */
import React from 'react';
import { Screen, SectionHeader, Card, ListItem, Segmented, Column, Text, Icon } from '@/ui';
import { useI18n, useT, LANGUAGES, LANGUAGE_NAMES } from '@/lib/i18n';
import { useThemeContext, type ThemeMode } from '@/theme/ThemeProvider';
import { Brand } from '@/config/brand';

export default function ProfileScreen() {
  const t = useT();
  const { language, setLanguage } = useI18n();
  const { mode, setMode } = useThemeContext();

  const temaSecenekleri: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];

  return (
    <Screen scroll>
      <SectionHeader title={t('profile.title')} subtitle={t('profile.guest')} />

      <SectionHeader title={t('settings.appearance')} />
      <Column gap="sm">
        <Text variant="caption" tone="muted">{t('settings.theme')}</Text>
        <Segmented
          options={temaSecenekleri}
          value={mode}
          onChange={setMode}
          accessibilityLabel={t('settings.theme')}
        />
      </Column>

      <SectionHeader title={t('settings.language')} subtitle={t('settings.languageRestart')} />
      <Card padding="sm">
        {LANGUAGES.map((l) => (
          <ListItem
            key={l}
            title={LANGUAGE_NAMES[l]}
            chevron={false}
            {...(l === language ? { right: <Icon name="check" size={18} /> } : {})}
            onPress={() => setLanguage(l)}
          />
        ))}
      </Card>

      <SectionHeader title={t('settings.about')} />
      <Card padding="sm">
        <ListItem title={t('settings.version')} value={Brand.version} chevron={false} />
        <ListItem title={t('settings.privacy')} icon="lock" chevron />
        <ListItem title={t('settings.terms')} icon="book" chevron />
      </Card>
    </Screen>
  );
}
