/** Ana Sayfa — şartname §20. İçerik FAZ 2–3'te doldurulur. */
import React from 'react';
import { Screen, SectionHeader, Card, Text, Column } from '@/ui';
import { useT } from '@/lib/i18n';

export default function HomeScreen() {
  const t = useT();
  return (
    <Screen scroll motif="rubElHizb">
      <SectionHeader title={t('nav.home')} subtitle={t('prayer.todayTimes')} />
      <Card motif="starLattice">
        <Column gap="sm">
          <Text variant="title3">{t('prayer.next')}</Text>
          <Text tone="muted">{t('common.loading')}</Text>
        </Column>
      </Card>
    </Screen>
  );
}
