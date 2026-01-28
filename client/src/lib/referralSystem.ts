/**
 * Referral Incentive System
 * Reward users for inviting friends to Dopamine Dasher
 */

export interface ReferralReward {
  referrerBonus: number; // Coins given to person who refers
  refereeBonus: number;  // Coins given to new user
  description: string;
}

export const REFERRAL_REWARDS: ReferralReward = {
  referrerBonus: 500,  // 500 coins for successful referral
  refereeBonus: 250,   // 250 coins for new user from referral
  description: 'Invite a friend and both of you get bonus coins!',
};

export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: number;
  usageCount: number;
  lastUsedAt?: number;
}

export interface ReferralTrack {
  referrerId: string;
  refereeId: string;
  referralCode: string;
  createdAt: number;
  rewardClaimed: boolean;
  claimedAt?: number;
}

export class ReferralSystem {
  private storageKey = 'referral_codes';
  private trackingKey = 'referral_tracking';

  /**
   * Generate a unique referral code for a user
   */
  generateReferralCode(userId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `DD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Create referral code for user
   */
  createReferralCode(userId: string): ReferralCode {
    const code = this.generateReferralCode(userId);
    const referralCode: ReferralCode = {
      code,
      userId,
      createdAt: Date.now(),
      usageCount: 0,
    };

    const codes = this.getAllReferralCodes();
    codes.push(referralCode);
    localStorage.setItem(this.storageKey, JSON.stringify(codes));

    return referralCode;
  }

  /**
   * Get all referral codes
   */
  getAllReferralCodes(): ReferralCode[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Get referral code for specific user
   */
  getReferralCodeForUser(userId: string): ReferralCode | null {
    const codes = this.getAllReferralCodes();
    return codes.find(c => c.userId === userId) || null;
  }

  /**
   * Validate and use referral code
   */
  useReferralCode(code: string, newUserId: string): { valid: boolean; referrerId?: string; bonus: number } {
    const codes = this.getAllReferralCodes();
    const referralCode = codes.find(c => c.code === code);

    if (!referralCode) {
      return { valid: false, bonus: 0 };
    }

    // Update usage count
    referralCode.usageCount++;
    referralCode.lastUsedAt = Date.now();
    localStorage.setItem(this.storageKey, JSON.stringify(codes));

    // Track referral
    const tracking: ReferralTrack = {
      referrerId: referralCode.userId,
      refereeId: newUserId,
      referralCode: code,
      createdAt: Date.now(),
      rewardClaimed: false,
    };

    const trackingData = this.getAllReferralTracking();
    trackingData.push(tracking);
    localStorage.setItem(this.trackingKey, JSON.stringify(trackingData));

    return {
      valid: true,
      referrerId: referralCode.userId,
      bonus: REFERRAL_REWARDS.refereeBonus,
    };
  }

  /**
   * Get all referral tracking data
   */
  getAllReferralTracking(): ReferralTrack[] {
    const stored = localStorage.getItem(this.trackingKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Get referrals for a specific user (people they referred)
   */
  getReferralsForUser(userId: string): ReferralTrack[] {
    const tracking = this.getAllReferralTracking();
    return tracking.filter(t => t.referrerId === userId);
  }

  /**
   * Claim referral reward
   */
  claimReferralReward(trackingId: number): boolean {
    const tracking = this.getAllReferralTracking();
    const referral = tracking[trackingId];

    if (!referral || referral.rewardClaimed) {
      return false;
    }

    referral.rewardClaimed = true;
    referral.claimedAt = Date.now();
    localStorage.setItem(this.trackingKey, JSON.stringify(tracking));

    return true;
  }

  /**
   * Get pending rewards for user (referrals not yet claimed)
   */
  getPendingRewards(userId: string): number {
    const referrals = this.getReferralsForUser(userId);
    const pendingCount = referrals.filter(r => !r.rewardClaimed).length;
    return pendingCount * REFERRAL_REWARDS.referrerBonus;
  }

  /**
   * Get total earned from referrals
   */
  getTotalReferralEarnings(userId: string): number {
    const referrals = this.getReferralsForUser(userId);
    const claimedCount = referrals.filter(r => r.rewardClaimed).length;
    return claimedCount * REFERRAL_REWARDS.referrerBonus;
  }

  /**
   * Share referral link
   */
  generateShareLink(referralCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  }

  /**
   * Get referral code from URL
   */
  getReferralCodeFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref');
  }
}

export const referralSystem = new ReferralSystem();
