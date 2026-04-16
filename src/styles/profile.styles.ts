import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
    minHeight: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 34,
    color: '#3B74D7',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#4A80F0',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  logoutButtonText: {
    color: '#2B5CB8',
    fontWeight: '700',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2B5CB8',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailText: {
    color: '#E6EEFF',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  levelBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  levelText: {
    color: '#2B5CB8',
    fontSize: 18,
    fontWeight: '700',
  },
  levelBadgeGold: {
    backgroundColor: '#F8E08E',
    borderColor: '#C8A336',
  },
  levelTextGold: {
    color: '#7A5A00',
  },
  levelBadgeSilver: {
    backgroundColor: '#E3E7EE',
    borderColor: '#9DA9B8',
  },
  levelTextSilver: {
    color: '#5B6777',
  },
  levelBadgeBronze: {
    backgroundColor: '#E8C4A3',
    borderColor: '#A96A3D',
  },
  levelTextBronze: {
    color: '#7A3F1E',
  },
  levelBadgeStarter: {
    backgroundColor: '#E4F0FF',
    borderColor: '#8FB1E8',
  },
  levelTextStarter: {
    color: '#2B5CB8',
  },
  loadingWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  statCardCompleted: {
    borderTopWidth: 6,
    borderTopColor: '#149E2D',
  },
  statCardExpired: {
    borderTopWidth: 6,
    borderTopColor: '#E53935',
  },
  statLabel: {
    color: '#404040',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111111',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#3B74D7',
    fontWeight: '700',
    marginBottom: 10,
  },
  badgesList: {
    gap: 10,
  },
  badgeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  badgeTextWrap: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '700',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#555555',
  },
  emptyBadges: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  emptyBadgesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  emptyBadgesDescription: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
});
