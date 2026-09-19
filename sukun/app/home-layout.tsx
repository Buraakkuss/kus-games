/** Ana sayfa düzeni — şartname §21. */
import React from 'react';
import { Stack } from 'expo-router';
import { Screen, SectionHeader, Card, ListItem, Row, IconButton, Button } from '@/ui';
import { useT } from '@/lib/i18n';
import { useHomeLayoutStore, PINNED_CARDS, type HomeCardId } from '@/store/homeLayout';

const CARD_LABEL: Record<HomeCardId, 'home.card.nextPrayer' | 'home.card.todayTimes' | 'home.card.hijriDate' | 'home.card.dailyDua' | 'home.card.dailyKnowledge' | 'home.card.dailyName' | 'home.card.religiousDay' | 'home.card.moon'> = {
  nextPrayer: 'home.card.nextPrayer',
  todayTimes: 'home.card.todayTimes',
  hijriDate: 'home.card.hijriDate',
  dailyDua: 'home.card.dailyDua',
  dailyKnowledge: 'home.card.dailyKnowledge',
  dailyName: 'home.card.dailyName',
  religiousDay: 'home.card.religiousDay',
  moon: 'home.card.moon',
};

export default function HomeLayoutScreen() {
  const t = useT();
  const cards = useHomeLayoutStore((s) => s.cards);
  const toggle = useHomeLayoutStore((s) => s.toggle);
  const move = useHomeLayoutStore((s) => s.move);
  const reset = useHomeLayoutStore((s) => s.reset);

  return (
    <Screen scroll>
      <Stack.Screen options={{ headerShown: true, title: t('home.customize') }} />
      <SectionHeader title={t('home.customize')} subtitle={t('home.customizeHint')} />

      <Card padding="sm">
        {cards.map((c, i) => {
          const sabit = PINNED_CARDS.includes(c.id);
          return (
            <ListItem
              key={c.id}
              title={t(CARD_LABEL[c.id])}
              {...(sabit ? { subtitle: t('home.cardPinned') } : {})}
              chevron={false}
              right={
                <Row gap="xs" align="center">
                  <IconButton
                    name="chevronDown"
                    label={t('common.next')}
                    size={16}
                    disabled={i === cards.length - 1}
                    onPress={() => move(c.id, 1)}
                  />
                  <IconButton
                    name="chevronRight"
                    label={t('nav.back')}
                    size={16}
                    disabled={i === 0}
                    onPress={() => move(c.id, -1)}
                  />
                  <IconButton
                    name={c.visible ? 'check' : 'close'}
                    label={c.visible ? t('common.disable') : t('common.enable')}
                    size={18}
                    disabled={sabit}
                    onPress={() => toggle(c.id)}
                  />
                </Row>
              }
            />
          );
        })}
      </Card>

      <Row style={{ marginTop: 16 }}>
        <Button label={t('home.reset')} variant="secondary" icon="refresh" onPress={reset} />
      </Row>
    </Screen>
  );
}
