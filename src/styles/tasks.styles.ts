import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9E9EC',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 14,
  },
  dateLabel: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3E7BE6',
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: '#F3F3F4',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileAvatarFallback: {
    backgroundColor: '#C9D5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarInitial: {
    color: '#375EA6',
    fontSize: 20,
    fontWeight: '700',
  },
  progressInfoWrap: {
    flex: 1,
    marginLeft: 10,
  },
  progressTitle: {
    fontSize: 18,
    color: '#202020',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressTrack: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D1D1D5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#3E7BE6',
  },
  progressMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 30,
    color: '#1B1B1B',
    fontWeight: '700',
    marginBottom: 10,
  },
  statusTabsWrap: {
    backgroundColor: '#F4F4F6',
    borderRadius: 22,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 18,
  },
  statusTabActive: {
    backgroundColor: '#3E7BE6',
  },
  statusTabText: {
    color: '#3E7BE6',
    fontSize: 17,
    fontWeight: '700',
  },
  statusTabTextActive: {
    color: '#FFFFFF',
  },
  quickFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  quickFilterChip: {
    backgroundColor: '#F4F4F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickFilterChipActive: {
    backgroundColor: '#3E7BE6',
  },
  quickFilterText: {
    color: '#3E7BE6',
    fontSize: 13,
    fontWeight: '700',
  },
  quickFilterTextActive: {
    color: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  tasksListWrap: {
    gap: 10,
  },
  taskCard: {
    backgroundColor: '#F7F7F8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskCardAccent: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  taskCardAccentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  taskCardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  taskDescription: {
    fontSize: 14,
    color: '#4F4F4F',
    lineHeight: 20,
    marginBottom: 8,
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  taskMetaText: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '700',
  },
  accentDefault: {
    backgroundColor: '#2F6DDD',
  },
  accentSafe: {
    backgroundColor: '#169116',
  },
  accentWarning: {
    backgroundColor: '#F0B404',
  },
  accentUrgent: {
    backgroundColor: '#F01414',
  },
  accentCompleted: {
    backgroundColor: '#209A2F',
  },
  accentExpired: {
    backgroundColor: '#6D6D71',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: '#F3F3F4',
    borderRadius: 12,
    padding: 18,
  },
  emptyEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  emptyText: {
    color: '#595959',
    fontSize: 16,
    fontWeight: '600',
  },
});
