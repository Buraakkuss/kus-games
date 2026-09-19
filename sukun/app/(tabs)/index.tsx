/**
 * Ana Sayfa — şartname §14, §20.
 * Sıradaki vakit, canlı geri sayım, günün altı vakti.
 */
import React, { useMemo } from 'react';
import { router } from 'expo-router';
import {
  Screen, SectionHeader, Card, Text, Column, Row, CountdownRing, Button, EmptyState, Banner,
} from '@/ui';
import { useT } from '@/lib/i18n';
import { useLocationStore } from '@/store/locations';
import { useSettingsStore } from '@/store/settings';
import { useLiveView } from '@/features/prayer/useSchedule';
import { PrayerList, usePrayerLabel } from '@/features/prayer/components/PrayerList';
import { formatCountdown } from '@/features/prayer/calc';
import type { ScheduleInput } from '@/features/prayer/schedule';
import type { MethodId, AsrShadow } from '@/features/prayer/methods';

export default function HomeScreen() {
  const t = useT();
  const label = usePrayerLabel();
  const konum = useLocationStore((s) => s.active());
  const settings = useSettingsStore((s) => s.settings);

  const input = useMemo<ScheduleInput | null>(() => {
    if (!konum) return null;
    return {
      latitude: konum.latitude,
      longitude: konum.longitude,
      timezone: konum.timezone,
      options: {
        method: settings.method as MethodId,
        asrShadow: settings.asrShadow as AsrShadow,
        adjustments: settings.adjustments as Record<string, number>,
        ...(konum.elevation === undefined ? {} : { elevation: konum.elevation }),
      },
    };
  }, [konum, settings]);

  const live = useLiveView(input);

  if (!konum) {
    return (
      <Screen motif="rubElHizb">
        <EmptyState
          icon="location"
          title={t('location.empty')}
          description={t('location.permissionBody')}
          actionLabel={t('location.add')}
          onAction={() => router.push('/location')}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll motif="rubElHizb">
      <SectionHeader
        title={konum.label}
        subtitle={konum.country}
        actionLabel={t('common.edit')}
        onAction={() => router.push('/location')}
      />

      <Card accent motif="starLattice">
        <Column gap="lg" align="center">
          <Text variant="callout" tone="onAccent">{t('prayer.next')}</Text>
          {live?.next ? (
            <CountdownRing
              progress={live.progress}
              accessibilityLabel={t('prayer.remainingTo', {
                name: label(live.next.key),
                time: formatCountdown(live.secondsToNext),
              })}
            >
              <Column align="center" gap="xxs">
                <Text variant="title2" tone="onAccent">{label(live.next.key)}</Text>
                <Text variant="display" tone="onAccent">{formatCountdown(live.secondsToNext)}</Text>
              </Column>
            </CountdownRing>
          ) : (
            <Text variant="body" tone="onAccent" align="center">{t('prayer.polarNote')}</Text>
          )}
        </Column>
      </Card>

      <SectionHeader
        title={t('prayer.todayTimes')}
        actionLabel={t('prayer.settings')}
        onAction={() => router.push('/prayer-settings')}
      />
      {live ? (
        <Card>
          <PrayerList day={live.today} highlight={live.current} />
        </Card>
      ) : (
        <Banner tone="info" title={t('common.loading')} />
      )}

      <Row style={{ marginTop: 16 }}>
        <Button
          label={t('prayer.calendar')}
          icon="calendar"
          variant="secondary"
          onPress={() => router.push('/prayer-calendar')}
        />
      </Row>
    </Screen>
  );
}
