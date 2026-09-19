/** Kur'an ana ekranı — şartname §27, §29, §30. */
import React, { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  Screen, SectionHeader, Card, ListItem, Segmented, Row, Column, Text, Badge, Button, EmptyState, SourceNote,
} from '@/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/lib/i18n';
import { getSurahs, getJuzStarts, getSource } from '@/features/quran/data';
import { useReadingStore } from '@/store/reading';

type Sekme = 'surahs' | 'juz' | 'bookmarks';

export default function QuranScreen() {
  const t = useT();
  const theme = useTheme();
  const [sekme, setSekme] = useState<Sekme>('surahs');
  const position = useReadingStore((s) => s.position);
  const bookmarks = useReadingStore((s) => s.bookmarks);

  const sureler = useMemo(() => getSurahs(), []);
  const cuzler = useMemo(() => getJuzStarts(), []);
  const kaynak = useMemo(() => getSource(), []);

  const sureAdi = (n: number) => sureler.find((s) => s.number === n)?.nameTr ?? String(n);

  return (
    <Screen scroll motif="girih">
      <SectionHeader title={t('quran.title')} />

      {position ? (
        <Card accent motif="starLattice" onPress={() => router.push(`/reader?surah=${position.surah}&ayah=${position.ayah}`)}>
          <Column gap="xs">
            <Text variant="caption" tone="onAccent">{t('quran.continue')}</Text>
            <Text variant="title3" tone="onAccent">
              {t('quran.continueAt', { surah: sureAdi(position.surah), ayah: position.ayah })}
            </Text>
          </Column>
        </Card>
      ) : null}

      <Row gap="sm" style={{ marginTop: theme.spacing.lg }}>
        <Button
          label={t('common.search')}
          icon="search"
          variant="secondary"
          size="sm"
          onPress={() => router.push('/quran-search')}
        />
      </Row>

      <Segmented
        options={[
          { value: 'surahs', label: t('quran.surahs') },
          { value: 'juz', label: t('quran.juz') },
          { value: 'bookmarks', label: t('quran.bookmarks') },
        ]}
        value={sekme}
        onChange={(v) => setSekme(v as Sekme)}
        accessibilityLabel={t('quran.title')}
      />

      {sekme === 'surahs' ? (
        <Card padding="sm" style={{ marginTop: theme.spacing.md }}>
          {sureler.map((s) => (
            <ListItem
              key={s.number}
              title={`${s.number}. ${s.nameTr}`}
              subtitle={`${t('quran.ayahCount', { count: s.ayahCount })} · ${s.revelation === 'mekki' ? t('quran.mekki') : t('quran.medeni')}`}
              value={s.nameAr}
              onPress={() => router.push(`/reader?surah=${s.number}&ayah=1`)}
            />
          ))}
        </Card>
      ) : null}

      {sekme === 'juz' ? (
        <Card padding="sm" style={{ marginTop: theme.spacing.md }}>
          {cuzler.map((c) => (
            <ListItem
              key={c.juz}
              title={t('quran.juzNo', { n: c.juz })}
              subtitle={`${sureAdi(c.surah)} ${c.ayah}`}
              onPress={() => router.push(`/reader?surah=${c.surah}&ayah=${c.ayah}`)}
            />
          ))}
        </Card>
      ) : null}

      {sekme === 'bookmarks' ? (
        bookmarks.length === 0 ? (
          <EmptyState icon="bookmark" title={t('quran.noBookmarks')} description={t('empty.body')} />
        ) : (
          <Card padding="sm" style={{ marginTop: theme.spacing.md }}>
            {bookmarks.map((b) => (
              <ListItem
                key={b.id}
                title={`${sureAdi(b.surah)} ${b.ayah}`}
                {...(b.note ? { subtitle: b.note } : {})}
                right={<Badge label={b.color} tone="neutral" />}
                onPress={() => router.push(`/reader?surah=${b.surah}&ayah=${b.ayah}`)}
              />
            ))}
          </Card>
        )
      ) : null}

      <SourceNote source={kaynak.name} license={kaynak.metadataLicense} />
      <Text variant="micro" tone="subtle">{t('quran.sourceNote')}</Text>
    </Screen>
  );
}
