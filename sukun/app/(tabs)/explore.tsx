/** Keşfet — şartname §22–§26, §45, §53. İçerik FAZ 3'te doldurulur. */
import React from 'react';
import { Screen, SectionHeader, Card, ListItem } from '@/ui';
import { useT } from '@/lib/i18n';

export default function ExploreScreen() {
  const t = useT();
  return (
    <Screen scroll motif="arch">
      <SectionHeader title={t('explore.title')} />
      <Card padding="sm">
        <ListItem title={t('explore.hijri')} icon="calendar" chevron />
        <ListItem title={t('explore.religiousDays')} icon="moon" chevron />
        <ListItem title={t('explore.articles')} icon="book" chevron />
        <ListItem title={t('explore.community')} icon="users" chevron />
      </Card>
    </Screen>
  );
}
