/** Keşfet — şartname §22–§26, §45, §53. */
import React from 'react';
import { router } from 'expo-router';
import { Screen, SectionHeader, Card, ListItem } from '@/ui';
import { useT } from '@/lib/i18n';
import { PendingContentSection } from '@/features/daily/components/DailyCards';

export default function ExploreScreen() {
  const t = useT();
  return (
    <Screen scroll motif="arch">
      <SectionHeader title={t('explore.title')} />
      <Card padding="sm">
        <ListItem title={t('search.title')} icon="search" onPress={() => router.push('/search')} />
      </Card>
      <Card padding="sm">
        <ListItem title={t('explore.dailyDua')} icon="heart" onPress={() => router.push('/duas')} />
        <ListItem title={t('explore.dailyInfo')} icon="info" onPress={() => router.push('/knowledge')} />
        <ListItem title={t('worship.names')} icon="star" onPress={() => router.push('/names')} />
        <ListItem title={t('explore.hijri')} icon="calendar" onPress={() => router.push('/hijri')} />
        <ListItem title={t('explore.religiousDays')} icon="moon" onPress={() => router.push('/hijri')} />
        <ListItem title={t('ramadan.title')} icon="moon" onPress={() => router.push('/ramadan')} />
        <ListItem title={t('khatm.title')} icon="book" onPress={() => router.push('/khatm')} />
        <ListItem title={t('worship.zakat')} icon="star" onPress={() => router.push('/zakat')} />
        <ListItem title={t('hajj.title')} icon="location" onPress={() => router.push('/hajj')} />
      </Card>

      <PendingContentSection title={t('explore.dailyAyah')} />
      <PendingContentSection title={t('explore.dailyHadith')} />
    </Screen>
  );
}
