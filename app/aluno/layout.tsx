'use client';

import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { PageContainer } from '@/components/PageContainer';

const GAP = '1.25rem';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    backgroundColor: 'hsl(240, 33%, 98%)',
    overflow: 'hidden',
  },
  innerRow: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  contentArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    padding: GAP,
    paddingLeft: GAP,
    paddingRight: GAP,
    paddingBottom: GAP,
    paddingTop: 0,
  },
  contentCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    borderRadius: '0.75rem',
  },
  main: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingBottom: '1.5rem',
  },
};

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div style={styles.wrapper}>
        <div style={styles.innerRow}>
          <Navigation />
          <div style={styles.contentArea}>
            <div style={styles.contentCard}>
              <Header />
              <main style={styles.main}>
                <PageContainer>{children}</PageContainer>
              </main>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}