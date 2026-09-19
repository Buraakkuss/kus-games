/** Kur'an araması — şartname §35, §78. */
import React, { useMemo, useState } from 'react';
import { router, Stack } from 'expo-router';
import {
  Screen, Field, Card, Column, Row, Text, ArabicText, Badge, Banner, EmptyState, SourceNote,
} from '@/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/lib/i18n';
import { searchArabic, getSource } from '@/features/quran/data';
import { useSettingsStore } from '@/store/settings';

export default function QuranSearchScreen() {
  const t = useT();
  const theme = useTheme();
  const [sorgu, setSorgu] = useState('');
  const settings = useSettingsStore((s) => s.settings);
  const kaynak = useMemo(() => getSource(), []);

  const sonuclar = useMemo(() => (sorgu.trim().length >= 2 ? searchArabic(sorgu, 60) : []), [sorgu]);

  return (
    <Screen scroll motif="girih">
      <Stack.Screen options={{ headerShown: true, title: t('common.search') }} />

      <Field
        label={t('quran.searchArabic')}
        hint={t('quran.searchHint')}
        value={sorgu}
        onChangeText={setSorgu}
        autoCorrect={false}
      />

      <Banner tone="info" title={t('common.search')} description={t('quran.searchOnlyArabic')} />

      {sorgu.trim().length >= 2 ? (
        sonuclar.length === 0 ? (
          <EmptyState icon="search" title={t('quran.noResults')} description={t('quran.searchHint')} />
        ) : (
          <Column gap="md" style={{ marginTop: theme.spacing.md }}>
            <Text variant="caption" tone="muted">{t('quran.searchResults', { count: sonuclar.length })}</Text>
            {sonuclar.map((h) => (
              <Card
                key={`${h.ayah.surah}:${h.ayah.ayah}`}
                onPress={() => router.push(`/reader?surah=${h.ayah.surah}&ayah=${h.ayah.ayah}`)}
              >
                <Column gap="sm">
                  <Row align="center" gap="sm">
                    <Badge label={`${h.surahName} ${h.ayah.ayah}`} tone="neutral" />
                    <Text variant="micro" tone="subtle">{t('quran.juzNo', { n: h.ayah.juz })}</Text>
                  </Row>
                  <ArabicText scale={Math.min(1.2, settings.quran.fontScale)} size="small">
                    {h.ayah.text}
                  </ArabicText>
                </Column>
              </Card>
            ))}
          </Column>
        )
      ) : null}

      <SourceNote source={kaynak.name} license={kaynak.metadataLicense} />
    </Screen>
  );
}
