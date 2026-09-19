/** Kuran — şartname §27. Okuyucu FAZ 4'te eklenir. */
import React from 'react';
import { Screen, SectionHeader, Banner } from '@/ui';
import { useT } from '@/lib/i18n';

export default function QuranScreen() {
  const t = useT();
  return (
    <Screen scroll motif="girih">
      <SectionHeader title={t('quran.title')} subtitle={t('quran.surahs')} />
      <Banner tone="info" title={t('common.source')} description={t('quran.contentPending')} />
    </Screen>
  );
}
