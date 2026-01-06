# Dopamine Dasher - Analytics Setup Guide

## Overview

Comprehensive analytics tracking to measure user behavior, conversion rates, and product engagement. This guide covers setup for Google Analytics, in-app tracking, and key metrics.

---

## 1. Google Analytics 4 Setup

### Installation
1. Go to https://analytics.google.com
2. Create a new property for Dopamine Dasher
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Add to landing page `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Key Events to Track

#### Landing Page Events
```javascript
// Track page view
gtag('event', 'page_view', {
  'page_title': 'Dopamine Dasher - Home',
  'page_location': window.location.href
});

// Track CTA click
gtag('event', 'click', {
  'event_category': 'engagement',
  'event_label': 'cta_start_first_win',
  'value': 1
});

// Track FAQ expansion
gtag('event', 'faq_expand', {
  'event_category': 'engagement',
  'event_label': 'faq_how_it_helps_adhd',
  'value': 1
});

// Track testimonial view
gtag('event', 'testimonial_view', {
  'event_category': 'engagement',
  'event_label': 'testimonial_sarah_m',
  'value': 1
});

// Track scroll depth
gtag('event', 'scroll_depth', {
  'event_category': 'engagement',
  'event_label': 'scroll_50_percent',
  'value': 50
});
```

#### Onboarding Events
```javascript
// Track flavor selection
gtag('event', 'flavor_select', {
  'event_category': 'onboarding',
  'event_label': 'wall_of_awful',
  'value': 1
});

// Track context selection
gtag('event', 'context_select', {
  'event_category': 'onboarding',
  'event_label': 'the_grind',
  'value': 1
});

// Track theme selection
gtag('event', 'theme_select', {
  'event_category': 'onboarding',
  'event_label': 'cottagecore',
  'value': 1
});

// Track onboarding completion
gtag('event', 'onboarding_complete', {
  'event_category': 'onboarding',
  'event_label': 'full_flow',
  'value': 1
});
```

#### Task Events
```javascript
// Track task selection
gtag('event', 'task_select', {
  'event_category': 'task',
  'event_label': 'reply_to_3_emails',
  'task_duration': '2_minutes',
  'value': 1
});

// Track task completion
gtag('event', 'task_complete', {
  'event_category': 'task',
  'event_label': 'reply_to_3_emails',
  'task_duration': '2_minutes',
  'value': 1
});

// Track confetti trigger
gtag('event', 'confetti_trigger', {
  'event_category': 'engagement',
  'event_label': 'task_completion',
  'value': 1
});

// Track streak update
gtag('event', 'streak_update', {
  'event_category': 'engagement',
  'event_label': 'streak_5',
  'streak_count': 5,
  'value': 1
});
```

#### Conversion Events
```javascript
// Track premium purchase
gtag('event', 'purchase', {
  'event_category': 'conversion',
  'event_label': 'premium_lifetime',
  'value': 29.99,
  'currency': 'USD'
});

// Track email signup
gtag('event', 'email_signup', {
  'event_category': 'conversion',
  'event_label': 'newsletter',
  'value': 1
});

// Track account creation
gtag('event', 'account_create', {
  'event_category': 'conversion',
  'event_label': 'user_signup',
  'value': 1
});
```

---

## 2. In-App Analytics (Mixpanel or Amplitude)

### Mixpanel Setup

#### Installation
```bash
npm install mixpanel-browser
```

#### Initialize
```javascript
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_TOKEN', {
  track_pageview: true,
  persistence: 'localStorage'
});
```

#### Key Events

**User Properties**
```javascript
mixpanel.identify(userId);
mixpanel.people.set({
  'ADHD': true,
  'Flavor': 'Wall of Awful',
  'Context': 'The Grind',
  'Theme': 'Cottagecore',
  'Premium': false,
  'Streak': 5,
  'Tasks Completed': 12,
  'Total Time': 45 // minutes
});
```

**Event Tracking**
```javascript
// Task completion
mixpanel.track('Task Completed', {
  'task_name': 'Reply to 3 emails',
  'duration': '2_minutes',
  'context': 'The Grind',
  'streak': 5,
  'total_tasks_today': 3
});

// Premium purchase
mixpanel.track('Premium Purchase', {
  'amount': 29.99,
  'currency': 'USD',
  'plan': 'lifetime',
  'source': 'dashboard'
});

// Feature usage
mixpanel.track('Feature Used', {
  'feature': 'smart_suggestions',
  'context': 'The Grind',
  'result': 'task_selected'
});

// Streak milestone
mixpanel.track('Streak Milestone', {
  'streak': 10,
  'total_tasks': 50,
  'days_active': 10
});
```

---

## 3. Key Metrics Dashboard

### Top-Level Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Daily Active Users (DAU) | 100+ | Daily |
| Monthly Active Users (MAU) | 1000+ | Monthly |
| Conversion Rate | 5-10% | Daily |
| Average Session Duration | 3-5 min | Daily |
| Bounce Rate | 30-40% | Daily |
| Premium Conversion Rate | 10-15% | Weekly |
| User Retention (Day 7) | 40%+ | Weekly |
| User Retention (Day 30) | 20%+ | Monthly |

### Engagement Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Tasks Completed / User | 5+ | Daily |
| Average Streak Length | 5+ days | Weekly |
| Feature Adoption Rate | 70%+ | Weekly |
| Session Frequency | 2+ sessions/day | Daily |
| Time in App | 5-10 min/session | Daily |

### Conversion Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Landing Page CTR | 5-10% | Daily |
| Onboarding Completion | 80%+ | Daily |
| Email Signup Rate | 10-20% | Daily |
| Premium Conversion | 10-15% | Weekly |
| Referral Rate | 5%+ | Weekly |

### Acquisition Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Cost Per Acquisition (CPA) | $5-$20 | Weekly |
| Return on Ad Spend (ROAS) | 3:1+ | Weekly |
| Organic Traffic % | 30%+ | Weekly |
| Social Traffic % | 20%+ | Weekly |
| Paid Traffic % | 20%+ | Weekly |

---

## 4. Custom Dashboards

### Dashboard 1: Executive Overview
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Conversion Rate (%)
- Premium Revenue
- Top Traffic Source

### Dashboard 2: User Funnel
- Landing Page Visitors
- CTA Clicks
- Onboarding Starts
- Onboarding Completions
- First Task Completed
- Premium Conversions

### Dashboard 3: Engagement
- Daily Active Users
- Average Session Duration
- Tasks Completed / User
- Average Streak Length
- Feature Adoption Rate
- Retention (Day 7, 30, 60)

### Dashboard 4: Acquisition
- Traffic by Source (Organic, Paid, Social, Referral)
- Cost Per Acquisition (CPA)
- Return on Ad Spend (ROAS)
- Top Referral Sources
- Top Keywords

### Dashboard 5: Premium
- Premium Conversions
- Premium Revenue
- Premium Churn Rate
- Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)

---

## 5. Cohort Analysis

### Cohort 1: By Acquisition Source
Compare user behavior by where they came from:
- Organic search
- Paid ads (Facebook, Google, TikTok)
- Social media
- Referrals
- Email

### Cohort 2: By Flavor Selection
Compare engagement by ADHD struggle type:
- Wall of Awful (task initiation issues)
- Squirrel Brain (focus/distraction issues)
- The Blahs (low energy)

### Cohort 3: By Context Selection
Compare engagement by life area:
- The Nest (home/personal)
- The Grind (work/productivity)
- The Self (health/personal growth)

### Cohort 4: By Theme Selection
Compare engagement by aesthetic preference:
- Cottagecore
- Cyberpunk
- Ocean

### Cohort 5: By Signup Date
Compare retention and engagement over time:
- Week 1 signups
- Month 1 signups
- Month 2 signups
- etc.

---

## 6. Funnel Analysis

### Funnel 1: Landing Page to Premium
1. Landing Page View
2. CTA Click
3. Onboarding Start
4. Flavor Selection
5. Context Selection
6. Theme Selection
7. First Task Selection
8. First Task Completion
9. Premium Purchase

**Target:** 5-10% conversion rate

### Funnel 2: Onboarding to Active User
1. Onboarding Start
2. Flavor Selection
3. Context Selection
4. Theme Selection
5. Dashboard View
6. First Task Selection
7. First Task Completion
8. Second Task Completion
9. Third Task Completion

**Target:** 80%+ completion rate

### Funnel 3: Email Signup to Premium
1. Email Signup
2. Email Open
3. Landing Page Click
4. Onboarding Start
5. Premium Purchase

**Target:** 15-20% conversion rate

---

## 7. Retention Analysis

### Day 1 Retention
Percentage of users who return on Day 1 after signup

**Target:** 60%+

### Day 7 Retention
Percentage of users who return within 7 days of signup

**Target:** 40%+

### Day 30 Retention
Percentage of users who return within 30 days of signup

**Target:** 20%+

### Churn Analysis
- When do users stop using the app?
- What's the average user lifetime?
- What features correlate with retention?

---

## 8. Attribution Tracking

### UTM Parameters
Add to all marketing links:

```
?utm_source=tiktok&utm_medium=social&utm_campaign=launch
?utm_source=google&utm_medium=cpc&utm_campaign=adhd_keywords
?utm_source=email&utm_medium=newsletter&utm_campaign=week1
```

### Campaign Tracking
- Social media campaigns
- Paid ad campaigns
- Email campaigns
- Influencer partnerships
- Referral programs

---

## 9. Alerts & Notifications

### Set Up Alerts For:
- Conversion rate drops below 3%
- Daily active users drop below 50
- Premium conversion rate drops below 5%
- Bounce rate exceeds 50%
- Average session duration drops below 2 minutes
- Server errors exceed 1%

---

## 10. Reporting Schedule

### Daily Report
- DAU
- Conversion rate
- Top traffic source
- Any alerts

### Weekly Report
- DAU, MAU
- Conversion rate
- Premium conversions
- Top traffic sources
- Funnel analysis
- Cohort performance

### Monthly Report
- User growth
- Retention metrics
- Revenue
- Customer acquisition cost
- Lifetime value
- Churn analysis
- Recommendations

---

## 11. Tools & Resources

### Analytics Platforms
- **Google Analytics 4** (free) - Landing page and web traffic
- **Mixpanel** (free tier) - In-app analytics and events
- **Amplitude** (free tier) - User behavior and cohorts
- **Segment** (free tier) - Data pipeline and integration

### Dashboarding
- **Google Data Studio** (free) - Create dashboards from GA4
- **Metabase** (free, self-hosted) - Business intelligence
- **Tableau** (paid) - Advanced dashboarding
- **Looker** (paid) - Enterprise analytics

### Heatmapping & Session Recording
- **Hotjar** (free tier) - Heatmaps and session recordings
- **Microsoft Clarity** (free) - User behavior analytics
- **FullStory** (paid) - Advanced session replay

### A/B Testing
- **Google Optimize** (free with GA4) - Landing page A/B tests
- **Optimizely** (paid) - Advanced experimentation
- **VWO** (paid) - Visual website optimizer

---

## 12. Implementation Checklist

### Week 1: Setup
- [ ] Set up Google Analytics 4
- [ ] Add GA4 tracking code to landing page
- [ ] Create GA4 custom events
- [ ] Set up Mixpanel account
- [ ] Add Mixpanel tracking to app
- [ ] Create Mixpanel custom events

### Week 2: Dashboards
- [ ] Create GA4 dashboard (Executive Overview)
- [ ] Create Mixpanel dashboard (User Funnel)
- [ ] Create Data Studio dashboard (Engagement)
- [ ] Set up daily email reports

### Week 3: Analysis
- [ ] Set up cohort analysis
- [ ] Set up funnel analysis
- [ ] Set up retention analysis
- [ ] Set up attribution tracking

### Week 4: Optimization
- [ ] Review analytics
- [ ] Identify optimization opportunities
- [ ] Set up A/B tests
- [ ] Create weekly reporting schedule

---

## Next Steps

1. ✅ Plan analytics strategy
2. ⬜ Set up Google Analytics 4
3. ⬜ Set up Mixpanel
4. ⬜ Create custom events
5. ⬜ Build dashboards
6. ⬜ Set up alerts
7. ⬜ Start tracking and analyzing
8. ⬜ Optimize based on data
