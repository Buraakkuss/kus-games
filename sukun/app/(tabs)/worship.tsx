/** İbadet — şartname §37–§49. Araçlar FAZ 7–9'da eklenir. */
import React from 'react';
import { Screen, SectionHeader, ListItem, Card } from '@/ui';
import { useT } from '@/lib/i18n';

export default function WorshipScreen() {
  const t = useT();
  return (
    <Screen scroll motif="octagonGrid">
      <SectionHeader title={t('worship.title')} />
      <Card padding="sm">
        <ListItem title={t('worship.dhikr')} icon="beads" chevron />
        <ListItem title={t('worship.duas')} icon="heart" chevron />
        <ListItem title={t('worship.names')} icon="star" chevron />
        <ListItem title={t('worship.qada')} icon="check" chevron />
      </Card>
    </Screen>
  );
}
