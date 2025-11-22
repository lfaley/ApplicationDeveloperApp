# Risk Register & Management
## Track and Mitigate Project Risks

**Version:** 1.0  
**Created:** November 16, 2025  
**Purpose:** Identify, assess, and manage project risks proactively

---

## What is a Risk Register?

A **Risk Register** is a living document that tracks potential problems that could impact your project's success. It helps you:

- ✅ Identify risks before they become issues
- ✅ Prioritize which risks need attention
- ✅ Plan mitigation strategies
- ✅ Assign ownership for risk management
- ✅ Track risk status over time

---

## Risk Categories

### Technical Risks
- Technology not performing as expected
- Integration challenges
- Scalability issues
- Technical debt
- Dependency failures

### Resource Risks
- Team availability
- Skill gaps
- Budget constraints
- Tool/infrastructure access

### Schedule Risks
- Scope creep
- Underestimated complexity
- External dependencies
- Blocked work

### External Risks
- Vendor changes
- Market shifts
- Regulatory changes
- Third-party API changes

---

## Risk Assessment Matrix

### Impact Levels

| Impact | Description | Example |
|--------|-------------|---------|
| **5 - Critical** | Project failure | Complete data loss, system unusable |
| **4 - High** | Major setback | 2+ week delay, core feature broken |
| **3 - Medium** | Noticeable impact | 1 week delay, non-critical feature affected |
| **2 - Low** | Minor inconvenience | 1-2 day delay, cosmetic issues |
| **1 - Minimal** | Negligible | Few hour delay, trivial workaround |

### Probability Levels

| Probability | Likelihood | Example |
|-------------|------------|---------|
| **5 - Very High** | 80-100% | Already seeing warning signs |
| **4 - High** | 60-80% | Likely to occur without intervention |
| **3 - Medium** | 40-60% | Could go either way |
| **2 - Low** | 20-40% | Unlikely but possible |
| **1 - Very Low** | 0-20% | Rare, but we've considered it |

### Risk Score

**Risk Score = Impact × Probability**

| Score | Priority | Action |
|-------|----------|--------|
| 20-25 | 🔴 CRITICAL | Immediate action required |
| 15-19 | 🟠 HIGH | Address ASAP |
| 8-14 | 🟡 MEDIUM | Plan mitigation |
| 4-7 | 🟢 LOW | Monitor |
| 1-3 | ⚪ MINIMAL | Accept |

---

## Risk Register Template

### Risk Entry Format

```markdown
## RISK-[NUMBER]: [Risk Title]

**Identified:** YYYY-MM-DD  
**Category:** [Technical | Resource | Schedule | External]  
**Status:** [Active | Mitigated | Occurred | Closed]  
**Owner:** [Name]

### Description
[What is the risk? What could go wrong?]

### Impact
**Level:** [1-5]  
**Description:** [What happens if this occurs?]

### Probability
**Level:** [1-5]  
**Rationale:** [Why is this likely/unlikely?]

### Risk Score
**Score:** [Impact × Probability]  
**Priority:** [Critical | High | Medium | Low | Minimal]

### Indicators
**Early Warning Signs:**
- [Sign 1 that risk is materializing]
- [Sign 2]

### Mitigation Strategy
**Preventive Actions:** (Reduce probability)
- [ ] [Action to prevent risk]
- [ ] [Action to prevent risk]

**Contingency Plan:** (Reduce impact if occurs)
- [ ] [What to do if risk happens]
- [ ] [Backup plan]

**Fallback Position:**
[Worst case scenario plan]

### Timeline
**Review Date:** [Next check-in]  
**Mitigation Deadline:** [When actions must be complete]

### Updates
**[YYYY-MM-DD]:** [Status update]  
**[YYYY-MM-DD]:** [Status update]
```

---

## Complete Risk Register Example

```markdown
# Project Risk Register: Task Management App

**Project:** Task Management Application  
**Last Updated:** 2025-11-16  
**Risk Owner:** John Smith (Project Lead)

---

## Summary Dashboard

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 Critical (20-25) | 1 | 1 Active |
| 🟠 High (15-19) | 2 | 2 Active |
| 🟡 Medium (8-14) | 3 | 2 Active, 1 Mitigated |
| 🟢 Low (4-7) | 2 | 2 Monitoring |

**Total Active Risks:** 7

---

## RISK-001: Third-Party API Rate Limits

**Identified:** 2025-11-16  
**Category:** Technical  
**Status:** Active  
**Owner:** Jane Doe (Backend Lead)

### Description
We're integrating with SendGrid for email notifications. Their free tier 
limits us to 100 emails/day. If our user base grows quickly, we could hit 
this limit and notifications would fail.

### Impact
**Level:** 4 (High)  
**Description:** Users wouldn't receive critical notifications (password 
resets, task assignments). This degrades user experience significantly 
and could cause support issues.

### Probability
**Level:** 4 (High)  
**Rationale:** We're planning aggressive growth marketing. Based on similar 
apps, 30% of users trigger email notifications daily. With 500 users, we'd 
hit 150 emails/day.

### Risk Score
**Score:** 16 (4 × 4)  
**Priority:** 🟠 HIGH

### Indicators
**Early Warning Signs:**
- Email send volume reaches 70/day (70% of limit)
- User signups exceed 300
- SendGrid dashboard shows warning alerts

### Mitigation Strategy
**Preventive Actions:**
- [x] Research SendGrid pricing tiers
- [ ] Implement email queuing system
- [ ] Set up monitoring for daily email volume
- [ ] Budget $15/month for paid tier (40,000 emails)

**Contingency Plan:**
- [ ] Have AWS SES configured as backup (takes 1 day to set up)
- [ ] Create temporary batch notification system
- [ ] Prioritize critical emails only if near limit

**Fallback Position:**
If both fail: Temporarily disable non-critical notifications, display 
in-app messages instead, upgrade to SendGrid Pro tier ($90/month).

### Timeline
**Review Date:** 2025-12-01  
**Mitigation Deadline:** 2025-11-30 (before marketing campaign)

### Updates
**2025-11-16:** Risk identified during architecture review  
**2025-11-18:** Researched alternatives. SendGrid paid tier best option.  
**2025-11-20:** Email queuing system implemented. Monitoring added.

---

## RISK-002: Solo Developer Key Person Risk

**Identified:** 2025-11-16  
**Category:** Resource  
**Status:** Active  
**Owner:** Bob Wilson (Architect)

### Description
Only one developer (John) knows the authentication system. If John is 
unavailable (illness, vacation, leaves company), authentication bugs 
or changes would be blocked.

### Impact
**Level:** 5 (Critical)  
**Description:** Authentication is core to the app. Any bug or security 
issue would be high-priority but unfixable without John. Could halt 
development for days/weeks.

### Probability
**Level:** 3 (Medium)  
**Rationale:** John is reliable, but everyone gets sick or takes vacation. 
People also change jobs. Over a 6-month project, 50% chance John is 
unavailable at some point.

### Risk Score
**Score:** 15 (5 × 3)  
**Priority:** 🟠 HIGH

### Indicators
**Early Warning Signs:**
- Authentication code poorly documented
- No other developer has touched auth code
- John mentions feeling burned out
- John schedules vacation

### Mitigation Strategy
**Preventive Actions:**
- [ ] Schedule knowledge transfer session
- [ ] Create authentication documentation
- [ ] Have second developer pair program on auth feature
- [ ] Implement comprehensive auth tests (reduce need for expertise)
- [ ] Document common auth issues and solutions

**Contingency Plan:**
- [ ] Identify external consultant familiar with our auth stack
- [ ] Ensure tests cover all auth scenarios (can verify fixes)
- [ ] Create detailed troubleshooting guide

**Fallback Position:**
If unavailable during critical auth issue: Engage external security 
consultant ($150-300/hour). Revert to previous stable version if necessary.

### Timeline
**Review Date:** 2025-11-23 (weekly until mitigated)  
**Mitigation Deadline:** 2025-11-30

### Updates
**2025-11-16:** Risk identified during team assessment  
**2025-11-17:** Scheduled knowledge transfer for 2025-11-20

---

## RISK-003: Database Schema Migration Complexity

**Identified:** 2025-11-16  
**Category:** Technical  
**Status:** Mitigated  
**Owner:** John Smith

### Description
Our database schema is evolving rapidly. Complex migrations could cause 
data loss or downtime during deployments.

### Impact
**Level:** 4 (High)  
**Description:** Data loss would be catastrophic. Even rollback could 
be time-consuming. Downtime frustrates users.

### Probability
**Level:** 2 (Low - after mitigation)  
**Rationale:** Using TypeORM with migration system. Strict review process. 
Still possible but unlikely with safeguards.

### Risk Score
**Score:** 8 (4 × 2)  
**Priority:** 🟡 MEDIUM

### Indicators
**Early Warning Signs:**
- Migration script errors in dev/staging
- Complex column type changes
- Data transformation requirements
- Multiple foreign key changes

### Mitigation Strategy
**Preventive Actions:**
- [x] Implement TypeORM migrations
- [x] Set up staging environment
- [x] Require migration testing before production
- [x] Create database backup automation
- [x] Enforce migration review by 2 developers
- [ ] Document rollback procedures

**Contingency Plan:**
- [x] Automated pre-deployment database backups
- [x] Point-in-time recovery configured (1 hour intervals)
- [ ] Migration rollback scripts tested

**Fallback Position:**
If migration fails in production: Immediately restore from backup 
(5-minute data loss max). Debug issue in staging. Deploy fix.

### Timeline
**Review Date:** Monthly  
**Mitigation Deadline:** Ongoing

### Updates
**2025-11-16:** Risk identified  
**2025-11-18:** Migration system implemented  
**2025-11-20:** All safeguards in place. Status changed to Mitigated.

---

## RISK-004: Scope Creep

**Identified:** 2025-11-16  
**Category:** Schedule  
**Status:** Active  
**Owner:** John Smith

### Description
Stakeholders keep suggesting "small" feature additions. Without strict 
scope management, we could delay launch by weeks/months.

### Impact
**Level:** 3 (Medium)  
**Description:** Delayed launch means delayed revenue and user feedback. 
Team morale drops. Opportunity cost.

### Probability
**Level:** 4 (High)  
**Rationale:** Already happened twice in past month. Stakeholders 
enthusiastic. No formal change control process yet.

### Risk Score
**Score:** 12 (3 × 4)  
**Priority:** 🟡 MEDIUM

### Indicators
**Early Warning Signs:**
- "Quick feature" suggestions in meetings
- Tasks added to sprint without planning
- MVP definition becoming fuzzy
- "While we're at it..." conversations

### Mitigation Strategy
**Preventive Actions:**
- [x] Document MVP scope in PRD.md
- [ ] Create formal change request process
- [ ] Set up "Post-MVP" backlog for future features
- [ ] Weekly scope review with stakeholders
- [ ] Show impact of additions on timeline

**Contingency Plan:**
- [ ] Define "phase 2" explicitly
- [ ] Get stakeholder sign-off on MVP freeze
- [ ] Time-box features: must be done in X hours or cut

**Fallback Position:**
If scope grows too much: Push launch date OR cut lower-priority 
original features OR reduce quality/testing (not recommended).

### Timeline
**Review Date:** Weekly  
**Mitigation Deadline:** 2025-11-20

### Updates
**2025-11-16:** Risk identified after third "small addition" request

---

## RISK-005: Third-Party Library Vulnerabilities

**Identified:** 2025-11-16  
**Category:** External  
**Status:** Active  
**Owner:** Jane Doe

### Description
We're using 47 npm packages. Security vulnerabilities could be discovered 
in dependencies, requiring urgent updates.

### Impact
**Level:** 4 (High)  
**Description:** High-severity vulnerability could force immediate patching, 
delaying planned work. Could expose user data if exploited before patched.

### Probability
**Level:** 2 (Low)  
**Rationale:** Most packages are mature and maintained. We review 
security reports weekly. But npm ecosystem has had issues before.

### Risk Score
**Score:** 8 (4 × 2)  
**Priority:** 🟡 MEDIUM

### Indicators
**Early Warning Signs:**
- npm audit showing vulnerabilities
- Dependabot alerts in GitHub
- Security mailing list notifications
- Popular package announces EOL

### Mitigation Strategy
**Preventive Actions:**
- [x] Enable Dependabot alerts
- [x] Set up weekly npm audit checks
- [ ] Subscribe to security mailing lists
- [ ] Document package update process
- [ ] Keep dependencies updated regularly

**Contingency Plan:**
- [ ] Budget time each sprint for security updates
- [ ] Have emergency update process (can deploy in 2 hours)
- [ ] Know how to temporarily disable affected features

**Fallback Position:**
If critical vulnerability in core package: Drop everything to patch. 
If no fix available: Find alternative package or write custom solution.

### Timeline
**Review Date:** Weekly  
**Mitigation Deadline:** Ongoing

### Updates
**2025-11-16:** Risk identified. Dependabot enabled.

---
```

---

## Risk Management Process

### 1. Identification (Weekly)
- Review project status
- Ask "What could go wrong?"
- Check indicators of existing risks
- Add new risks to register

### 2. Assessment
- Score impact and probability
- Calculate risk score
- Prioritize by score
- Assign owner

### 3. Planning
- Define mitigation actions
- Set deadlines
- Assign responsibilities
- Document contingency plans

### 4. Monitoring
- Check warning indicators
- Review risk status
- Update probability as situation changes
- Close resolved risks

### 5. Response
- Execute mitigation plans
- Activate contingencies if risk occurs
- Document lessons learned
- Update register

---

## Integration with Project Planning

**PRD.md** → Risk section: "What could prevent success?"  
**IMPLEMENTATION_CHECKLIST.md** → Reference high-priority risks  
**Context Summaries** → Track risk status daily  
**ADRs** → Document decisions made to mitigate risks  
**TESTING_CHECKLIST.md** → Include tests that verify risk mitigations

---

## Risk Register Maintenance

**Weekly:** Review top 5 risks, update status  
**Sprint Start:** Assess new risks from upcoming work  
**Sprint End:** Close mitigated risks, celebrate wins  
**Monthly:** Full risk register review  
**Project Milestone:** Comprehensive risk assessment

---

## Best Practices

### DO ✅
- Be honest about probability (don't downplay risks)
- Document even "unlikely" risks
- Assign clear ownership
- Review risks regularly
- Celebrate mitigated risks
- Learn from occurred risks

### DON'T ❌
- Ignore small risks (they compound)
- Leave risks unowned
- Set and forget
- Blame people when risks occur
- Create risks without mitigation plans
- Keep risk register secret

---

## Quick Risk Assessment

**For rapid risk triage, ask:**

1. **What could go wrong?** (Identify)
2. **How bad would it be?** (Impact)
3. **How likely is it?** (Probability)
4. **Can we prevent it?** (Mitigation)
5. **What if it happens anyway?** (Contingency)

If risk score > 15: Address immediately  
If risk score 8-15: Plan mitigation this week  
If risk score < 8: Monitor

---

## Conclusion

A Risk Register transforms worry into action. Instead of vague anxiety about "what might go wrong," you have:

- ✅ Specific, named risks
- ✅ Quantified priorities
- ✅ Concrete mitigation plans
- ✅ Assigned ownership
- ✅ Peace of mind

**15 minutes per week** managing risks saves hours/days responding to crises.

---

**Version:** 1.0  
**Created:** November 16, 2025  
**License:** Free to use and adapt  
**Based on:** PMI PMBOK risk management best practices
